import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import SmokeBackground from '../components/SmokeBackground';
import PublicNavbar from '../components/PublicNavbar';
import { getSubjectDetail } from '../data/subjectDetails';
import { courses } from '../data/courses';
import { useProgress } from '../context/ProgressContext';

export default function SubjectDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { progress, setSubjectProgress } = useProgress();
  const detail = getSubjectDetail(slug);
  const course = detail?.course;
  const pct = progress.subjectProgress?.[slug] ?? course?.progress ?? 0;

  if (!detail) {
    return (
      <main className="page">
        <div className="container">
          <h1>Subject not found</h1>
          <Link to="/subjects">Back to courses</Link>
        </div>
      </main>
    );
  }

  const related = detail.relatedSlugs
    .map((s) => courses.find((c) => c.slug === s))
    .filter(Boolean);

  const ripple = (e) => {
    const btn = e.currentTarget;
    const circle = document.createElement('span');
    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    circle.className = 'ripple';
    circle.style.width = circle.style.height = `${size}px`;
    circle.style.left = `${e.clientX - rect.left - size / 2}px`;
    circle.style.top = `${e.clientY - rect.top - size / 2}px`;
    btn.appendChild(circle);
    setTimeout(() => circle.remove(), 600);
  };

  return (
    <>
      <SmokeBackground />
      <PublicNavbar />
      <main className="page subject-detail-page">
        <div className="container container-wide">
          <motion.nav className="breadcrumbs" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Link to="/">Home</Link> / <Link to="/subjects">Courses</Link> / <span>{detail.title}</span>
          </motion.nav>

          <motion.header
            className="subject-hero"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <motion.div className={`subject-banner ${course.bannerClass}`}>
              <i className={course.icon} />
            </motion.div>
            <div>
              <h1 className="page-title">{detail.title}</h1>
              <p className="page-subtitle">{detail.overview}</p>
              <div className="course-progress-row">
                <div className="progress-bar">
                  <motion.div className="progress-fill" animate={{ width: `${pct}%` }} />
                </div>
                <span className="course-progress-label">{pct}% path complete</span>
              </div>
            </div>
          </motion.header>

          <div className="subject-actions">
            <ActionBtn icon="fa-play" label="Start Learning" onClick={() => { setSubjectProgress(slug, Math.min(100, pct + 10)); navigate('/notes'); }} ripple={ripple} />
            <ActionBtn icon="fa-video" label="Watch Videos" onClick={() => navigate('/classes')} ripple={ripple} />
            <ActionBtn icon="fa-code" label="Practice Now" onClick={() => navigate('/practice')} ripple={ripple} />
            <ActionBtn icon="fa-clipboard-check" label="Take Quiz" onClick={() => navigate(detail.tests[0] ? `/tests/${detail.tests[0].id}` : '/tests')} ripple={ripple} />
            <ActionBtn icon="fa-route" label="Continue Path" onClick={() => setSubjectProgress(slug, Math.min(100, pct + 15))} ripple={ripple} />
          </div>

          <section className="subject-section">
            <h2 className="section-title">Learning Roadmap</h2>
            <div className="roadmap">
              {detail.roadmap.map((step, i) => (
                <motion.div
                  key={step.step}
                  className="roadmap-step"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className="roadmap-num">{step.step}</div>
                  <motion.div>
                    <h4>{step.title}</h4>
                    <p>{step.desc}</p>
                    <span className="roadmap-weeks">{step.weeks} week(s)</span>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </section>

          <div className="grid grid-2" style={{ marginTop: '2rem' }}>
            <section className="subject-section card">
              <h3>Career & Salary</h3>
              <p><strong>Roles:</strong> {detail.career.roles.join(', ')}</p>
              <p><strong>Salary:</strong> {detail.career.salary}</p>
              <p><strong>Growth:</strong> {detail.career.growth}</p>
              <p><strong>Completion:</strong> {detail.estimatedCompletion}</p>
            </section>
            <section className="subject-section card">
              <h3>Prerequisites & Tools</h3>
              <ul className="subject-list">
                {detail.prerequisites.map((p) => <li key={p}>{p}</li>)}
              </ul>
              <p style={{ marginTop: '1rem' }}><strong>Tools:</strong> {detail.tools.join(', ')}</p>
            </section>
          </div>

          <section className="subject-section">
            <h2 className="section-title">Project Ideas</h2>
            <ul className="subject-list">
              {detail.projects.map((p) => <li key={p}>{p}</li>)}
            </ul>
          </section>

          <section className="subject-section">
            <h2 className="section-title">Videos</h2>
            <div className="video-embed-grid">
              {detail.videos.map((v) => (
                <div key={v.id} className="embed-card">
                  <div className="embed-wrap">
                    <iframe title={v.title} src={`https://www.youtube.com/embed/${v.videoId}`} allowFullScreen />
                  </div>
                  <p>{v.title}</p>
                </div>
              ))}
            </div>
          </section>

          {related.length > 0 && (
            <section className="subject-section">
              <h2 className="section-title">Because you are learning {detail.title}…</h2>
              <div className="grid grid-3">
                {related.map((c) => (
                  <Link key={c.slug} to={`/subject/${c.slug}`} className="card subject-rec-card">
                    <h4>{c.title}</h4>
                    <p className="card-description">{c.description}</p>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
    </>
  );
}

function ActionBtn({ icon, label, onClick, ripple }) {
  return (
    <motion.button
      type="button"
      className="btn btn-primary subject-action-btn ripple-host"
      onClick={(e) => { ripple(e); onClick(); }}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
    >
      <i className={`fas ${icon}`} /> {label}
    </motion.button>
  );
}
