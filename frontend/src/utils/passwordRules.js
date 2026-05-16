export function passwordHints(password) {
  const p = String(password || '');
  return {
    length: p.length >= 8,
    lower: /[a-z]/.test(p),
    upper: /[A-Z]/.test(p),
    number: /[0-9]/.test(p),
    special: /[^a-zA-Z0-9]/.test(p),
  };
}

export function passwordMeetsRules(password) {
  const h = passwordHints(password);
  return h.length && h.lower && h.upper && h.number && h.special;
}

export const USERNAME_HINT = '3–32 chars: lowercase letters, numbers, underscore';
