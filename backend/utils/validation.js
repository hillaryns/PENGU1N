/** Username: letters, numbers, underscore; 3–32 chars */
const USERNAME_RE = /^[a-z0-9_]{3,32}$/;

const EMAIL_RE =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

/** Common disposable / temp mail domains (subset; extend as needed) */
const DISPOSABLE_DOMAINS = new Set(
  [
    'mailinator.com',
    'tempmail.com',
    'guerrillamail.com',
    '10minutemail.com',
    'throwaway.email',
    'fakeinbox.com',
    'trashmail.com',
    'yopmail.com',
    'temp-mail.org',
    'getnada.com',
    'sharklasers.com',
    'dispostable.com',
    'maildrop.cc',
    'mintemail.com',
    'burnermail.io',
  ].map((d) => d.toLowerCase()),
);

function normalizeEmail(email) {
  return String(email || '')
    .trim()
    .toLowerCase();
}

function normalizeUsername(username) {
  return String(username || '')
    .trim()
    .toLowerCase();
}

function isDisposableEmail(email) {
  const domain = normalizeEmail(email).split('@')[1];
  if (!domain) return true;
  return DISPOSABLE_DOMAINS.has(domain.toLowerCase());
}

function validateEmailFormat(email) {
  const e = normalizeEmail(email);
  if (!e || e.length > 254) return { ok: false, message: 'Invalid email address' };
  if (!EMAIL_RE.test(e)) return { ok: false, message: 'Invalid email format' };
  if (isDisposableEmail(e)) return { ok: false, message: 'Disposable or temporary email addresses are not allowed' };
  return { ok: true, email: e };
}

function validateUsername(username) {
  const u = normalizeUsername(username);
  if (!USERNAME_RE.test(u)) {
    return {
      ok: false,
      message: 'Username must be 3–32 characters (lowercase letters, numbers, underscore)',
    };
  }
  return { ok: true, username: u };
}

/** Strong password: 8+, upper, lower, digit, special */
function validatePasswordStrength(password) {
  const p = String(password || '');
  if (p.length < 8) return { ok: false, message: 'Password must be at least 8 characters' };
  if (p.length > 128) return { ok: false, message: 'Password is too long' };
  if (!/[a-z]/.test(p)) return { ok: false, message: 'Password must include a lowercase letter' };
  if (!/[A-Z]/.test(p)) return { ok: false, message: 'Password must include an uppercase letter' };
  if (!/[0-9]/.test(p)) return { ok: false, message: 'Password must include a number' };
  if (!/[^a-zA-Z0-9]/.test(p)) return { ok: false, message: 'Password must include a special character' };
  return { ok: true };
}

function maskEmail(email) {
  const e = normalizeEmail(email);
  const [local, domain] = e.split('@');
  if (!local || !domain) return '***@***';
  if (local.length <= 2) return `${local[0]}*@${domain}`;
  const masked = `${local[0]}${'*'.repeat(Math.min(local.length - 2, 5))}${local[local.length - 1]}`;
  return `${masked}@${domain}`;
}

module.exports = {
  normalizeEmail,
  normalizeUsername,
  validateEmailFormat,
  validateUsername,
  validatePasswordStrength,
  maskEmail,
  isDisposableEmail,
};
