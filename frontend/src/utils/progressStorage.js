const PROGRESS_KEY = 'pengu1n_progress';
const USER_KEY = 'user';

export const DEFAULT_PROGRESS = {
  xp: 0,
  streak: 0,
  lastActiveDate: null,
  notesRead: [],
  videosWatched: {},
  testResults: {},
  subjectProgress: {},
  badges: [],
  leaderboardName: null,
  stats: {
    studyMinutes: 0,
    perfectScores: 0,
    testsCompleted: 0,
    lastStudyHour: null,
  },
};

export function loadProgress() {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    if (!raw) return { ...DEFAULT_PROGRESS };
    return { ...DEFAULT_PROGRESS, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_PROGRESS };
  }
}

export function saveProgress(progress) {
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  syncUserProgress(progress);
}

function syncUserProgress(progress) {
  try {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return;
    const user = JSON.parse(raw);
    user.progress = {
      ...(user.progress || {}),
      notesRead: progress.notesRead?.length ?? 0,
      questionsAnswered: Object.values(progress.testResults || {}).reduce(
        (sum, r) => sum + (r.totalAnswered || 0),
        0,
      ),
      testsTaken: Object.keys(progress.testResults || {}).filter(
        (k) => progress.testResults[k]?.attempts > 0,
      ).length,
      xp: progress.xp,
      badges: progress.badges,
      streak: progress.streak,
    };
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch {
    /* ignore */
  }
}

export function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

export function touchStreak(progress) {
  const today = todayKey();
  if (progress.lastActiveDate === today) return progress;
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yKey = yesterday.toISOString().slice(0, 10);
  let streak = progress.streak || 0;
  if (progress.lastActiveDate === yKey) streak += 1;
  else if (progress.lastActiveDate !== today) streak = 1;
  return { ...progress, streak, lastActiveDate: today };
}
