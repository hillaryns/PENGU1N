import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useAuth } from './AuthContext';
import { api } from '../api/client';
import { BADGES } from '../data/badges';
import {
  DEFAULT_PROGRESS,
  loadProgress,
  saveProgress,
  touchStreak,
} from '../utils/progressStorage';

const ProgressContext = createContext(null);

function mergeFromServer(local, serverGamification) {
  if (!serverGamification) return local;
  return {
    ...local,
    xp: Math.max(local.xp || 0, serverGamification.xp || 0),
    streak: Math.max(local.streak || 0, serverGamification.streak || 0),
    notesRead: [...new Set([...(local.notesRead || []), ...(serverGamification.notesRead || [])])],
    videosWatched: { ...(local.videosWatched || {}), ...(serverGamification.videosWatched || {}) },
    testResults: { ...(local.testResults || {}), ...(serverGamification.testResults || {}) },
    badges: [...new Set([...(local.badges || []), ...(serverGamification.badges || [])])],
    level: serverGamification.level,
    rank: serverGamification.rank,
  };
}

export function ProgressProvider({ children }) {
  const { user, persistUser, isAuthenticated } = useAuth();
  const [progress, setProgress] = useState(loadProgress);
  const [pendingUnlocks, setPendingUnlocks] = useState([]);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    const initial = touchStreak(loadProgress());
    if (user?.gamification) {
      setProgress(mergeFromServer(initial, user.gamification));
    } else {
      setProgress(initial);
    }
  }, [user?.email]);

  const syncToServer = useCallback(
    async (nextProgress) => {
      if (!isAuthenticated || !user?.email) return null;
      try {
        setSyncing(true);
        const data = await api.syncProgress(nextProgress, 2);
        if (data.progress) {
          saveProgress(data.progress);
          setProgress(data.progress);
        }
        if (data.profile) {
          persistUser({
            ...user,
            ...data.profile,
            verified: user.verified,
            profileUpdatedAt: Date.now(),
          });
        }
        if (data.newlyUnlocked?.length) {
          setPendingUnlocks((prev) => [...prev, ...data.newlyUnlocked]);
        }
        return data;
      } catch (err) {
        console.warn('[progress] sync failed', err.message);
        return null;
      } finally {
        setSyncing(false);
      }
    },
    [isAuthenticated, user, persistUser],
  );

  const persist = useCallback(
    (next) => {
      const withStreak = touchStreak(next);
      const hour = new Date().getHours();
      const withStats = {
        ...withStreak,
        stats: {
          ...(withStreak.stats || {}),
          lastStudyHour: hour,
          studyMinutes: (withStreak.stats?.studyMinutes || 0) + 2,
        },
      };
      setProgress(withStats);
      saveProgress(withStats);
      syncToServer(withStats);
      return withStats;
    },
    [syncToServer],
  );

  const dismissUnlock = useCallback((id) => {
    setPendingUnlocks((prev) => prev.filter((b) => b.id !== id));
  }, []);

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
    [progress, persist],
  );

  const recordTestResult = useCallback(
    (testId, { score, total, passed, xpEarned }) => {
      const prev = progress.testResults?.[testId] || { attempts: 0, bestScore: 0 };
      const bestScore = Math.max(prev.bestScore || 0, score);
      const isPerfect = score >= 100;
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
      persist({
        ...progress,
        testResults,
        xp: (progress.xp || 0) + xpEarned,
        stats: {
          ...(progress.stats || {}),
          perfectScores: (progress.stats?.perfectScores || 0) + (isPerfect ? 1 : 0),
          testsCompleted: Object.keys(testResults).filter((k) => testResults[k]?.attempts > 0).length,
        },
      });
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
      syncing,
      pendingUnlocks,
      dismissUnlock,
      addXP,
      recordNoteRead,
      recordVideoWatch,
      recordTestResult,
      setSubjectProgress,
      getTestProgress,
      badgeDefinitions: BADGES,
      syncToServer,
    }),
    [
      progress,
      syncing,
      pendingUnlocks,
      dismissUnlock,
      addXP,
      recordNoteRead,
      recordVideoWatch,
      recordTestResult,
      setSubjectProgress,
      getTestProgress,
      syncToServer,
    ],
  );

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error('useProgress must be used within ProgressProvider');
  return ctx;
}
