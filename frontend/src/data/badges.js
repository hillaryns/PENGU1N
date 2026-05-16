/** Client-side badge catalog (mirrors backend BADGE_DEFINITIONS) */
export const BADGES = [
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

export const RARITY_STYLES = {
  common: { glow: 'rgba(120, 180, 255, 0.35)', border: 'rgba(120, 180, 255, 0.5)' },
  rare: { glow: 'rgba(80, 220, 180, 0.45)', border: 'rgba(80, 220, 180, 0.6)' },
  epic: { glow: 'rgba(180, 120, 255, 0.5)', border: 'rgba(180, 120, 255, 0.65)' },
  legendary: { glow: 'rgba(255, 200, 80, 0.55)', border: 'rgba(255, 200, 80, 0.75)' },
};

export function getBadge(id) {
  return BADGES.find((b) => b.id === id);
}
