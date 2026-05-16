import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { usePageTransition } from '../../context/PageTransitionContext';
import { useUserDisplay } from '../../hooks/useUserDisplay';
import UserAvatar from './UserAvatar';

const MENU_ITEMS = [
  { to: '/profile', icon: 'fa-user', label: 'Profile' },
  { to: '/dashboard', icon: 'fa-home', label: 'Dashboard' },
  { to: '/profile', icon: 'fa-cog', label: 'Settings', hash: 'settings' },
];

export default function ProfileMenu({ compact = false }) {
  const { logout } = useAuth();
  const { displayName, username, rank, level } = useUserDisplay();
  const runTransition = usePageTransition();
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    const onDoc = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  const handleLogout = () => {
    setOpen(false);
    logout({ silent: true });
    runTransition('/signin');
  };

  return (
    <motion.div
      ref={rootRef}
      className={`profile-menu-root${compact ? ' compact' : ''}`}
      initial={false}
    >
      <button
        type="button"
        className="profile-menu-trigger auth-glass-panel"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="true"
      >
        <UserAvatar size="sm" showOnline />
        {!compact && (
          <span className="profile-menu-labels">
            <span className="profile-menu-name">{displayName}</span>
            <span className="profile-menu-meta">
              @{username} · Lv {level} {rank}
            </span>
          </span>
        )}
        <i className={`fas fa-chevron-down profile-menu-chevron${open ? ' open' : ''}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="profile-menu-dropdown auth-glass-panel"
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div className="profile-menu-dropdown-header">
              <UserAvatar size="md" />
              <div>
                <strong>{displayName}</strong>
                <span>@{username}</span>
                <span className="profile-menu-rank-pill">{rank} · Lv {level}</span>
              </div>
            </motion.div>
            <ul className="profile-menu-list">
              {MENU_ITEMS.map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.hash ? `${item.to}#${item.hash}` : item.to}
                    className="profile-menu-item"
                    onClick={() => setOpen(false)}
                  >
                    <i className={`fas ${item.icon}`} />
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <button type="button" className="profile-menu-item danger" onClick={handleLogout}>
                  <i className="fas fa-sign-out-alt" />
                  Logout
                </button>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
