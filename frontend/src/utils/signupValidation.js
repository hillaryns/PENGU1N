import { passwordMeetsRules } from './passwordRules';

/**
 * Read signup fields from the form DOM, merged with React state fallback.
 * Autofill/password managers often fill inputs without firing onChange, so
 * FormData alone can be empty while the UI looks complete.
 */
export function readSignupForm(formEl, stateFallback = {}) {
  const fd = new FormData(formEl);
  const fromDom = {
    username: String(fd.get('username') ?? '').trim().toLowerCase(),
    email: String(fd.get('email') ?? '').trim(),
    password: String(fd.get('password') ?? ''),
    confirmPassword: String(fd.get('confirmPassword') ?? ''),
  };
  const fb = stateFallback || {};
  return {
    username: fromDom.username || String(fb.username ?? '').trim().toLowerCase(),
    email: fromDom.email || String(fb.email ?? '').trim(),
    password: fromDom.password || String(fb.password ?? ''),
    confirmPassword: fromDom.confirmPassword || String(fb.confirmPassword ?? ''),
  };
}

export function validateSignupClient(fields) {
  const errors = {};
  const { username, email, password, confirmPassword } = fields;

  if (!username) errors.username = 'Username is required';
  else if (!/^[a-z0-9_]{3,32}$/.test(username)) {
    errors.username = 'Username must be 3–32 characters (lowercase letters, numbers, underscore)';
  }

  if (!email) errors.email = 'Email is required';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = 'Enter a valid email address';
  }

  if (!password) errors.password = 'Password is required';
  else if (!passwordMeetsRules(password)) {
    errors.password = 'Password must meet all strength requirements';
  }

  if (!confirmPassword) errors.confirmPassword = 'Please confirm your password';
  else if (password && password !== confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }

  return errors;
}
