/**
 * Simple in-memory rate limiter (per process).
 * For production at scale, use Redis or a gateway limiter.
 */

const buckets = new Map();

function rateLimit({ windowMs, max, keyFn }) {
  return (req, res, next) => {
    const key = keyFn(req);
    const now = Date.now();
    let b = buckets.get(key);
    if (!b || now > b.resetAt) {
      b = { count: 0, resetAt: now + windowMs };
      buckets.set(key, b);
    }
    b.count += 1;
    if (b.count > max) {
      const retryAfter = Math.ceil((b.resetAt - now) / 1000);
      res.set('Retry-After', String(retryAfter));
      return res.status(429).json({
        success: false,
        message: 'Too many requests. Please try again later.',
        retryAfterSeconds: retryAfter,
      });
    }
    next();
  };
}

function ipKey(prefix) {
  return (req) => `${prefix}:${req.ip || req.socket.remoteAddress || 'unknown'}`;
}

function comboKey(prefix, bodyField) {
  return (req) => {
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const extra = (req.body && req.body[bodyField]) || '';
    return `${prefix}:${ip}:${String(extra).toLowerCase()}`;
  };
}

module.exports = { rateLimit, ipKey, comboKey };
