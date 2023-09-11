import { clientData } from 'src/core/clientData';
import { computeEquipmentStats } from 'src/features/character/equipment/computeEquipmentStats';
import { CommunityBuffState } from 'src/features/communityBuff/communityBuffSlice';
import { baseTimeToSeconds } from 'src/util/baseTimeToSeconds';

interface ComputeEnhancingSpeedParams {
  enhancingLevel: number;
  itemLevel: number;
  equipmentStats: ReturnType<typeof computeEquipmentStats>;
  communityBuffs: CommunityBuffState;
}

export function computeEnhancingSpeed({
  enhancingLevel,
  itemLevel,
  equipmentStats,
  communityBuffs
}: ComputeEnhancingSpeedParams) {
  const baseTime = baseTimeToSeconds(
    clientData.actionDetailMap['/actions/enhancing/enhance'].baseTimeCost
  );

  const levelBonus = Math.max((enhancingLevel - itemLevel) / 100, 0);
  const equipBonus = equipmentStats['enhancingSpeed'] ?? 0;

  const communityBuffLevel = communityBuffs['/community_buff_types/enhancing_speed'];
  const { flatBoost, flatBoostLevelBonus } =
    clientData.communityBuffTypeDetailMap['/community_buff_types/enhancing_speed'].buff;
  const communityBuffBonus = flatBoost + (communityBuffLevel - 1) * flatBoostLevelBonus;
  const bonus = 1 + levelBonus + equipBonus + communityBuffBonus;
  return Math.max(3, baseTime / bonus);
}
