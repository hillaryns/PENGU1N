import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();
  const badgePathRef = useRef(null);
  const progress = user?.progress || {};
  const badgesCount = (progress.badges || []).length;
  const totalBadges = 12;
  const percent = Math.min(100, Math.round((badgesCount / totalBadges) * 100));
  const firstName = user?.name?.split(' ')[0] || 'Student';

  useEffect(() => {
    const path = badgePathRef.current;
    if (!path) return;
    const len = path.getTotalLength();
    path.style.strokeDasharray = `${len} ${len}`;
    path.style.strokeDashoffset = `${len - (percent / 100) * len}`;
  }, [percent]);

  return (
    <>
      <div className="dashboard-header">
        <h1 className="welcome-text">Welcome back, {firstName}! 👋</h1>
        <p className="welcome-subtitle">Continue your learning journey</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-label">Notes Read</span>
            <div className="stat-icon"><i className="fas fa-book" /></div>
          </div>
          <div className="stat-value">{progress.notesRead || 0}</div>
        </div>
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-label">Questions Solved</span>
            <div className="stat-icon"><i className="fas fa-check" /></div>
          </div>
          <div className="stat-value">{progress.questionsAnswered || 0}</div>
        </div>
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-label">Tests Taken</span>
            <div className="stat-icon"><i className="fas fa-clipboard" /></div>
          </div>
          <div className="stat-value">{progress.testsTaken || 0}</div>
        </div>
        <div className="stat-card badge-progress-card" data-total={totalBadges}>
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
              <path className="progress-bg" d="M20,80 A60,60 0 0,1 140,80" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="14" strokeLinecap="round" />
              <path ref={badgePathRef} id="badgeProgressPath" className="progress" d="M20,80 A60,60 0 0,1 140,80" fill="none" stroke="url(#gradBadge)" strokeWidth="14" strokeLinecap="round" />
            </svg>
            <div className="badge-center">
              <div className="badge-emoji">🏅</div>
              <div id="badgePercent" className="badge-percent">{percent}%</div>
            </div>
          </div>
        </div>
      </div>

      <h2 className="section-title">Quick Access</h2>
      <div className="grid grid-3 qucik-access">
        <Link to="/subjects" className="card">
          <div className="card-icon"><i className="fas fa-graduation-cap" /></div>
          <h3 className="card-title">Start Learning</h3>
          <p className="card-description">Browse subjects and begin a new topic</p>
        </Link>
        <Link to="/practice" className="card">
          <div className="card-icon"><i className="fas fa-code" /></div>
          <h3 className="card-title">Practice Now</h3>
          <p className="card-description">Test your knowledge with questions</p>
        </Link>
        <Link to="/tests" className="card">
          <div className="card-icon"><i className="fas fa-trophy" /></div>
          <h3 className="card-title">Take a Test</h3>
          <p className="card-description">Challenge yourself with timed assessments</p>
        </Link>
      </div>

      <h2 className="section-title">Recommended for You</h2>
      <div className="grid grid-2">
        <div className="subject-card">
          <div className="subject-banner html"><i className="fab fa-html5" /></div>
          <div className="subject-content">
            <h3 className="subject-title">HTML Fundamentals</h3>
            <p className="subject-description">Master the building blocks of the web</p>
          </div>
        </div>
        <div className="subject-card">
          <div className="subject-banner js"><i className="fab fa-js" /></div>
          <div className="subject-content">
            <h3 className="subject-title">JavaScript Basics</h3>
            <p className="subject-description">Add interactivity to your websites</p>
          </div>
        </div>
      </div>

      <div className="dashboard-gif">
        <img src="/assets/dash%20penguin.gif" alt="Dashboard animation" />
      </div>
    </>
  );
}
