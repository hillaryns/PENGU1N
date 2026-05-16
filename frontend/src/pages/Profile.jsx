import { useAuth } from '../context/AuthContext';
import { useProgress } from '../context/ProgressContext';

const badgeMeta = {
  'first-test': { icon: '📝', name: 'First Steps', description: 'Completed your first test' },
  'quiz-ace': { icon: '🏆', name: 'Quiz Ace', description: 'Passed a test' },
  'note-reader': { icon: '📚', name: 'Note Reader', description: 'Read 5+ notes' },
  'video-binger': { icon: '🎬', name: 'Binge Learner', description: 'Watched 3+ videos' },
  'xp-500': { icon: '⚡', name: 'XP Hunter', description: 'Earned 500+ XP' },
  'streak-3': { icon: '🔥', name: 'On Fire', description: '3-day streak' },
};

export default function Profile() {
  const { user } = useAuth();
  const { progress } = useProgress();
  const initial = user?.name?.charAt(0)?.toUpperCase() || 'S';
  const earned = progress.badges || [];

  const stats = {
    notesRead: progress.notesRead?.length ?? user?.progress?.notesRead ?? 0,
    questions: Object.values(progress.testResults || {}).reduce((s, r) => s + (r.totalAnswered || 0), 0),
    tests: Object.keys(progress.testResults || {}).filter((k) => progress.testResults[k]?.attempts > 0).length,
    xp: progress.xp || 0,
    streak: progress.streak || 0,
  };

  return (
    <>
      <div className="profile-header">
        <div className="profile-avatar">{initial}</div>
        <div className="profile-info">
          <h2>{user?.name || 'Student'}</h2>
          <p>{user?.email || 'student@example.com'}</p>
          <div className="profile-stats">
            <div className="profile-stat">
              <div className="profile-stat-value">{stats.notesRead}</div>
              <div className="profile-stat-label">Notes Read</div>
            </div>
            <div className="profile-stat">
              <div className="profile-stat-value">{stats.questions}</div>
              <div className="profile-stat-label">Questions</div>
            </div>
            <div className="profile-stat">
              <div className="profile-stat-value">{stats.tests}</div>
              <div className="profile-stat-label">Tests</div>
            </div>
            <div className="profile-stat">
              <div className="profile-stat-value">{stats.xp}</div>
              <div className="profile-stat-label">XP</div>
            </div>
            <div className="profile-stat">
              <div className="profile-stat-value">{stats.streak}</div>
              <div className="profile-stat-label">Streak</div>
            </div>
          </div>
        </div>
      </div>

      <h2 className="section-title">Badges and Achievements</h2>
      <div className="badges-grid">
        {Object.entries(badgeMeta).map(([id, badge]) => {
          const unlocked = earned.includes(id);
          return (
            <div key={id} className={`badge-card${unlocked ? '' : ' locked'}`}>
              <div className="badge-icon">{badge.icon}</div>
              <div className="badge-name">{badge.name}</div>
              <div className="badge-description">{badge.description}</div>
            </div>
          );
        })}
      </div>
    </>
  );
}
