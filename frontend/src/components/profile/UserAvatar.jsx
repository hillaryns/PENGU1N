import { motion } from 'framer-motion';
import { useUserDisplay } from '../../hooks/useUserDisplay';

const SIZES = {
  sm: 36,
  md: 44,
  lg: 56,
  xl: 80,
};

export default function UserAvatar({
  size = 'md',
  showOnline,
  glow = true,
  className = '',
  letter: letterOverride,
  src: srcOverride,
  loading,
}) {
  const { avatarUrl, avatarLetter, authLoading } = useUserDisplay();
  const px = typeof size === 'number' ? size : SIZES[size] || SIZES.md;
  const src = srcOverride ?? avatarUrl;
  const letter = letterOverride ?? avatarLetter;
  const isLoading = loading ?? authLoading;

  return (
    <motion.div
      className={`user-avatar-ring size-${size}${glow ? ' has-glow' : ''}${className ? ` ${className}` : ''}`}
      style={{ width: px, height: px }}
      whileHover={{ scale: 1.04 }}
      transition={{ type: 'spring', stiffness: 400, damping: 22 }}
    >
      {isLoading && !src ? (
        <span className="user-avatar-skeleton" aria-hidden />
      ) : src ? (
        <img src={src} alt="" className="user-avatar-img" />
      ) : (
        <span className="user-avatar-letter">{letter}</span>
      )}
      {showOnline && <span className="user-avatar-online" title="Online" aria-label="Online" />}
    </motion.div>
  );
}
