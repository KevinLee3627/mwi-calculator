interface ComputeActionTimeParams {
  baseTimeCost: number;
  toolBonus: number;
}

export function computeActionTime({ baseTimeCost, toolBonus }: ComputeActionTimeParams) {
  // baseTimeCost is in nanoseconds for some reason?
  const time = baseTimeCost / 1e9; // time in seconds
  return Math.max(3, time / (1 + toolBonus));
}
