const API_BASE = import.meta.env.VITE_API_URL || '/api';

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
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
};
