import { useState } from 'react';
import { tests } from '../data/tests';
import TestCard from '../components/TestCard';
import { useProgress } from '../context/ProgressContext';
import { LEADERBOARD } from '../data/leaderboard';

const filters = ['All', 'Beginner', 'Intermediate', 'Advanced', 'Trending'];

export default function Tests() {
  const [filter, setFilter] = useState('All');
  const { progress } = useProgress();

  const filtered = tests.filter((test) => {
    if (filter === 'All') return true;
    if (filter === 'Trending') return test.trending;
    return test.level === filter;
  });

  const recentResults = Object.entries(progress.testResults || {})
    .filter(([, r]) => r.attempts > 0)
    .sort((a, b) => (b[1].lastAttempt || 0) - (a[1].lastAttempt || 0))
    .slice(0, 5);

  return (
    <div className="tests-page">
      <div className="dashboard-header">
        <h1 className="welcome-text">Tests</h1>
        <p className="welcome-subtitle">
          {filtered.length} assessments · {progress.xp || 0} XP earned
        </p>
      </div>

      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', marginBottom: '2rem' }}>
        <div className="stat-card stat-card-neon">
          <span className="stat-label">Tests Completed</span>
          <div className="stat-value">{recentResults.length}</div>
        </div>
        <div className="stat-card stat-card-neon">
          <span className="stat-label">Total XP</span>
          <div className="stat-value">{progress.xp || 0}</div>
        </div>
        <div className="stat-card stat-card-neon">
          <span className="stat-label">Streak</span>
          <div className="stat-value">{progress.streak || 0}</div>
        </div>
      </div>

      <div className="courses-toolbar">
        {filters.map((f) => (
          <button key={f} type="button" className={`filter-chip${filter === f ? ' active' : ''}`} onClick={() => setFilter(f)}>
            {f}
          </button>
        ))}
      </div>

      <div className="grid grid-2 tests-grid">
        {filtered.map((test, index) => (
          <TestCard key={test.id} test={test} index={index} />
        ))}
      </div>

      <h2 className="section-title" style={{ marginTop: '3rem' }}>Leaderboard</h2>
      <div className="leaderboard" style={{ marginBottom: '2rem' }}>
        {[...LEADERBOARD].sort((a, b) => b.xp - a.xp).map((row, i) => (
          <div key={row.name} className="leaderboard-row">
            <span className="lb-rank">#{i + 1}</span>
            <span className="lb-name">{row.name}</span>
            <span className="lb-xp">{row.xp} XP</span>
          </div>
        ))}
        <div className="leaderboard-row you">
          <span className="lb-rank">—</span>
          <span className="lb-name">You</span>
          <span className="lb-xp">{progress.xp || 0} XP</span>
        </div>
      </div>

      <h2 className="section-title">Recent Results</h2>
      {recentResults.length === 0 ? (
        <p style={{ color: 'var(--text-secondary)' }}>No tests taken yet. Start a test above!</p>
      ) : (
        <div className="result-breakdown">
          {recentResults.map(([testId, result]) => {
            const meta = tests.find((t) => t.id === testId);
            return (
              <div key={testId} className={`result-item ${result.passed ? 'correct' : 'wrong'}`}>
                <strong>{meta?.title || testId}</strong> — {result.lastScore}% ({result.passed ? 'Passed' : 'Failed'}) · Attempt #{result.attempts}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
