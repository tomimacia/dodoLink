export const formatSecondsToHHMMSS = (
  totalSeconds: number,
  hideSeconds?: boolean
) => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);

  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${pad(hours)}:${pad(minutes)}${!hideSeconds ? `:${pad(seconds)}` : ""}`;
};
