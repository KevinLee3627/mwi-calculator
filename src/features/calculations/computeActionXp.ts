import { computeCommunityBuffStats } from 'src/features/calculations/computeCommunityBuffStats';
import { computeDrinkStats } from 'src/features/calculations/computeDrinkStats';
import { computeEquipmentStats } from 'src/features/calculations/computeEquipmentStats';
import { HouseState } from 'src/features/house/houseSlice';

interface ComputeActionXpParams {
  equipmentStats: ReturnType<typeof computeEquipmentStats>;
  drinkStats: ReturnType<typeof computeDrinkStats>;
  communityBuffStats: ReturnType<typeof computeCommunityBuffStats>;
  houseStats: HouseState;
  baseXp: number;
}

export function computeActionXp({
  equipmentStats,
  drinkStats,
  communityBuffStats,
  houseStats,
  baseXp
}: ComputeActionXpParams) {
  const equipBonus = equipmentStats.skillingExperience ?? 0;
  const drinkBonus = drinkStats['/buff_types/wisdom'] ?? 0;
  const houseBonus =
    Object.values(houseStats).reduce((acc, val) => acc + val, 0) * 0.0005;

  const communityBuffBonus = communityBuffStats['/community_buff_types/experience'];

  return baseXp * (1 + equipBonus + drinkBonus + communityBuffBonus + houseBonus);
}
