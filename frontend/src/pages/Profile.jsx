import { useAuth } from '../context/AuthContext';

const badges = [
  { id: 'starter', icon: '🌟', name: 'Getting Started', description: 'Completed profile setup' },
  { id: 'reader', icon: '📚', name: 'Bookworm', description: 'Read 10 notes' },
  { id: 'solver', icon: '🧩', name: 'Problem Solver', description: 'Answer 25 questions' },
  { id: 'tester', icon: '📝', name: 'Test Taker', description: 'Complete 5 tests' },
  { id: 'master', icon: '🎓', name: 'Master Learner', description: 'Complete all subjects', locked: true },
];

export default function Profile() {
  const { user } = useAuth();
  const progress = user?.progress || {};
  const initial = user?.name?.charAt(0)?.toUpperCase() || 'S';

  return (
    <>
      <div className="profile-header">
        <div className="profile-avatar">{initial}</div>
        <div className="profile-info">
          <h2>{user?.name || 'Student'}</h2>
          <p>{user?.email || 'student@example.com'}</p>
          <div className="profile-stats">
            <div className="profile-stat">
              <div className="profile-stat-value">{progress.notesRead || 0}</div>
              <div className="profile-stat-label">Notes Read</div>
            </div>
            <div className="profile-stat">
              <div className="profile-stat-value">{progress.questionsAnswered || 0}</div>
              <div className="profile-stat-label">Questions</div>
            </div>
            <div className="profile-stat">
              <div className="profile-stat-value">{progress.testsTaken || 0}</div>
              <div className="profile-stat-label">Tests</div>
            </div>
          </div>
        </div>
      </div>

      <h2 className="section-title">Badges & Achievements 🏆</h2>
      <div className="badges-grid">
        {badges.map((badge) => (
          <div key={badge.id} className={`badge-card${badge.locked ? ' locked' : ''}`}>
            <div className="badge-icon">{badge.icon}</div>
            <div className="badge-name">{badge.name}</div>
            <div className="badge-description">{badge.description}</div>
          </div>
        ))}
      </div>
    </>
  );
}
