const bcrypt = require('bcrypt');
const crypto = require('crypto');
const {
  normalizeEmail,
  normalizeUsername,
  validateEmailFormat,
  validateUsername,
  validatePasswordStrength,
  maskEmail,
} = require('../utils/validation');
const { generateOtpDigits } = require('../utils/otp');
const {
  sendVerificationOtp,
  sendPasswordResetOtp,
  sendEmailRecoveryOtp,
  sendVerificationSuccess,
} = require('../utils/emailService');

const OTP_TTL_MS = 5 * 60 * 1000;
const RESEND_COOLDOWN_MS = 60 * 1000;
const MAX_OTP_ATTEMPTS = 5;
const LOCKOUT_MS = 30 * 60 * 1000;

const { buildPublicProfile } = require('../utils/userProfile');
const { defaultGamificationProgress } = require('../services/achievementService');

function isLegacyVerified(doc) {
  return doc.verified === undefined || doc.verified === null || doc.verified === true;
}

function publicUser(doc) {
  const profile = buildPublicProfile(doc);
  if (!profile) return null;
  return { ...profile, verified: isLegacyVerified(doc) };
}

async function ensureUsername(usersCollection, email, fallbackName) {
  const base = normalizeUsername(fallbackName || email.split('@')[0]).replace(/[^a-z0-9_]/g, '') || 'user';
  let candidate = base.slice(0, 32);
  let n = 0;
  while (n < 100) {
    const exists = await usersCollection.findOne({
      username: candidate,
      email: { $ne: normalizeEmail(email) },
    });
    if (!exists) return candidate;
    n += 1;
    candidate = `${base.slice(0, 28)}_${n}`;
  }
  return `${base}_${crypto.randomBytes(4).toString('hex')}`;
}

async function checkOtpHash(storedHash, plainOtp) {
  if (!storedHash || !plainOtp) return false;
  return bcrypt.compare(String(plainOtp).trim(), storedHash);
}

function otpLocked(doc, prefix) {
  const until = doc[`${prefix}LockUntil`];
  return until && new Date(until) > new Date();
}

module.exports = (usersCollection) => ({
  async signup(req, res) {
    try {
      const body = req.body && typeof req.body === 'object' ? req.body : {};
      if (process.env.NODE_ENV !== 'production') {
        console.log('[signup] body keys:', Object.keys(body), 'content-type:', req.headers['content-type']);
      }
      const name = body.name;
      const usernameRaw = body.username ?? body.name;
      const emailRaw = body.email;
      const password = String(body.password ?? '');
      const confirmPassword = String(
        body.confirmPassword ?? body.confirm_password ?? body.confirm ?? '',
      );

      const errors = {};
      const usernameTrimmed = String(usernameRaw ?? '').trim();
      const emailTrimmed = String(emailRaw ?? '').trim();

      if (!usernameTrimmed) errors.username = 'Username is required';
      if (!emailTrimmed) errors.email = 'Email is required';
      if (!password) errors.password = 'Password is required';
      if (!confirmPassword) errors.confirmPassword = 'Please confirm your password';

      if (Object.keys(errors).length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Please fix the errors below',
          errors,
        });
      }

      if (password !== confirmPassword) {
        return res.status(400).json({
          success: false,
          message: 'Passwords do not match',
          errors: { confirmPassword: 'Passwords do not match' },
        });
      }

      const uVal = validateUsername(usernameTrimmed);
      if (!uVal.ok) {
        return res.status(400).json({
          success: false,
          message: uVal.message,
          errors: { username: uVal.message },
        });
      }

      const eVal = validateEmailFormat(emailTrimmed);
      if (!eVal.ok) {
        return res.status(400).json({
          success: false,
          message: eVal.message,
          errors: { email: eVal.message },
        });
      }

      const pVal = validatePasswordStrength(password);
      if (!pVal.ok) {
        return res.status(400).json({
          success: false,
          message: pVal.message,
          errors: { password: pVal.message },
        });
      }

      const emailNorm = eVal.email;
      const userNorm = uVal.username;

      const [byEmail, byUser] = await Promise.all([
        usersCollection.findOne({ email: emailNorm }),
        usersCollection.findOne({ username: userNorm }),
      ]);

      if (byEmail) {
        return res.status(400).json({
          success: false,
          message: 'Email is already registered',
          errors: { email: 'Email is already registered' },
        });
      }
      if (byUser) {
        return res.status(400).json({
          success: false,
          message: 'Username is already taken',
          errors: { username: 'Username is already taken' },
        });
      }

      const hashedPassword = await bcrypt.hash(password, 12);
      const otp = generateOtpDigits(6);
      const otpHash = await bcrypt.hash(otp, 10);

      const displayName = name ? String(name).trim().slice(0, 80) : userNorm;

      await usersCollection.insertOne({
        username: userNorm,
        email: emailNorm,
        name: displayName,
        password: hashedPassword,
        verified: false,
        verificationOTPHash: otpHash,
        verificationOTPExpiry: new Date(Date.now() + OTP_TTL_MS),
        verificationAttempts: 0,
        verificationLockUntil: null,
        gamification: defaultGamificationProgress(),
        profileCompletion: 0,
        bio: '',
        displayName: displayName,
        profilePicture: null,
        badgeHistory: [],
        createdAt: new Date(),
        lastResendVerificationAt: new Date(0),
      });

      await sendVerificationOtp(emailNorm, otp, displayName);

      return res.status(201).json({
        success: true,
        needsVerification: true,
        message: 'Account created. Check your email for a verification code.',
        email: emailNorm,
      });
    } catch (err) {
      console.error('signup', err);
      if (err.code === 11000) {
        return res.status(400).json({ success: false, message: 'Username or email already exists' });
      }
      return res.status(500).json({ success: false, message: 'Server error' });
    }
  },

  async login(req, res) {
    try {
      const { identifier, password, email } = req.body;
      const raw = identifier !== undefined ? identifier : email;

      if (!raw || !password) {
        return res.status(400).json({ success: false, message: 'Username/email and password required' });
      }

      const idStr = String(raw).trim();
      let user;

      if (idStr.includes('@')) {
        const eVal = validateEmailFormat(idStr);
        if (!eVal.ok) return res.status(400).json({ success: false, message: 'Invalid email format' });
        user = await usersCollection.findOne({ email: eVal.email });
      } else {
        user = await usersCollection.findOne({ username: normalizeUsername(idStr) });
      }

      if (!user) {
        return res.status(400).json({ success: false, message: 'Invalid credentials' });
      }

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(400).json({ success: false, message: 'Invalid credentials' });
      }

      if (!user.username && user.email) {
        const uname = await ensureUsername(usersCollection, user.email, user.name);
        await usersCollection.updateOne({ _id: user._id }, { $set: { username: uname } });
        user.username = uname;
      }

      return res.json({
        success: true,
        message: 'Login successful',
        user: publicUser(user),
      });
    } catch (err) {
      console.error('login', err);
      return res.status(500).json({ success: false, message: 'Server error' });
    }
  },

  async verifyEmail(req, res) {
    try {
      const { email, otp } = req.body;
      const eVal = validateEmailFormat(email);
      if (!eVal.ok) return res.status(400).json({ success: false, message: eVal.message });
      if (!otp || String(otp).length !== 6) {
        return res.status(400).json({ success: false, message: 'Enter the 6-digit code' });
      }

      const user = await usersCollection.findOne({ email: eVal.email });
      if (!user) return res.status(404).json({ success: false, message: 'Account not found' });

      if (otpLocked(user, 'verification')) {
        return res.status(423).json({ success: false, message: 'Too many attempts. Try again later.' });
      }

      if (!user.verificationOTPHash || !user.verificationOTPExpiry) {
        return res.status(400).json({ success: false, message: 'No pending verification. Request a new code.' });
      }

      if (new Date(user.verificationOTPExpiry) < new Date()) {
        return res.status(400).json({ success: false, message: 'Code expired. Request a new one.' });
      }

      const ok = await checkOtpHash(user.verificationOTPHash, otp);
      if (!ok) {
        const attempts = (user.verificationAttempts || 0) + 1;
        const update = { $set: { verificationAttempts: attempts } };
        if (attempts >= MAX_OTP_ATTEMPTS) {
          update.$set.verificationLockUntil = new Date(Date.now() + LOCKOUT_MS);
        }
        await usersCollection.updateOne({ _id: user._id }, update);
        return res.status(400).json({
          success: false,
          message: 'Invalid code',
          attemptsRemaining: Math.max(0, MAX_OTP_ATTEMPTS - attempts),
        });
      }

      await usersCollection.updateOne(
        { _id: user._id },
        {
          $set: {
            verified: true,
            verificationOTPHash: null,
            verificationOTPExpiry: null,
            verificationAttempts: 0,
            verificationLockUntil: null,
          },
        },
      );

      user.verified = true;
      await sendVerificationSuccess(user.email, user.name || user.username);

      return res.json({
        success: true,
        message: 'Email verified',
        user: publicUser({ ...user, verified: true }),
      });
    } catch (err) {
      console.error('verifyEmail', err);
      return res.status(500).json({ success: false, message: 'Server error' });
    }
  },

  async resendVerification(req, res) {
    try {
      const { email } = req.body;
      const eVal = validateEmailFormat(email);
      if (!eVal.ok) return res.status(400).json({ success: false, message: eVal.message });

      const user = await usersCollection.findOne({ email: eVal.email });
      if (!user) {
        return res.json({ success: true, message: 'If an account exists, a code was sent.' });
      }

      if (isLegacyVerified(user)) {
        return res.status(400).json({ success: false, message: 'Account is already verified' });
      }

      const last = user.lastResendVerificationAt ? new Date(user.lastResendVerificationAt).getTime() : 0;
      if (Date.now() - last < RESEND_COOLDOWN_MS) {
        const wait = Math.ceil((RESEND_COOLDOWN_MS - (Date.now() - last)) / 1000);
        return res.status(429).json({
          success: false,
          message: `Wait ${wait}s before resending`,
          cooldownSeconds: wait,
        });
      }

      const otp = generateOtpDigits(6);
      const otpHash = await bcrypt.hash(otp, 10);

      await usersCollection.updateOne(
        { _id: user._id },
        {
          $set: {
            verificationOTPHash: otpHash,
            verificationOTPExpiry: new Date(Date.now() + OTP_TTL_MS),
            verificationAttempts: 0,
            verificationLockUntil: null,
            lastResendVerificationAt: new Date(),
          },
        },
      );

      await sendVerificationOtp(eVal.email, otp, user.name || user.username);

      return res.json({ success: true, message: 'Verification code sent' });
    } catch (err) {
      console.error('resendVerification', err);
      return res.status(500).json({ success: false, message: 'Server error' });
    }
  },

  async forgotPassword(req, res) {
    try {
      const { email } = req.body;
      const eVal = validateEmailFormat(email);
      if (!eVal.ok) return res.status(400).json({ success: false, message: eVal.message });

      const user = await usersCollection.findOne({ email: eVal.email });
      if (!user) {
        return res.json({ success: true, message: 'If an account exists, a code was sent.' });
      }

      const last = user.lastResendResetAt ? new Date(user.lastResendResetAt).getTime() : 0;
      if (Date.now() - last < RESEND_COOLDOWN_MS) {
        const wait = Math.ceil((RESEND_COOLDOWN_MS - (Date.now() - last)) / 1000);
        return res.status(429).json({ success: false, message: `Wait ${wait}s`, cooldownSeconds: wait });
      }

      const otp = generateOtpDigits(6);
      const otpHash = await bcrypt.hash(otp, 10);

      await usersCollection.updateOne(
        { _id: user._id },
        {
          $set: {
            resetOTPHash: otpHash,
            resetOTPExpiry: new Date(Date.now() + OTP_TTL_MS),
            resetAttempts: 0,
            resetLockUntil: null,
            passwordResetTokenHash: null,
            passwordResetTokenExpiry: null,
            lastResendResetAt: new Date(),
          },
        },
      );

      await sendPasswordResetOtp(eVal.email, otp, user.name || user.username);

      return res.json({
        success: true,
        message: 'If an account exists, a code was sent.',
      });
    } catch (err) {
      console.error('forgotPassword', err);
      return res.status(500).json({ success: false, message: 'Server error' });
    }
  },

  async verifyResetOtp(req, res) {
    try {
      const { email, otp } = req.body;
      const eVal = validateEmailFormat(email);
      if (!eVal.ok) return res.status(400).json({ success: false, message: eVal.message });

      const user = await usersCollection.findOne({ email: eVal.email });
      if (!user || !user.resetOTPHash) {
        return res.status(400).json({ success: false, message: 'Invalid or expired reset request' });
      }

      if (otpLocked(user, 'reset')) {
        return res.status(423).json({ success: false, message: 'Too many attempts. Try again later.' });
      }

      if (new Date(user.resetOTPExpiry) < new Date()) {
        return res.status(400).json({ success: false, message: 'Code expired' });
      }

      const ok = await checkOtpHash(user.resetOTPHash, otp);
      if (!ok) {
        const attempts = (user.resetAttempts || 0) + 1;
        const update = { $set: { resetAttempts: attempts } };
        if (attempts >= MAX_OTP_ATTEMPTS) {
          update.$set.resetLockUntil = new Date(Date.now() + LOCKOUT_MS);
        }
        await usersCollection.updateOne({ _id: user._id }, update);
        return res.status(400).json({ success: false, message: 'Invalid code' });
      }

      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetTokenHash = await bcrypt.hash(resetToken, 10);

      await usersCollection.updateOne(
        { _id: user._id },
        {
          $set: {
            passwordResetTokenHash: resetTokenHash,
            passwordResetTokenExpiry: new Date(Date.now() + 15 * 60 * 1000),
            resetOTPHash: null,
            resetOTPExpiry: null,
            resetAttempts: 0,
            resetLockUntil: null,
            pendingResetTokenHash: null,
            pendingResetTokenExpiry: null,
          },
        },
      );

      return res.json({
        success: true,
        resetToken,
        email: eVal.email,
      });
    } catch (err) {
      console.error('verifyResetOtp', err);
      return res.status(500).json({ success: false, message: 'Server error' });
    }
  },

  async resetPassword(req, res) {
    try {
      const { email, resetToken, newPassword, confirmPassword } = req.body;

      const eVal = validateEmailFormat(email);
      if (!eVal.ok) return res.status(400).json({ success: false, message: eVal.message });

      if (!resetToken || !newPassword || confirmPassword === undefined) {
        return res.status(400).json({ success: false, message: 'Missing fields' });
      }

      if (newPassword !== confirmPassword) {
        return res.status(400).json({ success: false, message: 'Passwords do not match' });
      }

      const pVal = validatePasswordStrength(newPassword);
      if (!pVal.ok) return res.status(400).json({ success: false, message: pVal.message });

      const user = await usersCollection.findOne({ email: eVal.email });
      if (!user || !user.passwordResetTokenHash || !user.passwordResetTokenExpiry) {
        return res.status(400).json({ success: false, message: 'Invalid or expired reset session' });
      }

      if (new Date(user.passwordResetTokenExpiry) < new Date()) {
        return res.status(400).json({ success: false, message: 'Reset session expired. Start again.' });
      }

      const tokenOk = await bcrypt.compare(String(resetToken).trim(), user.passwordResetTokenHash);
      if (!tokenOk) {
        return res.status(400).json({ success: false, message: 'Invalid reset session' });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 12);

      await usersCollection.updateOne(
        { _id: user._id },
        {
          $set: { password: hashedPassword },
          $unset: {
            passwordResetTokenHash: '',
            passwordResetTokenExpiry: '',
          },
        },
      );

      return res.json({ success: true, message: 'Password updated. You can sign in.' });
    } catch (err) {
      console.error('resetPassword', err);
      return res.status(500).json({ success: false, message: 'Server error' });
    }
  },

  async forgotEmailRequest(req, res) {
    try {
      const { username } = req.body;
      const usernameLookup = normalizeUsername(username);

      if (!usernameLookup || usernameLookup.length < 3) {
        return res.status(400).json({ success: false, message: 'Enter a valid username' });
      }

      const user = await usersCollection.findOne({ username: usernameLookup });

      if (!user || !user.email) {
        return res.json({ success: true, message: 'If an account exists, a code was sent.' });
      }

      const last = user.lastResendEmailRecoveryAt ? new Date(user.lastResendEmailRecoveryAt).getTime() : 0;
      if (Date.now() - last < RESEND_COOLDOWN_MS) {
        const wait = Math.ceil((RESEND_COOLDOWN_MS - (Date.now() - last)) / 1000);
        return res.status(429).json({ success: false, message: `Wait ${wait}s`, cooldownSeconds: wait });
      }

      const otp = generateOtpDigits(6);
      const otpHash = await bcrypt.hash(otp, 10);

      await usersCollection.updateOne(
        { _id: user._id },
        {
          $set: {
            emailRecoveryOTPHash: otpHash,
            emailRecoveryOTPExpiry: new Date(Date.now() + OTP_TTL_MS),
            emailRecoveryAttempts: 0,
            emailRecoveryLockUntil: null,
            lastResendEmailRecoveryAt: new Date(),
          },
        },
      );

      await sendEmailRecoveryOtp(user.email, otp, user.name || user.username);

      return res.json({
        success: true,
        message: 'If an account exists, a code was sent to the registered email.',
      });
    } catch (err) {
      console.error('forgotEmailRequest', err);
      return res.status(500).json({ success: false, message: 'Server error' });
    }
  },

  async forgotEmailVerify(req, res) {
    try {
      const { username, otp } = req.body;
      const usernameLookup = normalizeUsername(username);

      const user = await usersCollection.findOne({ username: usernameLookup });

      if (!user || !user.emailRecoveryOTPHash) {
        return res.status(400).json({ success: false, message: 'Invalid request' });
      }

      if (otpLocked(user, 'emailRecovery')) {
        return res.status(423).json({ success: false, message: 'Too many attempts. Try later.' });
      }

      if (new Date(user.emailRecoveryOTPExpiry) < new Date()) {
        return res.status(400).json({ success: false, message: 'Code expired' });
      }

      const ok = await checkOtpHash(user.emailRecoveryOTPHash, otp);
      if (!ok) {
        const attempts = (user.emailRecoveryAttempts || 0) + 1;
        const update = { $set: { emailRecoveryAttempts: attempts } };
        if (attempts >= MAX_OTP_ATTEMPTS) {
          update.$set.emailRecoveryLockUntil = new Date(Date.now() + LOCKOUT_MS);
        }
        await usersCollection.updateOne({ _id: user._id }, update);
        return res.status(400).json({ success: false, message: 'Invalid code' });
      }

      await usersCollection.updateOne(
        { _id: user._id },
        {
          $unset: {
            emailRecoveryOTPHash: '',
            emailRecoveryOTPExpiry: '',
            emailRecoveryAttempts: '',
            emailRecoveryLockUntil: '',
          },
        },
      );

      return res.json({
        success: true,
        maskedEmail: maskEmail(user.email),
        email: user.email,
      });
    } catch (err) {
      console.error('forgotEmailVerify', err);
      return res.status(500).json({ success: false, message: 'Server error' });
    }
  },
});
