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
    throw new Error(data.message || 'Request failed');
  }

  return data;
}

export const api = {
  health: () => request('/health'),
  signup: (body) =>
    request('/signup', { method: 'POST', body: JSON.stringify(body) }),
  login: (body) =>
    request('/login', { method: 'POST', body: JSON.stringify(body) }),
};
