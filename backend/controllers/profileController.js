const path = require('path');
const fs = require('fs');
const { ObjectId } = require('mongodb');
const { normalizeEmail, validateUsername } = require('../utils/validation');
const { buildPublicProfile, resolveUserId } = require('../utils/userProfile');
const {
  calculateProfileCompletion,
  processUserGamification,
  BADGE_DEFINITIONS,
} = require('../services/achievementService');

module.exports = (usersCollection) => ({
  async getProfile(req, res) {
    try {
      const { id } = req.params;
      let user;

      if (!id || id === 'me') {
        const email = req.headers['x-user-email'];
        if (!email) {
          return res.status(401).json({ success: false, message: 'Authentication required' });
        }
        user = await usersCollection.findOne({ email: normalizeEmail(email) });
      } else if (ObjectId.isValid(id)) {
        user = await usersCollection.findOne({ _id: new ObjectId(id) });
      } else {
        user = await usersCollection.findOne({
          $or: [{ username: String(id).toLowerCase() }, { email: normalizeEmail(id) }],
        });
      }

      if (!user) {
        return res.status(404).json({ success: false, message: 'Profile not found' });
      }

      return res.json({
        success: true,
        profile: buildPublicProfile(user),
        badges: BADGE_DEFINITIONS,
      });
    } catch (err) {
      console.error('getProfile', err);
      return res.status(500).json({ success: false, message: 'Server error' });
    }
  },

  async updateProfile(req, res) {
    try {
      const { username, displayName, bio, name } = req.body;
      const user = req.user;
      const updates = {};

      if (displayName !== undefined || name !== undefined) {
        const dn = String(displayName ?? name ?? '').trim().slice(0, 80);
        if (dn) {
          updates.displayName = dn;
          updates.name = dn;
        }
      }

      if (bio !== undefined) {
        updates.bio = String(bio).trim().slice(0, 500);
      }

      if (username !== undefined) {
        const uVal = validateUsername(username);
        if (!uVal.ok) {
          return res.status(400).json({
            success: false,
            message: uVal.message,
            errors: { username: uVal.message },
          });
        }
        const taken = await usersCollection.findOne({
          username: uVal.username,
          _id: { $ne: user._id },
        });
        if (taken) {
          return res.status(400).json({
            success: false,
            message: 'Username is already taken',
            errors: { username: 'Username is already taken' },
          });
        }
        updates.username = uVal.username;
      }

      if (Object.keys(updates).length === 0) {
        return res.status(400).json({ success: false, message: 'No updates provided' });
      }

      const merged = { ...user, ...updates };
      updates.profileCompletion = calculateProfileCompletion(merged);

      await usersCollection.updateOne({ _id: user._id }, { $set: updates });

      const updated = await usersCollection.findOne({ _id: user._id });
      const { gamification, newlyUnlocked, profileCompletion } = processUserGamification(
        updated,
        updated.gamification || {},
      );

      await usersCollection.updateOne(
        { _id: user._id },
        {
          $set: {
            gamification,
            profileCompletion,
            badgeHistory: [
              ...(updated.badgeHistory || []),
              ...newlyUnlocked.map((b) => ({ id: b.id, unlockedAt: new Date().toISOString() })),
            ],
          },
        },
      );

      const final = await usersCollection.findOne({ _id: user._id });

      return res.json({
        success: true,
        profile: buildPublicProfile(final),
        newlyUnlocked,
      });
    } catch (err) {
      console.error('updateProfile', err);
      return res.status(500).json({ success: false, message: 'Server error' });
    }
  },

  async uploadAvatar(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, message: 'No image file uploaded' });
      }

      const relativePath = `/uploads/profile/${req.file.filename}`;
      const user = req.user;

      if (user.profilePicture && user.profilePicture.startsWith('/uploads/')) {
        const oldPath = path.join(__dirname, '..', user.profilePicture.replace(/^\//, ''));
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }

      const merged = { ...user, profilePicture: relativePath };
      const profileCompletion = calculateProfileCompletion(merged);

      await usersCollection.updateOne(
        { _id: user._id },
        { $set: { profilePicture: relativePath, profileCompletion } },
      );

      const updated = await usersCollection.findOne({ _id: user._id });
      const { gamification, newlyUnlocked, profileCompletion: pc } = processUserGamification(
        updated,
        updated.gamification || {},
      );

      await usersCollection.updateOne(
        { _id: user._id },
        { $set: { gamification, profileCompletion: pc } },
      );

      const final = await usersCollection.findOne({ _id: user._id });

      return res.json({
        success: true,
        profilePicture: relativePath,
        profile: buildPublicProfile(final),
        newlyUnlocked,
      });
    } catch (err) {
      console.error('uploadAvatar', err);
      return res.status(500).json({ success: false, message: err.message || 'Upload failed' });
    }
  },

  async removeAvatar(req, res) {
    try {
      const user = req.user;
      if (user.profilePicture && user.profilePicture.startsWith('/uploads/')) {
        const oldPath = path.join(__dirname, '..', user.profilePicture.replace(/^\//, ''));
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }

      const merged = { ...user, profilePicture: null };
      const profileCompletion = calculateProfileCompletion(merged);

      await usersCollection.updateOne(
        { _id: user._id },
        { $set: { profilePicture: null, profileCompletion } },
      );

      const final = await usersCollection.findOne({ _id: user._id });

      return res.json({
        success: true,
        profile: buildPublicProfile(final),
      });
    } catch (err) {
      console.error('removeAvatar', err);
      return res.status(500).json({ success: false, message: 'Server error' });
    }
  },
});
