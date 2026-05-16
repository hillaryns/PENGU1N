const nodemailer = require('nodemailer');

function createTransport() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
}

const FROM = process.env.EMAIL_FROM || process.env.SMTP_USER || 'PENGU1N <noreply@pengu1n.local>';

function wrapHtml(title, bodyHtml) {
  return `
<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>${title}</title></head>
<body style="margin:0;background:#0B1E3F;font-family:Segoe UI,Roboto,sans-serif;color:#e8f0ff;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:24px;">
    <tr><td align="center">
      <div style="max-width:480px;background:rgba(26,58,122,0.85);border:1px solid #2F80FF;border-radius:16px;padding:28px;backdrop-filter:blur(12px);">
        <h1 style="margin:0 0 16px;font-size:22px;color:#3FA9FF;">PENGU1N</h1>
        ${bodyHtml}
        <p style="margin-top:24px;font-size:12px;color:#8899bb;">If you did not request this, ignore this email.</p>
      </div>
    </td></tr>
  </table>
</body></html>`;
}

async function sendMail({ to, subject, html, text }) {
  const transport = createTransport();
  if (!transport) {
    console.warn('[email] SMTP not configured — logging email instead');
    console.warn(`To: ${to}\nSubject: ${subject}\n${text || html}`);
    return { skipped: true };
  }

  await transport.sendMail({
    from: FROM,
    to,
    subject,
    text: text || '',
    html,
  });
  return { sent: true };
}

async function sendVerificationOtp(to, otp, username) {
  const html = wrapHtml(
    'Verify your email',
    `<p style="font-size:15px;line-height:1.6;">Hi <strong>${escapeHtml(username)}</strong>,</p>
     <p>Use this code to verify your PENGU1N account:</p>
     <p style="font-size:28px;letter-spacing:8px;font-weight:800;color:#3FA9FF;text-align:center;margin:24px 0;">${otp}</p>
     <p style="font-size:13px;color:#a0b4d8;">This code expires in 5 minutes.</p>`,
  );
  return sendMail({
    to,
    subject: 'Your PENGU1N verification code',
    html,
    text: `Hi ${username},\n\nYour verification code: ${otp}\nExpires in 5 minutes.`,
  });
}

async function sendPasswordResetOtp(to, otp, username) {
  const html = wrapHtml(
    'Reset your password',
    `<p style="font-size:15px;">Hi <strong>${escapeHtml(username)}</strong>,</p>
     <p>Password reset code:</p>
     <p style="font-size:28px;letter-spacing:8px;font-weight:800;color:#3FA9FF;text-align:center;margin:24px 0;">${otp}</p>
     <p style="font-size:13px;color:#a0b4d8;">Expires in 5 minutes.</p>`,
  );
  return sendMail({
    to,
    subject: 'PENGU1N password reset code',
    html,
    text: `Password reset code: ${otp}\nExpires in 5 minutes.`,
  });
}

async function sendEmailRecoveryOtp(to, otp, username) {
  const html = wrapHtml(
    'Recover your email',
    `<p style="font-size:15px;">Hi <strong>${escapeHtml(username)}</strong>,</p>
     <p>You requested help recovering the email on your account. Use this code:</p>
     <p style="font-size:28px;letter-spacing:8px;font-weight:800;color:#3FA9FF;text-align:center;margin:24px 0;">${otp}</p>
     <p style="font-size:13px;color:#a0b4d8;">Expires in 5 minutes.</p>`,
  );
  return sendMail({
    to,
    subject: 'PENGU1N email recovery code',
    html,
    text: `Email recovery code: ${otp}`,
  });
}

async function sendVerificationSuccess(to, username) {
  const html = wrapHtml(
    'Email verified',
    `<p>Hi <strong>${escapeHtml(username)}</strong>,</p>
     <p>Your email is verified. You can now access your dashboard.</p>`,
  );
  return sendMail({
    to,
    subject: 'Welcome to PENGU1N — email verified',
    html,
    text: `Hi ${username}, your email is verified.`,
  });
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

module.exports = {
  sendVerificationOtp,
  sendPasswordResetOtp,
  sendEmailRecoveryOtp,
  sendVerificationSuccess,
  sendMail,
};
