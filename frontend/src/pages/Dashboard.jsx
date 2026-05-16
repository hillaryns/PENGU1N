import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useProgress } from '../context/ProgressContext';
import AnimatedCounter from '../components/AnimatedCounter';
import DashboardAmbient from '../components/DashboardAmbient';
import InteractiveCard from '../components/InteractiveCard';
import { courses } from '../data/courses';

const stagger = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.12 },
  },
};

const progress = {
  questionsAnswered: 0,
  testsTaken: 0,
  notesRead: 0,
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

export default function Dashboard() {
  const { user } = useAuth();
  const { progress: store } = useProgress();
  const badgePathRef = useRef(null);
  const badgesCount = (store.badges || []).length;
  const totalBadges = 12;
  const percent = Math.min(100, Math.round((badgesCount / totalBadges) * 100));
  const firstName = user?.name?.split(' ')[0] || 'Student';
  const recommended = courses.filter((c) => c.trending).slice(0, 2);

  useEffect(() => {
    const path = badgePathRef.current;
    if (!path) return;
    const len = path.getTotalLength();
    path.style.strokeDasharray = `${len} ${len}`;
    path.style.strokeDashoffset = `${len - (percent / 100) * len}`;
  }, [percent]);

  return (
    <motion.div className="dashboard-page" initial="hidden" animate="show" variants={stagger}>
      <DashboardAmbient />

      <motion.div className="dashboard-gif" aria-hidden="true">
        <img src="/assets/dash%20penguin.gif" alt="" />
      </motion.div>

      <div className="main-content-inner">
        <motion.div className="dashboard-header" variants={fadeUp}>
          <h1 className="welcome-text">Welcome back, {firstName}! 👋</h1>
          <p className="welcome-subtitle">Continue your learning journey</p>
        </motion.div>

        <motion.div className="stats-grid" variants={stagger}>
          <motion.div className="stat-card stat-card-neon" variants={fadeUp} whileHover={{ y: -6 }}>
            <div className="stat-header">
              <span className="stat-label">Notes Read</span>
              <div className="stat-icon"><i className="fas fa-book" /></div>
            </div>
            <motion.div className="stat-value">
              <AnimatedCounter value={progress.notesRead || 0} />
            </motion.div>
          </motion.div>

          <motion.div className="stat-card stat-card-neon" variants={fadeUp} whileHover={{ y: -6 }}>
            <div className="stat-header">
              <span className="stat-label">Questions Solved</span>
              <div className="stat-icon"><i className="fas fa-check" /></div>
            </div>
            <div className="stat-value">
              <AnimatedCounter value={progress.questionsAnswered || 0} />
            </div>
          </motion.div>

          <motion.div className="stat-card stat-card-neon" variants={fadeUp} whileHover={{ y: -6 }}>
            <div className="stat-header">
              <span className="stat-label">Tests Taken</span>
              <div className="stat-icon"><i className="fas fa-clipboard" /></div>
            </div>
            <div className="stat-value">
              <AnimatedCounter value={progress.testsTaken || 0} />
            </div>
          </motion.div>

          <motion.div
            className="stat-card badge-progress-card stat-card-neon"
            variants={fadeUp}
            data-total={totalBadges}
            whileHover={{ y: -6 }}
          >
            <div className="stat-header">
              <span className="stat-label">Badges Earned</span>
              <div className="stat-icon"><i className="fas fa-medal" /></div>
            </div>
            <div className="badge-progress" id="badgeProgressWrap">
              <svg className="progress-ring" width="160" height="80" viewBox="0 0 160 80" aria-hidden="true">
                <defs>
                  <linearGradient id="gradBadge" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="var(--accent-primary)" />
                    <stop offset="100%" stopColor="var(--accent-secondary)" />
                  </linearGradient>
                </defs>
                <path
                  className="progress-bg"
                  d="M20,80 A60,60 0 0,1 140,80"
                  fill="none"
                  stroke="rgba(255,255,255,0.06)"
                  strokeWidth="14"
                  strokeLinecap="round"
                />
                <path
                  ref={badgePathRef}
                  id="badgeProgressPath"
                  className="progress"
                  d="M20,80 A60,60 0 0,1 140,80"
                  fill="none"
                  stroke="url(#gradBadge)"
                  strokeWidth="14"
                  strokeLinecap="round"
                />
              </svg>
              <div className="badge-center">
                <motion.div className="badge-emoji">🏅</motion.div>
                <motion.div
                  id="badgePercent"
                  className="badge-percent"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5, duration: 0.4 }}
                >
                  <AnimatedCounter value={percent} />%
                </motion.div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        <motion.h2 className="section-title section-title-animated" variants={fadeUp}>
          Quick Access
        </motion.h2>
        <motion.div className="grid grid-3 qucik-access" variants={stagger}>
          <InteractiveCard to="/subjects" className="card" delay={0}>
            <div className="card-icon"><i className="fas fa-graduation-cap" /></div>
            <h3 className="card-title">Start Learning</h3>
            <p className="card-description">Browse courses and begin a new topic</p>
          </InteractiveCard>
          <InteractiveCard to="/practice" className="card" delay={0.08}>
            <div className="card-icon"><i className="fas fa-code" /></div>
            <h3 className="card-title">Practice Now</h3>
            <p className="card-description">Test your knowledge with questions</p>
          </InteractiveCard>
          <InteractiveCard to="/tests" className="card" delay={0.16}>
            <div className="card-icon"><i className="fas fa-trophy" /></div>
            <h3 className="card-title">Take a Test</h3>
            <p className="card-description">Challenge yourself with timed assessments</p>
          </InteractiveCard>
        </motion.div>

        <motion.h2
          className="section-title section-title-animated"
          variants={fadeUp}
          style={{ marginTop: '2.5rem' }}
        >
          Recommended for You
        </motion.h2>
        <motion.div className="grid grid-2" variants={stagger}>
          {recommended.map((course, i) => (
            <InteractiveCard key={course.slug} className="subject-card" delay={i * 0.1} to="/subjects">
              <div className={`subject-banner ${course.bannerClass}`}>
                <i className={course.icon} />
              </div>
              <div className="subject-content">
                <h3 className="subject-title">{course.title}</h3>
                <p className="subject-description">{course.description}</p>
                <div className="course-progress-row">
                  <div className="progress-bar">
                    <motion.div
                      className="progress-fill"
                      initial={{ width: 0 }}
                      animate={{ width: `${course.progress}%` }}
                      transition={{ delay: 0.4 + i * 0.1, duration: 0.8 }}
                    />
                  </div>
                  <span className="course-progress-label">{course.progress}% complete</span>
                </div>
              </div>
            </InteractiveCard>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}
