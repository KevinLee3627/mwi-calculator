import { clientData } from 'src/old/core/clientData';
import { computeEquipmentStats } from 'src/old/features/character/equipment/computeEquipmentStats';
import { CommunityBuffState } from 'src/old/features/communityBuff/communityBuffSlice';
import { baseTimeToSeconds } from 'src/old/util/baseTimeToSeconds';

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

  let communityBuffBonus = 0;
  const communityBuffLevel = communityBuffs['/community_buff_types/enhancing_speed'];
  if (communityBuffLevel > 0) {
    const { flatBoost, flatBoostLevelBonus } =
      clientData.communityBuffTypeDetailMap['/community_buff_types/enhancing_speed'].buff;
    communityBuffBonus = flatBoost + (communityBuffLevel - 1) * flatBoostLevelBonus;
  }
  const bonus = 1 + levelBonus + equipBonus + communityBuffBonus;
  return Math.max(3, baseTime / bonus);
}
