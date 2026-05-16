import { useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useProgress } from '../context/ProgressContext';
import { resolveAvatarUrl, defaultAvatarLetter } from '../utils/avatarUrl';
import { xpToLevel, rankForLevel } from '../utils/levels';

/** Centralized display fields for avatar, name, level — updates when AuthContext user changes */
export function useUserDisplay() {
  const { user, loading: authLoading } = useAuth();
  const { progress } = useProgress();

  return useMemo(() => {
    const xp = progress?.xp ?? user?.gamification?.xp ?? user?.progress?.xp ?? 0;
    const levelInfo = xpToLevel(xp);
    const level = user?.gamification?.level ?? levelInfo.level;
    const rank = user?.gamification?.rank ?? rankForLevel(level);
    const displayName = user?.displayName || user?.name || 'Student';
    const username = user?.username || user?.email?.split('@')[0] || 'student';
    const cacheKey = user?.profileUpdatedAt || user?.profilePicture || '';
    const avatarUrl = resolveAvatarUrl(user?.profilePicture, cacheKey);

    return {
      user,
      authLoading,
      displayName,
      username,
      email: user?.email || '',
      avatarUrl,
      avatarLetter: defaultAvatarLetter(displayName),
      level,
      rank,
      xp,
      streak: progress?.streak ?? user?.gamification?.streak ?? 0,
      profileCompletion: user?.profileCompletion ?? 0,
      xpInLevel: user?.gamification?.xpInLevel ?? levelInfo.xpInLevel,
      xpForNext: user?.gamification?.xpForNext ?? levelInfo.xpForNext,
    };
  }, [user, progress, authLoading]);
}
