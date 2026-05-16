const express = require('express');
const createProfileController = require('../controllers/profileController');
const createProgressController = require('../controllers/progressController');
const { requireUser } = require('../middleware/requireUser');
const { uploadAvatar } = require('../middleware/uploadAvatar');

module.exports = function profileRoutes(usersCollection) {
  const router = express.Router();
  const profile = createProfileController(usersCollection);
  const progress = createProgressController(usersCollection);
  const auth = requireUser(usersCollection);

  router.get('/profile/badges', progress.getBadges.bind(progress));
  router.get('/profile/:id', profile.getProfile.bind(profile));

  router.put('/profile/update', auth, profile.updateProfile.bind(profile));
  router.post(
    '/profile/upload-avatar',
    auth,
    (req, res, next) => {
      uploadAvatar.single('avatar')(req, res, (err) => {
        if (err) {
          return res.status(400).json({ success: false, message: err.message || 'Upload failed' });
        }
        next();
      });
    },
    profile.uploadAvatar.bind(profile),
  );
  router.delete('/profile/avatar', auth, profile.removeAvatar.bind(profile));

  router.post('/progress/sync', auth, progress.syncProgress.bind(progress));

  return router;
};
