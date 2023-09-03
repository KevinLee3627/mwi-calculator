// Minimum action time is 3 seconds
export const baseTimeToSeconds = (baseTime: number, bonus = 0) =>
  Math.max((baseTime / 1e9) * (1 / (1 + bonus)), 3);
