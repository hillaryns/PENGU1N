import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import InteractiveCard from './InteractiveCard';
import { useProgress } from '../context/ProgressContext';

const levelStyles = {
  Beginner: 'pill-beginner',
  Intermediate: 'pill-intermediate',
  Advanced: 'pill-advanced',
};

export default function TestCard({ test, index = 0 }) {
  const navigate = useNavigate();
  const { getTestProgress } = useProgress();
  const best = getTestProgress(test.id);

  return (
    <InteractiveCard className="test-card" delay={index * 0.05}>
      <motion.div
        className="test-header"
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.05 + 0.1 }}
      >
        <motion.div>
          <span className="test-topic">{test.topic}</span>
          <h3 className="test-title">{test.title}</h3>
        </motion.div>
        <span className={`test-badge difficulty-pill ${levelStyles[test.level] || ''}`}>
          {test.level}
        </span>
      </motion.div>

      <p className="test-description">{test.description}</p>

      <motion.div
        className="test-meta test-meta-rich"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: index * 0.05 + 0.15 }}
      >
        <span><i className="fas fa-question-circle" /> {test.questions} Q</span>
        <span><i className="fas fa-clock" /> {test.minutes} min</span>
        <span><i className="fas fa-bolt" /> {test.xp} XP</span>
        <span><i className="fas fa-star" /> {test.rating}</span>
        <span><i className="fas fa-redo" /> {test.attempts} attempts</span>
        <span><i className="fas fa-percentage" /> {test.passRate}% pass</span>
      </motion.div>

      {test.tags?.length > 0 && (
        <div className="course-tags">
          {test.tags.map((tag) => (
            <span key={tag} className="course-tag">
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="test-progress">
        <motion.div className="progress-bar">
          <motion.div
            className="progress-fill"
            initial={{ width: 0 }}
            animate={{ width: `${best || test.progress}%` }}
            transition={{ delay: index * 0.05 + 0.2, duration: 0.7 }}
          />
        </motion.div>
        <span className="course-progress-label">{best || test.progress}% best score</span>
      </div>

      <motion.div
        className="test-card-footer"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 + 0.25 }}
      >
        <span className="course-instructor">
          <i className="fas fa-user" /> {test.instructor}
        </span>
        {test.trending && <span className="badge-trending small">Hot</span>}
        {test.certificate && (
          <span className="badge-cert-inline">
            <i className="fas fa-certificate" /> Cert
          </span>
        )}
      </motion.div>

      {test.prerequisites?.length > 0 && (
        <p className="course-prereq">
          <i className="fas fa-link" /> {test.prerequisites.join(', ')}
        </p>
      )}

      <motion.button
        type="button"
        className="btn btn-primary magnetic-btn"
        onClick={() => navigate(`/tests/${test.id}`)}
        whileHover={{ scale: 1.03, boxShadow: '0 0 28px var(--accent-glow)' }}
        whileTap={{ scale: 0.97 }}
      >
        Start Test
      </motion.button>
    </InteractiveCard>
  );
}
