const express = require('express');
const createAuthController = require('../controllers/authController');
const { rateLimit, ipKey, comboKey } = require('../middleware/rateLimit');

module.exports = function authRoutes(usersCollection) {
  const router = express.Router();
  const auth = createAuthController(usersCollection);

  const signupLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 10,
    keyFn: ipKey('signup'),
  });

  const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 30,
    keyFn: ipKey('login'),
  });

  const otpLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 40,
    keyFn: ipKey('otp'),
  });

  const resendVerificationLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 8,
    keyFn: comboKey('resend-verify', 'email'),
  });

  const forgotPwLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 8,
    keyFn: comboKey('forgot-pw', 'email'),
  });

  const forgotEmailLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 10,
    keyFn: comboKey('forgot-email', 'username'),
  });

  router.post('/signup', signupLimiter, auth.signup.bind(auth));
  router.post('/login', loginLimiter, auth.login.bind(auth));
  router.post('/verify-email', otpLimiter, auth.verifyEmail.bind(auth));
  router.post('/resend-verification', resendVerificationLimiter, auth.resendVerification.bind(auth));
  router.post('/forgot-password', forgotPwLimiter, auth.forgotPassword.bind(auth));
  router.post('/verify-reset-otp', otpLimiter, auth.verifyResetOtp.bind(auth));
  router.post('/reset-password', otpLimiter, auth.resetPassword.bind(auth));
  router.post('/forgot-email-request', forgotEmailLimiter, auth.forgotEmailRequest.bind(auth));
  router.post('/forgot-email-verify', otpLimiter, auth.forgotEmailVerify.bind(auth));

  return router;
};
