import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useUserDisplay } from '../../hooks/useUserDisplay';
import UserAvatar from './UserAvatar';

export default function SidebarProfile() {
  const { displayName, username, rank, level } = useUserDisplay();

  return (
    <NavLink to="/profile" className="sidebar-profile-card">
      <motion.div
        className="sidebar-profile-inner"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <UserAvatar size="lg" showOnline glow />
        <div className="sidebar-profile-text">
          <h4>{displayName}</h4>
          <p>@{username}</p>
          <span className="sidebar-rank-badge">
            {rank} · Lv {level}
          </span>
        </div>
        <i className="fas fa-chevron-right sidebar-profile-arrow" />
      </motion.div>
    </NavLink>
  );
}
