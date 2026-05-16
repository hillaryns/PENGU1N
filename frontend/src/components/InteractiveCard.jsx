import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

function useTiltHandlers(ref) {
  const handleMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    el.style.setProperty('--tilt-x', `${((y - cy) / cy) * -6}deg`);
    el.style.setProperty('--tilt-y', `${((x - cx) / cx) * 6}deg`);
    el.style.setProperty('--glow-x', `${(x / rect.width) * 100}%`);
    el.style.setProperty('--glow-y', `${(y / rect.height) * 100}%`);
  };

  const resetTilt = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty('--tilt-x', '0deg');
    el.style.setProperty('--tilt-y', '0deg');
  };

  return { handleMove, resetTilt };
}

const motionBase = {
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  whileHover: { scale: 1.02 },
  whileTap: { scale: 0.98 },
};

export default function InteractiveCard({
  children,
  className = '',
  to,
  href,
  onClick,
  delay = 0,
  tag: Tag = 'motion.div',
}) {
  const ref = useRef(null);
  const { handleMove, resetTilt } = useTiltHandlers(ref);
  const cls = `interactive-card ${className}`.trim();
  const shared = {
    ref,
    className: cls,
    ...motionBase,
    transition: { ...motionBase.transition, delay },
    onMouseMove: handleMove,
    onMouseLeave: resetTilt,
    onClick,
  };

  const glow = <span className="interactive-card-glow" aria-hidden="true" />;

  if (to) {
    return (
      <motion.div {...motionBase} transition={{ ...motionBase.transition, delay }} style={{ display: 'contents' }}>
        <Link to={to} className={cls} ref={ref} onMouseMove={handleMove} onMouseLeave={resetTilt}>
          {glow}
          {children}
        </Link>
      </motion.div>
    );
  }

  if (href) {
    return (
      <motion.a href={href} {...shared} target="_blank" rel="noreferrer">
        {glow}
        {children}
      </motion.a>
    );
  }

  return (
    <Tag {...shared}>
      {glow}
      {children}
    </Tag>
  );
}
