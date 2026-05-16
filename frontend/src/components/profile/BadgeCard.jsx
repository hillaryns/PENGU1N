import { motion } from 'framer-motion';
import { RARITY_STYLES } from '../../data/badges';

export default function BadgeCard({ badge, unlocked, onClick, compact }) {
  const style = RARITY_STYLES[badge.rarity] || RARITY_STYLES.common;

  return (
    <motion.button
      type="button"
      className={`gamified-badge-card rarity-${badge.rarity}${unlocked ? ' unlocked' : ' locked'}${compact ? ' compact' : ''}`}
      style={{
        '--badge-glow': style.glow,
        '--badge-border': style.border,
      }}
      onClick={onClick}
      whileHover={{ y: unlocked ? -4 : 0, scale: unlocked ? 1.02 : 1 }}
      whileTap={{ scale: 0.98 }}
      layout
    >
      {unlocked && <span className="badge-card-shine" aria-hidden />}
      <div className="gamified-badge-icon">{badge.icon}</div>
      <div className="gamified-badge-name">{badge.name}</div>
      {!compact && <div className="gamified-badge-desc">{badge.description}</div>}
      <span className={`gamified-badge-rarity rarity-${badge.rarity}`}>{badge.rarity}</span>
      {badge.xpReward > 0 && unlocked && (
        <span className="gamified-badge-xp">+{badge.xpReward} XP</span>
      )}
    </motion.button>
  );
}
