export function xpToLevel(xp = 0) {
  let level = 1;
  let needed = 100;
  let remaining = xp;
  while (remaining >= needed && level < 99) {
    remaining -= needed;
    level += 1;
    needed = Math.floor(100 * (1 + level * 0.15));
  }
  const xpInLevel = remaining;
  return { level, xpInLevel, xpForNext: needed, xpTotal: xp };
}

export function rankForLevel(level) {
  if (level >= 25) return 'Legend';
  if (level >= 20) return 'Master';
  if (level >= 15) return 'Expert';
  if (level >= 10) return 'Scholar';
  if (level >= 5) return 'Learner';
  return 'Rookie';
}

export function xpProgressPercent(xpInLevel, xpForNext) {
  if (!xpForNext) return 100;
  return Math.min(100, Math.round((xpInLevel / xpForNext) * 100));
}
