import { motion } from 'framer-motion';
import InteractiveCard from './InteractiveCard';

const difficultyColors = {
  Beginner: 'pill-beginner',
  Intermediate: 'pill-intermediate',
  Advanced: 'pill-advanced',
};

export default function CourseCard({ course, index = 0 }) {
  return (
    <InteractiveCard className="course-card subject-card" delay={index * 0.04} to={`/subject/${course.slug}`}>
      <motion.div
        className={`subject-banner ${course.bannerClass}`}
        whileHover={{ scale: 1.02 }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        <i className={course.icon} />
        {course.trending && <span className="badge-trending">Trending</span>}
        {course.certificate && (
          <span className="badge-cert" title="Certificate included">
            <i className="fas fa-certificate" />
          </span>
        )}
      </motion.div>
      <div className="subject-content course-card-body">
        <motion.div
          className="course-card-top"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.04 + 0.1 }}
        >
          <h3 className="subject-title">{course.title}</h3>
          <span className={`difficulty-pill ${difficultyColors[course.difficulty] || ''}`}>
            {course.difficulty}
          </span>
        </motion.div>
        <p className="subject-description">{course.description}</p>
        <div className="course-progress-row">
          <motion.div className="progress-bar">
            <motion.div
              className="progress-fill"
              initial={{ width: 0 }}
              animate={{ width: `${course.progress}%` }}
              transition={{ delay: index * 0.04 + 0.25, duration: 0.8, ease: 'easeOut' }}
            />
          </motion.div>
          <span className="course-progress-label">{course.progress}% complete</span>
        </div>
        <motion.div
          className="course-meta-grid"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.04 + 0.2 }}
        >
          <span><i className="fas fa-clock" /> {course.duration}</span>
          <span><i className="fas fa-bolt" /> {course.xp} XP</span>
          <span><i className="fas fa-star" /> {course.rating}</span>
          <span><i className="fas fa-users" /> {(course.students / 1000).toFixed(1)}k</span>
        </motion.div>
        <motion.div
          className="course-tags"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.04 + 0.25 }}
        >
          {course.tags?.map((tag) => (
            <span key={tag} className="course-tag">
              {tag}
            </span>
          ))}
        </motion.div>
        <motion.div
          className="course-footer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.04 + 0.3 }}
        >
          <span className="course-instructor">
            <i className="fas fa-chalkboard-teacher" /> {course.instructor}
          </span>
          <span className="course-updated">Updated {course.lastUpdated}</span>
        </motion.div>
        {course.prerequisites?.length > 0 && (
          <p className="course-prereq">
            <i className="fas fa-link" /> {course.prerequisites.join(', ')}
          </p>
        )}
        <motion.div
          className="subject-meta"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.04 + 0.35 }}
        >
          <span><i className="fas fa-file-alt" /> {course.notes} Notes</span>
          <span><i className="fas fa-question" /> {course.questions} Questions</span>
          <span><i className="fas fa-hourglass-half" /> {course.estimatedCompletion}</span>
        </motion.div>
      </div>
    </InteractiveCard>
  );
}
