import { motion } from 'framer-motion';

const particles = Array.from({ length: 24 }, (_, i) => ({
  id: i,
  left: `${(i * 17 + 11) % 100}%`,
  top: `${(i * 23 + 7) % 100}%`,
  size: 2 + (i % 4),
  delay: (i % 8) * 0.4,
  duration: 4 + (i % 5),
}));

export default function DashboardAmbient() {
  return (
    <motion.div
      className="dashboard-ambient"
      aria-hidden="true"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2 }}
    >
      <motion.div
        className="ambient-orb ambient-orb-1"
        animate={{ scale: [1, 1.15, 1], opacity: [0.35, 0.55, 0.35] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="ambient-orb ambient-orb-2"
        animate={{ scale: [1.1, 0.95, 1.1], opacity: [0.25, 0.45, 0.25] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      />
      <div className="ambient-grid" />
      {particles.map((p) => (
        <motion.span
          key={p.id}
          className="ambient-particle"
          style={{ left: p.left, top: p.top, width: p.size, height: p.size }}
          animate={{ y: [0, -18, 0], opacity: [0.2, 0.7, 0.2] }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: 'easeInOut',
          }}
        />
      ))}
    </motion.div>
  );
}
