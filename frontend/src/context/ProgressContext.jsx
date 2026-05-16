import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useAuth } from './AuthContext';
import {
  DEFAULT_PROGRESS,
  loadProgress,
  saveProgress,
  touchStreak,
} from '../utils/progressStorage';

const ProgressContext = createContext(null);

const BADGE_RULES = [
  { id: 'first-test', icon: '📝', name: 'First Steps', check: (p) => Object.keys(p.testResults || {}).some((k) => p.testResults[k]?.attempts) },
  { id: 'quiz-ace', icon: '🏆', name: 'Quiz Ace', check: (p) => Object.values(p.testResults || {}).some((r) => r.passed) },
  { id: 'note-reader', icon: '📚', name: 'Note Reader', check: (p) => (p.notesRead?.length || 0) >= 5 },
  { id: 'video-binger', icon: '🎬', name: 'Binge Learner', check: (p) => Object.keys(p.videosWatched || {}).length >= 3 },
  { id: 'xp-500', icon: '⚡', name: 'XP Hunter', check: (p) => (p.xp || 0) >= 500 },
  { id: 'streak-3', icon: '🔥', name: 'On Fire', check: (p) => (p.streak || 0) >= 3 },
];

function awardBadges(progress) {
  const badges = new Set(progress.badges || []);
  BADGE_RULES.forEach((rule) => {
    if (rule.check(progress)) badges.add(rule.id);
  });
  return { ...progress, badges: [...badges] };
}

export function ProgressProvider({ children }) {
  const { refreshUser } = useAuth();
  const [progress, setProgress] = useState(loadProgress);

  useEffect(() => {
    setProgress(touchStreak(loadProgress()));
  }, []);

  const persist = useCallback((next) => {
    const withStreak = awardBadges(touchStreak(next));
    setProgress(withStreak);
    saveProgress(withStreak);
    refreshUser();
    return withStreak;
  }, [refreshUser]);

  const addXP = useCallback(
    (amount) => {
      persist({ ...progress, xp: (progress.xp || 0) + amount });
    },
    [progress, persist],
  );

  const recordNoteRead = useCallback(
    (topicId) => {
      const notesRead = progress.notesRead || [];
      if (notesRead.includes(topicId)) return;
      persist({ ...progress, notesRead: [...notesRead, topicId], xp: (progress.xp || 0) + 15 });
    },
    [progress, persist],
  );

  const recordVideoWatch = useCallback(
    (videoId, percent = 100) => {
      const videosWatched = {
        ...(progress.videosWatched || {}),
        [videoId]: {
          percent: Math.max(percent, progress.videosWatched?.[videoId]?.percent || 0),
          lastWatched: Date.now(),
          completed: percent >= 90,
        },
      };
      const xpBonus = percent >= 50 && !progress.videosWatched?.[videoId]?.completed ? 25 : 0;
      persist({ ...progress, videosWatched, xp: (progress.xp || 0) + xpBonus });
    },
    [progress, persist, addXP],
  );

  const recordTestResult = useCallback(
    (testId, { score, total, passed, xpEarned }) => {
      const prev = progress.testResults?.[testId] || { attempts: 0, bestScore: 0 };
      const bestScore = Math.max(prev.bestScore || 0, score);
      const testResults = {
        ...(progress.testResults || {}),
        [testId]: {
          attempts: (prev.attempts || 0) + 1,
          bestScore,
          lastScore: score,
          total,
          passed,
          totalAnswered: (prev.totalAnswered || 0) + total,
          lastAttempt: Date.now(),
          xpEarned: (prev.xpEarned || 0) + xpEarned,
        },
      };
      persist({ ...progress, testResults, xp: (progress.xp || 0) + xpEarned });
    },
    [progress, persist],
  );

  const setSubjectProgress = useCallback(
    (slug, percent) => {
      persist({
        ...progress,
        subjectProgress: { ...(progress.subjectProgress || {}), [slug]: percent },
      });
    },
    [progress, persist],
  );

  const getTestProgress = useCallback(
    (testId) => progress.testResults?.[testId]?.bestScore ?? 0,
    [progress],
  );

  const value = useMemo(
    () => ({
      progress,
      addXP,
      recordNoteRead,
      recordVideoWatch,
      recordTestResult,
      setSubjectProgress,
      getTestProgress,
      badgeDefinitions: BADGE_RULES,
    }),
    [progress, addXP, recordNoteRead, recordVideoWatch, recordTestResult, setSubjectProgress, getTestProgress],
  );

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error('useProgress must be used within ProgressProvider');
  return ctx;
}
