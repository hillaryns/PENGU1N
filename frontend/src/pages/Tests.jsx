import { tests } from '../data/tests';
import { showToast } from '../utils/toast';

const levelStyles = {
  Beginner: {},
  Intermediate: { background: 'rgba(234, 179, 8, 0.1)', color: '#eab308' },
  Advanced: { background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' },
};

export default function Tests() {
  const startTest = (title) => {
    showToast(`Starting ${title}... (demo mode)`);
  };

  return (
    <>
      <div className="dashboard-header">
        <h1 className="welcome-text">Tests 📝</h1>
        <p className="welcome-subtitle">Challenge yourself with timed assessments</p>
      </div>

      <div className="grid grid-2">
        {tests.map((test) => (
          <div key={test.id} className="test-card">
            <div className="test-header">
              <h3 className="test-title">{test.title}</h3>
              <span className="test-badge" style={levelStyles[test.level]}>
                {test.level}
              </span>
            </div>
            <div className="test-meta">
              <span><i className="fas fa-question-circle" /> {test.questions} Questions</span>
              <span><i className="fas fa-clock" /> {test.minutes} mins</span>
            </div>
            <div className="test-progress">
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: '0%' }} />
              </div>
            </div>
            <button type="button" className="btn btn-primary" onClick={() => startTest(test.title)}>
              Start Test
            </button>
          </div>
        ))}
      </div>

      <h2 className="section-title" style={{ marginTop: '3rem' }}>Recent Results</h2>
      <p style={{ color: 'var(--text-secondary)' }}>No tests taken yet. Start a test above!</p>
    </>
  );
}
