import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useUserDisplay } from '../../hooks/useUserDisplay';
import UserAvatar from './UserAvatar';
import { xpProgressPercent } from '../../utils/levels';

export default function DashboardProfileCard() {
  const {
    displayName,
    username,
    rank,
    level,
    xp,
    streak,
    profileCompletion,
    xpInLevel,
    xpForNext,
  } = useUserDisplay();

  const xpPct = xpProgressPercent(xpInLevel, xpForNext);

  return (
    <motion.div
      className="dashboard-user-card auth-glass-panel"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ boxShadow: '0 0 40px rgba(64, 156, 255, 0.25)' }}
    >
      <div className="dashboard-user-card-top">
        <UserAvatar size="xl" showOnline />
        <div className="dashboard-user-card-info">
          <h2>{displayName}</h2>
          <p className="dashboard-user-username">@{username}</p>
          <span className="dashboard-user-rank">{rank} · Level {level}</span>
        </div>
        <Link to="/profile" className="btn btn-ghost btn-sm">
          View profile
        </Link>
      </div>

      <div className="dashboard-user-stats-row">
        <div className="dashboard-user-stat">
          <span className="label">XP</span>
          <span className="value">{xp.toLocaleString()}</span>
        </div>
        <div className="dashboard-user-stat">
          <span className="label">Streak</span>
          <span className="value">{streak} 🔥</span>
        </div>
        <div className="dashboard-user-stat">
          <span className="label">Profile</span>
          <span className="value">{profileCompletion}%</span>
        </div>
      </div>

      <motion.div className="dashboard-user-xp-bar">
        <div className="xp-bar-track">
          <motion.div
            className="xp-bar-fill"
            initial={{ width: 0 }}
            animate={{ width: `${xpPct}%` }}
            transition={{ duration: 0.8 }}
          />
        </div>
        <span className="dashboard-user-xp-label">
          {xpInLevel} / {xpForNext} XP to next level
        </span>
      </motion.div>
    </motion.div>
  );
}
