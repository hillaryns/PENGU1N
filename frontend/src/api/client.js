const API_BASE = import.meta.env.VITE_API_URL || '/api';

function getUserEmail() {
  try {
    const raw = localStorage.getItem('user');
    if (!raw) return null;
    return JSON.parse(raw).email || null;
  } catch {
    return null;
  }
}

export function authHeaders(extra = {}) {
  const email = getUserEmail();
  return {
    ...(email ? { 'x-user-email': email } : {}),
    ...extra,
  };
}

async function request(path, options = {}) {
  const isFormData = options.body instanceof FormData;
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      ...authHeaders(),
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...options.headers,
    },
    ...options,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const msg =
      data.message ||
      (response.status === 404
        ? 'API route not found — check VITE_API_URL and restart the backend'
        : 'Request failed');
    const err = new Error(msg);
    err.status = response.status;
    err.data = data;
    throw err;
  }

  return data;
}

export const api = {
  health: () => request('/health'),
  signup: (body) =>
    request('/signup', {
      method: 'POST',
      body: JSON.stringify({
        username: body.username ?? '',
        email: body.email ?? '',
        password: body.password ?? '',
        confirmPassword: body.confirmPassword ?? body.confirm_password ?? '',
      }),
    }),
  login: (body) =>
    request('/login', { method: 'POST', body: JSON.stringify(body) }),
  verifyEmail: (body) =>
    request('/verify-email', { method: 'POST', body: JSON.stringify(body) }),
  resendVerification: (body) =>
    request('/resend-verification', { method: 'POST', body: JSON.stringify(body) }),
  forgotPassword: (body) =>
    request('/forgot-password', { method: 'POST', body: JSON.stringify(body) }),
  verifyResetOtp: (body) =>
    request('/verify-reset-otp', { method: 'POST', body: JSON.stringify(body) }),
  resetPassword: (body) =>
    request('/reset-password', { method: 'POST', body: JSON.stringify(body) }),
  forgotEmailRequest: (body) =>
    request('/forgot-email-request', { method: 'POST', body: JSON.stringify(body) }),
  forgotEmailVerify: (body) =>
    request('/forgot-email-verify', { method: 'POST', body: JSON.stringify(body) }),

  getProfile: (id = 'me') => request(`/profile/${id}`),
  updateProfile: (body) =>
    request('/profile/update', { method: 'PUT', body: JSON.stringify(body) }),
  uploadAvatar: (file) => {
    const fd = new FormData();
    fd.append('avatar', file);
    return request('/profile/upload-avatar', { method: 'POST', body: fd });
  },
  removeAvatar: () => request('/profile/avatar', { method: 'DELETE' }),
  syncProgress: (progress, sessionMinutes = 2) =>
    request('/progress/sync', {
      method: 'POST',
      body: JSON.stringify({ progress, sessionMinutes }),
    }),
  getBadges: () => request('/profile/badges'),
};
