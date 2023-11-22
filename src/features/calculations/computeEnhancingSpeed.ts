import { clientData } from 'src/core/clientData';
import { computeCommunityBuffStats } from 'src/features/calculations/computeCommunityBuffStats';
import { computeEquipmentStats } from 'src/features/calculations/computeEquipmentStats';

interface ComputeEnhancingSpeedParams {
  enhancingLevel: number;
  itemLevel: number;
  equipmentStats: ReturnType<typeof computeEquipmentStats>;
  communityBuffStats: ReturnType<typeof computeCommunityBuffStats>;
}

export function computeEnhancingSpeed({
  enhancingLevel,
  itemLevel,
  equipmentStats,
  communityBuffStats
}: ComputeEnhancingSpeedParams) {
  const baseTime =
    clientData.actionDetailMap['/actions/enhancing/enhance'].baseTimeCost / 1e9;

  const levelBonus = Math.max((enhancingLevel - itemLevel) / 100, 0);
  const equipBonus = equipmentStats['enhancingSpeed'] ?? 0;

  const communityBuffBonus =
    communityBuffStats['/community_buff_types/enhancing_speed'] ?? 0;
  const bonus = 1 + levelBonus + equipBonus + communityBuffBonus;
  return Math.max(3, baseTime / bonus);
}
