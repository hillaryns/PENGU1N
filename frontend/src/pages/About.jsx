import { Link } from 'react-router-dom';
import SmokeBackground from '../components/SmokeBackground';
import PublicNavbar from '../components/PublicNavbar';
import PageTransition from '../components/PageTransition';

export default function About() {
  return (
    <>
      <SmokeBackground />
      <PublicNavbar />
      <PageTransition />
      <main className="page">
        <div className="container">
          <header className="page-header">
            <h1 className="page-title">About LEARNING HUB</h1>
            <p className="page-subtitle">
              Your gateway to mastering skills and building a successful tech career
            </p>
          </header>

          <section className="about-section">
            <div className="about-grid">
              <div className="about-content">
                <h2>What is LEARNING HUB?</h2>
                <p>
                  LEARNING HUB is a comprehensive learning platform designed specifically for students,
                  beginners, and aspiring developers who want to build real-world skills.
                </p>
                <p>
                  We believe in a learning-first, practice-driven approach. Instead of passive video watching,
                  we emphasize hands-on coding, interactive quizzes, and real projects.
                </p>
                <Link to="/signup" className="btn btn-primary">
                  Start Learning Today
                </Link>
              </div>
              <div className="about-visual">
                <div className="feature-item">
                  <div className="feature-icon"><i className="fas fa-book" /></div>
                  <div className="feature-text">
                    <h4>Structured Notes</h4>
                    <p>Topic-wise organized content with code examples</p>
                  </div>
                </div>
                <div className="feature-item proximity-card">
                  <div className="feature-icon"><i className="fas fa-code" /></div>
                  <div className="feature-text">
                    <h4>Practice Problems</h4>
                    <p>MCQs and coding challenges from easy to hard</p>
                  </div>
                </div>
                <div className="feature-item proximity-card">
                  <div className="feature-icon"><i className="fas fa-trophy" /></div>
                  <div className="feature-text">
                    <h4>Track Progress</h4>
                    <p>Earn badges and monitor your learning journey</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="about-section">
            <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Our Learning Philosophy</h2>
            <div className="grid grid-3">
              <div className="card">
                <div className="card-icon"><i className="fas fa-lightbulb" /></div>
                <h3 className="card-title">Learn by Doing</h3>
                <p className="card-description">Every concept comes with hands-on exercises.</p>
              </div>
              <div className="card">
                <div className="card-icon"><i className="fas fa-route" /></div>
                <h3 className="card-title">Structured Path</h3>
                <p className="card-description">Follow a clear roadmap from basics to advanced topics.</p>
              </div>
              <div className="card">
                <div className="card-icon"><i className="fas fa-infinity" /></div>
                <h3 className="card-title">Lifelong Access</h3>
                <p className="card-description">Your notes, progress, and achievements stay with you.</p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
