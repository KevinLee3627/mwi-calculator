import { NonCombatActionTypeHrid } from 'src/old/core/actions/NonCombatActionTypeHrid';
import { computeEquipmentStats } from 'src/old/features/character/equipment/computeEquipmentStats';
import { actionTypeSpeedStatMapping } from 'src/old/features/skill/actionTypeStatMapping';
import { baseTimeToSeconds } from 'src/old/util/baseTimeToSeconds';

interface ComputeSkillTimeParams {
  actionTypeHrid: NonCombatActionTypeHrid;
  equipmentStats: ReturnType<typeof computeEquipmentStats>;
  baseTime: number;
}
export function computeSkillTime({
  actionTypeHrid,
  equipmentStats,
  baseTime
}: ComputeSkillTimeParams) {
  const speedStatName = actionTypeSpeedStatMapping[actionTypeHrid];
  const equipBonus = equipmentStats[speedStatName] ?? 0;
  const baseTimeInSeconds = baseTimeToSeconds(baseTime);
  const realTime = baseTimeInSeconds / (1 + equipBonus);
  return Math.max(realTime, 3);
}
