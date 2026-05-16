const { ObjectId } = require('mongodb');
const {
  calculateProfileCompletion,
  xpToLevel,
  rankForLevel,
  defaultGamificationProgress,
  BADGE_DEFINITIONS,
} = require('../services/achievementService');

function buildPublicProfile(doc) {
  if (!doc) return null;
  const gamification = { ...defaultGamificationProgress(), ...(doc.gamification || {}) };
  const levelInfo = xpToLevel(gamification.xp || 0);
  const completion = doc.profileCompletion ?? calculateProfileCompletion(doc);

  return {
    id: doc._id?.toString(),
    name: doc.displayName || doc.name || doc.username || 'Student',
    displayName: doc.displayName || doc.name || doc.username || 'Student',
    username: doc.username || doc.email?.split('@')[0] || '',
    email: doc.email,
    bio: doc.bio || '',
    profilePicture: doc.profilePicture || null,
    profileCompletion: completion,
    verified: doc.verified !== false,
    gamification: {
      ...gamification,
      level: levelInfo.level,
      rank: rankForLevel(levelInfo.level),
      xpInLevel: levelInfo.xpInLevel,
      xpForNext: levelInfo.xpForNext,
    },
    badgeHistory: doc.badgeHistory || [],
    progress: {
      notesRead: gamification.notesRead?.length || 0,
      testsTaken: Object.values(gamification.testResults || {}).filter((r) => r.attempts > 0).length,
      xp: gamification.xp || 0,
      streak: gamification.streak || 0,
      badges: gamification.badges || [],
    },
  };
}

function resolveUserId(id) {
  if (!id || id === 'me') return null;
  if (ObjectId.isValid(id)) return new ObjectId(id);
  return id;
}

module.exports = { buildPublicProfile, resolveUserId, BADGE_DEFINITIONS };
