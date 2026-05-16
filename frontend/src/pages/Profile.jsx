import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useProgress } from '../context/ProgressContext';
import { BADGES } from '../data/badges';
import { xpProgressPercent } from '../utils/levels';
import { useUserDisplay } from '../hooks/useUserDisplay';
import UserAvatar from '../components/profile/UserAvatar';
import BadgeCard from '../components/profile/BadgeCard';
import EditProfileModal from '../components/profile/EditProfileModal';

export default function Profile() {
  const { user } = useAuth();
  const { progress } = useProgress();
  const [editOpen, setEditOpen] = useState(false);
  const [filter, setFilter] = useState('all');

  const {
    displayName,
    username,
    avatarUrl,
    avatarLetter: letter,
    rank,
    level,
    xp,
    streak,
    profileCompletion: completion,
    xpInLevel,
    xpForNext,
  } = useUserDisplay();

  const xpPct = xpProgressPercent(xpInLevel, xpForNext);
  const earned = new Set(progress.badges || user?.gamification?.badges || []);

  const stats = useMemo(
    () => ({
      notesRead: progress.notesRead?.length ?? 0,
      videos: Object.keys(progress.videosWatched || {}).filter(
        (k) => progress.videosWatched[k]?.completed || progress.videosWatched[k]?.percent >= 90,
      ).length,
      tests: Object.values(progress.testResults || {}).filter((r) => (r.attempts || 0) > 0).length,
      streak: progress.streak || 0,
      studyHours: ((progress.stats?.studyMinutes || 0) / 60).toFixed(1),
    }),
    [progress],
  );

  const history = (user?.badgeHistory || []).slice(-5).reverse();
  const topBadge = BADGES.find((b) => earned.has(b.id) && b.rarity === 'legendary')
    || BADGES.find((b) => earned.has(b.id) && b.rarity === 'epic')
    || BADGES.find((b) => earned.has(b.id));

  const filteredBadges = BADGES.filter((b) => {
    if (filter === 'earned') return earned.has(b.id);
    if (filter === 'locked') return !earned.has(b.id);
    return true;
  });

  return (
    <div className="profile-gamified">
      <motion.section
        className="profile-hero-card auth-glass-panel"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="profile-hero-top">
          <div className="profile-avatar-hero-wrap">
            <UserAvatar size={80} showOnline />
            <span className="profile-level-badge">Lv {level}</span>
          </div>
          <div className="profile-hero-info">
            <h1>{displayName}</h1>
            <p className="profile-username">@{username}</p>
            <p className="profile-rank-title">{rank}</p>
            {user?.bio && <p className="profile-bio-text">{user.bio}</p>}
            <button type="button" className="btn btn-primary profile-edit-btn" onClick={() => setEditOpen(true)}>
              Edit Profile
            </button>
          </div>
          {topBadge && (
            <div className="profile-top-badge">
              <span className="top-badge-label">Top badge</span>
              <span className="top-badge-icon">{topBadge.icon}</span>
              <span className="top-badge-name">{topBadge.name}</span>
            </div>
          )}
        </div>

        <div className="profile-completion-block">
          <motion.div className="completion-header">
            <span>Profile completion</span>
            <span className="completion-pct">{completion}%</span>
            {completion >= 100 && <span className="completion-badge">Complete</span>}
          </motion.div>
          <div className="completion-bar-track">
            <motion.div
              className="completion-bar-fill"
              initial={{ width: 0 }}
              animate={{ width: `${completion}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>
        </div>

        <div className="xp-level-block">
          <div className="xp-level-labels">
            <span>Level {level}</span>
            <span>{xpInLevel} / {xpForNext} XP</span>
          </div>
          <motion.div className="xp-bar-track">
            <motion.div
              className="xp-bar-fill"
              initial={{ width: 0 }}
              animate={{ width: `${xpPct}%` }}
              transition={{ duration: 0.9 }}
            />
          </motion.div>
          <p className="xp-total">{xp.toLocaleString()} total XP</p>
        </div>
      </motion.section>

      <motion.section
        className="profile-stats-grid"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        {[
          { label: 'Notes read', value: stats.notesRead, icon: '📚' },
          { label: 'Videos', value: stats.videos, icon: '🎬' },
          { label: 'Tests', value: stats.tests, icon: '📝' },
          { label: 'Streak', value: stats.streak, icon: '🔥' },
          { label: 'Study hrs', value: stats.studyHours, icon: '⏱️' },
          { label: 'Badges', value: earned.size, icon: '🏅' },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            className="profile-stat-card"
            whileHover={{ y: -4, boxShadow: '0 12px 32px rgba(64, 156, 255, 0.2)' }}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * i }}
          >
            <span className="stat-card-icon">{s.icon}</span>
            <span className="stat-card-value">{s.value}</span>
            <span className="stat-card-label">{s.label}</span>
          </motion.div>
        ))}
      </motion.section>

      {history.length > 0 && (
        <section className="profile-section">
          <h2 className="section-title">Recent unlocks</h2>
          <div className="achievement-timeline">
            {history.map((h, i) => {
              const b = BADGES.find((x) => x.id === h.id);
              if (!b) return null;
              return (
                <motion.div
                  key={`${h.id}-${h.unlockedAt}`}
                  className="timeline-item"
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <span className="timeline-icon">{b.icon}</span>
                  <div>
                    <strong>{b.name}</strong>
                    <span className="timeline-date">
                      {new Date(h.unlockedAt).toLocaleDateString()}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>
      )}

      <section className="profile-section">
        <div className="badges-section-header">
          <h2 className="section-title">Achievements</h2>
          <div className="badge-filters">
            {['all', 'earned', 'locked'].map((f) => (
              <button
                key={f}
                type="button"
                className={`badge-filter-btn${filter === f ? ' active' : ''}`}
                onClick={() => setFilter(f)}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>
        <div className="badges-showcase-scroll">
          <div className="gamified-badges-grid">
            {filteredBadges.map((badge, i) => (
              <motion.div
                key={badge.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.02 }}
              >
                <BadgeCard badge={badge} unlocked={earned.has(badge.id)} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <EditProfileModal open={editOpen} onClose={() => setEditOpen(false)} />
    </div>
  );
}
