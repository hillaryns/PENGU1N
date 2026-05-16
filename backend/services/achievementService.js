const { testsByTopic } = require('../data/testsMeta');

const BADGE_DEFINITIONS = [
  { id: 'first-steps', name: 'First Steps', description: 'Complete your first test', icon: '📝', rarity: 'common', xpReward: 50 },
  { id: 'note-reader', name: 'Note Reader', description: 'Read 5 notes', icon: '📚', rarity: 'common', xpReward: 75 },
  { id: 'scholar', name: 'Scholar', description: 'Read 25 notes', icon: '🎓', rarity: 'rare', xpReward: 150 },
  { id: 'quiz-ace', name: 'Quiz Ace', description: 'Score 90%+ on a test', icon: '🏆', rarity: 'rare', xpReward: 120 },
  { id: 'perfect-mind', name: 'Perfect Mind', description: 'Get full marks on a test', icon: '💎', rarity: 'epic', xpReward: 200 },
  { id: 'on-fire', name: 'On Fire', description: 'Maintain a 3-day streak', icon: '🔥', rarity: 'common', xpReward: 80 },
  { id: 'unstoppable', name: 'Unstoppable', description: 'Maintain a 15-day streak', icon: '⚡', rarity: 'epic', xpReward: 300 },
  { id: 'night-owl', name: 'Night Owl', description: 'Study after midnight', icon: '🦉', rarity: 'rare', xpReward: 60 },
  { id: 'early-bird', name: 'Early Bird', description: 'Study before 6 AM', icon: '🌅', rarity: 'rare', xpReward: 60 },
  { id: 'xp-hunter', name: 'XP Hunter', description: 'Earn 500 XP', icon: '⭐', rarity: 'common', xpReward: 0 },
  { id: 'elite-grinder', name: 'Elite Grinder', description: 'Earn 5000 XP', icon: '💠', rarity: 'epic', xpReward: 0 },
  { id: 'video-addict', name: 'Video Addict', description: 'Watch 10 videos', icon: '🎬', rarity: 'rare', xpReward: 100 },
  { id: 'binge-learner', name: 'Binge Learner', description: 'Watch 50 videos', icon: '📺', rarity: 'legendary', xpReward: 250 },
  { id: 'subject-master', name: 'Subject Master', description: 'Pass all tests in one subject', icon: '🎯', rarity: 'epic', xpReward: 180 },
  { id: 'consistency-king', name: 'Consistency King', description: 'Study 7 days in a row', icon: '👑', rarity: 'rare', xpReward: 150 },
  { id: 'social-penguin', name: 'Social Penguin', description: 'Reach 100% profile completion', icon: '🐧', rarity: 'rare', xpReward: 100 },
  { id: 'profile-complete', name: 'Profile Complete', description: 'Add bio, avatar, and username', icon: '✨', rarity: 'common', xpReward: 75 },
  { id: 'hardcore-learner', name: 'Hardcore Learner', description: 'Spend 10+ hours learning', icon: '⏱️', rarity: 'legendary', xpReward: 400 },
  { id: 'legendary-penguin', name: 'Legendary Penguin', description: 'Unlock 10 badges', icon: '🌟', rarity: 'legendary', xpReward: 500 },
  { id: 'god-mode', name: 'GOD MODE', description: 'Unlock every badge', icon: '🔱', rarity: 'legendary', xpReward: 1000 },
];

const ALL_BADGE_IDS = BADGE_DEFINITIONS.map((b) => b.id);

function defaultGamificationProgress() {
  return {
    xp: 0,
    level: 1,
    streak: 0,
    lastActiveDate: null,
    notesRead: [],
    videosWatched: {},
    testResults: {},
    subjectProgress: {},
    badges: [],
    badgeHistory: [],
    stats: {
      studyMinutes: 0,
      perfectScores: 0,
      testsCompleted: 0,
      lastStudyHour: null,
    },
  };
}

function mergeProgress(existing, incoming) {
  const base = { ...defaultGamificationProgress(), ...(existing || {}) };
  const inc = incoming || {};
  const notesRead = [...new Set([...(base.notesRead || []), ...(inc.notesRead || [])])];
  const videosWatched = { ...(base.videosWatched || {}), ...(inc.videosWatched || {}) };
  const testResults = { ...(base.testResults || {}) };
  Object.entries(inc.testResults || {}).forEach(([id, r]) => {
    const prev = testResults[id] || {};
    testResults[id] = {
      ...prev,
      ...r,
      attempts: Math.max(prev.attempts || 0, r.attempts || 0),
      bestScore: Math.max(prev.bestScore || 0, r.bestScore || 0),
    };
  });
  return {
    ...base,
    xp: Math.max(base.xp || 0, inc.xp || 0),
    streak: Math.max(base.streak || 0, inc.streak || 0),
    lastActiveDate: inc.lastActiveDate || base.lastActiveDate,
    notesRead,
    videosWatched,
    testResults,
    subjectProgress: { ...(base.subjectProgress || {}), ...(inc.subjectProgress || {}) },
    badges: [...new Set([...(base.badges || []), ...(inc.badges || [])])],
    stats: {
      ...base.stats,
      studyMinutes: Math.max(base.stats?.studyMinutes || 0, inc.stats?.studyMinutes || 0),
      perfectScores: Math.max(base.stats?.perfectScores || 0, inc.stats?.perfectScores || 0),
      testsCompleted: Math.max(base.stats?.testsCompleted || 0, inc.stats?.testsCompleted || 0),
      lastStudyHour: inc.stats?.lastStudyHour ?? base.stats?.lastStudyHour,
    },
  };
}

function countVideosWatched(progress) {
  return Object.values(progress.videosWatched || {}).filter((v) => v.completed || v.percent >= 90).length;
}

function countTestsCompleted(progress) {
  return Object.values(progress.testResults || {}).filter((r) => (r.attempts || 0) > 0).length;
}

function hasSubjectMaster(progress) {
  return Object.entries(testsByTopic).some(([topic, ids]) =>
    ids.length > 0 && ids.every((id) => progress.testResults?.[id]?.passed),
  );
}

function hasQuizAce(progress) {
  return Object.values(progress.testResults || {}).some((r) => (r.bestScore || 0) >= 90);
}

function hasPerfectScore(progress) {
  return Object.values(progress.testResults || {}).some((r) => (r.bestScore || 0) >= 100);
}

function calculateProfileCompletion(user) {
  let score = 0;
  if (user.profilePicture) score += 20;
  if (user.bio && String(user.bio).trim().length >= 10) score += 20;
  if (user.username && user.username.length >= 3) score += 15;
  const p = user.gamification || user.progress || {};
  if (countTestsCompleted(p) >= 1) score += 15;
  if ((p.notesRead?.length || 0) >= 5) score += 15;
  if (countVideosWatched(p) >= 1) score += 15;
  return Math.min(100, score);
}

function xpToLevel(xp) {
  let level = 1;
  let needed = 100;
  let remaining = xp || 0;
  while (remaining >= needed && level < 99) {
    remaining -= needed;
    level += 1;
    needed = Math.floor(100 * (1 + level * 0.15));
  }
  const xpForCurrent = xp - xpTotalForLevel(level - 1);
  const xpForNext = needed;
  return { level, xpInLevel: xpForCurrent, xpForNext, xpTotal: xp };
}

function xpTotalForLevel(level) {
  let total = 0;
  for (let l = 1; l <= level; l += 1) {
    total += Math.floor(100 * (1 + l * 0.15));
  }
  return total;
}

function rankForLevel(level) {
  if (level >= 25) return 'Legend';
  if (level >= 20) return 'Master';
  if (level >= 15) return 'Expert';
  if (level >= 10) return 'Scholar';
  if (level >= 5) return 'Learner';
  return 'Rookie';
}

function checkBadgeUnlocks(user, progress) {
  const unlocked = new Set(progress.badges || []);
  const notesCount = progress.notesRead?.length || 0;
  const videos = countVideosWatched(progress);
  const xp = progress.xp || 0;
  const streak = progress.streak || 0;
  const testsDone = countTestsCompleted(progress);
  const completion = calculateProfileCompletion(user);
  const studyMinutes = progress.stats?.studyMinutes || 0;
  const hour = progress.stats?.lastStudyHour;

  const newlyUnlocked = [];
  BADGE_DEFINITIONS.forEach((badge) => {
    if (unlocked.has(badge.id)) return;
    let met = false;
    switch (badge.id) {
      case 'first-steps':
        met = testsDone >= 1;
        break;
      case 'note-reader':
        met = notesCount >= 5;
        break;
      case 'scholar':
        met = notesCount >= 25;
        break;
      case 'quiz-ace':
        met = hasQuizAce(progress);
        break;
      case 'perfect-mind':
        met = hasPerfectScore(progress) || (progress.stats?.perfectScores || 0) > 0;
        break;
      case 'on-fire':
        met = streak >= 3;
        break;
      case 'unstoppable':
        met = streak >= 15;
        break;
      case 'night-owl':
        met = hour !== null && hour >= 0 && hour < 5;
        break;
      case 'early-bird':
        met = hour >= 4 && hour < 6;
        break;
      case 'xp-hunter':
        met = xp >= 500;
        break;
      case 'elite-grinder':
        met = xp >= 5000;
        break;
      case 'video-addict':
        met = videos >= 10;
        break;
      case 'binge-learner':
        met = videos >= 50;
        break;
      case 'subject-master':
        met = hasSubjectMaster(progress);
        break;
      case 'consistency-king':
        met = streak >= 7;
        break;
      case 'social-penguin':
        met = completion >= 100;
        break;
      case 'profile-complete':
        met = !!user.profilePicture && !!user.bio?.trim() && !!user.username;
        break;
      case 'hardcore-learner':
        met = studyMinutes >= 600;
        break;
      case 'legendary-penguin':
        met = unlocked.size + newlyUnlocked.length >= 10;
        break;
      case 'god-mode':
        met = false;
        break;
      default:
        met = false;
    }
    if (met) {
      unlocked.add(badge.id);
      newlyUnlocked.push(badge);
    }
  });

  if (!unlocked.has('legendary-penguin')) {
    const count = [...unlocked].filter((id) => id !== 'god-mode').length;
    if (count >= 10) {
      const leg = BADGE_DEFINITIONS.find((b) => b.id === 'legendary-penguin');
      unlocked.add('legendary-penguin');
      newlyUnlocked.push(leg);
    }
  }

  if (!unlocked.has('god-mode')) {
    const allExceptGod = ALL_BADGE_IDS.filter((id) => id !== 'god-mode');
    if (allExceptGod.every((id) => unlocked.has(id))) {
      const god = BADGE_DEFINITIONS.find((b) => b.id === 'god-mode');
      unlocked.add('god-mode');
      newlyUnlocked.push(god);
    }
  }

  let bonusXp = 0;
  newlyUnlocked.forEach((b) => {
    bonusXp += b.xpReward || 0;
  });

  return {
    badges: [...unlocked],
    newlyUnlocked,
    bonusXp,
    completion,
  };
}

function processUserGamification(user, incomingProgress) {
  const gamification = mergeProgress(user.gamification, incomingProgress);
  const now = new Date();
  gamification.stats = gamification.stats || {};
  gamification.stats.lastStudyHour = now.getHours();
  gamification.stats.studyMinutes = (gamification.stats.studyMinutes || 0) + (incomingProgress?.sessionMinutes || 0);

  const { badges, newlyUnlocked, bonusXp, completion } = checkBadgeUnlocks(user, gamification);
  gamification.badges = badges;
  if (bonusXp > 0) gamification.xp = (gamification.xp || 0) + bonusXp;

  const levelInfo = xpToLevel(gamification.xp);
  gamification.level = levelInfo.level;

  const history = [...(user.badgeHistory || [])];
  newlyUnlocked.forEach((b) => {
    history.push({ id: b.id, unlockedAt: new Date().toISOString() });
  });

  return {
    gamification,
    newlyUnlocked,
    profileCompletion: completion,
    levelInfo: { ...levelInfo, rank: rankForLevel(levelInfo.level) },
    badgeHistory: history,
  };
}

module.exports = {
  BADGE_DEFINITIONS,
  ALL_BADGE_IDS,
  defaultGamificationProgress,
  mergeProgress,
  calculateProfileCompletion,
  xpToLevel,
  rankForLevel,
  processUserGamification,
  countVideosWatched,
  countTestsCompleted,
};
