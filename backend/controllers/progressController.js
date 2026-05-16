const { buildPublicProfile } = require('../utils/userProfile');
const { processUserGamification, BADGE_DEFINITIONS } = require('../services/achievementService');

module.exports = (usersCollection) => ({
  async syncProgress(req, res) {
    try {
      const user = req.user;
      const { progress, sessionMinutes } = req.body;

      if (!progress || typeof progress !== 'object') {
        return res.status(400).json({ success: false, message: 'Progress payload required' });
      }

      const incoming = { ...progress, sessionMinutes: sessionMinutes || 2 };

      const { gamification, newlyUnlocked, profileCompletion, levelInfo, badgeHistory } =
        processUserGamification(user, incoming);

      await usersCollection.updateOne(
        { _id: user._id },
        {
          $set: {
            gamification,
            profileCompletion,
            badgeHistory,
          },
        },
      );

      const updated = await usersCollection.findOne({ _id: user._id });

      return res.json({
        success: true,
        progress: gamification,
        profile: buildPublicProfile(updated),
        newlyUnlocked,
        levelInfo,
        badges: BADGE_DEFINITIONS,
      });
    } catch (err) {
      console.error('syncProgress', err);
      return res.status(500).json({ success: false, message: 'Server error' });
    }
  },

  async getBadges(req, res) {
    return res.json({ success: true, badges: BADGE_DEFINITIONS });
  },
});
