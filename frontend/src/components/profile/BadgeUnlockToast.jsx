import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProgress } from '../../context/ProgressContext';
import { showToast } from '../../utils/toast';

export default function BadgeUnlockToast() {
  const { pendingUnlocks, dismissUnlock } = useProgress();

  useEffect(() => {
    if (!pendingUnlocks.length) return;
    const latest = pendingUnlocks[0];
    showToast(`Badge unlocked: ${latest.name} ${latest.icon}`, 'success');
    const t = setTimeout(() => dismissUnlock(latest.id), 4500);
    return () => clearTimeout(t);
  }, [pendingUnlocks, dismissUnlock]);

  const current = pendingUnlocks[0];
  if (!current) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="badge-unlock-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => dismissUnlock(current.id)}
      >
        <div className="confetti-burst" aria-hidden>
          {Array.from({ length: 24 }).map((_, i) => (
            <span key={i} className="confetti-piece" style={{ '--i': i }} />
          ))}
        </div>
        <motion.div
          className="badge-unlock-card"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 18 }}
        >
          <div className="badge-unlock-glow" />
          <div className="badge-unlock-icon">{current.icon}</div>
          <h3>Badge Unlocked!</h3>
          <p className="badge-unlock-name">{current.name}</p>
          <p className="badge-unlock-desc">{current.description}</p>
          {current.xpReward > 0 && (
            <p className="badge-unlock-xp">+{current.xpReward} XP</p>
          )}
          <button type="button" className="btn btn-primary" onClick={() => dismissUnlock(current.id)}>
            Awesome!
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
