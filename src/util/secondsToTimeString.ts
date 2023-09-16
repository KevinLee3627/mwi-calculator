export function secondsToTimeString(totalSeconds: number) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = (totalSeconds % 3600) % 60;
  return `${hours} hr, ${minutes} min, ${seconds} s`;
}
