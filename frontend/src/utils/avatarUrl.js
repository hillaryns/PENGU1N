const API_BASE = import.meta.env.VITE_API_URL || '/api';

export function resolveAvatarUrl(profilePicture, cacheKey) {
  if (!profilePicture) return null;
  let url;
  if (profilePicture.startsWith('http')) url = profilePicture;
  else if (profilePicture.startsWith('/uploads')) url = profilePicture;
  else url = `${API_BASE.replace(/\/api\/?$/, '')}${profilePicture}`;
  if (cacheKey) {
    const sep = url.includes('?') ? '&' : '?';
    return `${url}${sep}v=${encodeURIComponent(String(cacheKey))}`;
  }
  return url;
}

export function defaultAvatarLetter(name) {
  return (name || 'S').charAt(0).toUpperCase();
}
