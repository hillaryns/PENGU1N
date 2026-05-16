const { normalizeEmail } = require('../utils/validation');

/** Identifies user by x-user-email header or email in body (matches existing auth pattern). */
function requireUser(usersCollection) {
  return async (req, res, next) => {
    try {
      const raw = req.headers['x-user-email'] || req.body?.email;
      if (!raw) {
        return res.status(401).json({ success: false, message: 'Authentication required' });
      }
      const email = normalizeEmail(raw);
      const user = await usersCollection.findOne({ email });
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
      req.user = user;
      req.userEmail = email;
      req.headers['x-user-email'] = email;
      next();
    } catch (err) {
      console.error('requireUser', err);
      return res.status(500).json({ success: false, message: 'Server error' });
    }
  };
}

module.exports = { requireUser };
