import { clientData } from 'src/core/clientData';
import { computeDrinkStats } from 'src/features/calculations/computeDrinkStats';
import { computeEquipmentStats } from 'src/features/calculations/computeEquipmentStats';
import { CommunityBuffState } from 'src/features/communityBuff/communityBuffSlice';
import { HouseState } from 'src/features/house/houseSlice';

interface ComputeActionXpParams {
  equipmentStats: ReturnType<typeof computeEquipmentStats>;
  drinkStats: ReturnType<typeof computeDrinkStats>;
  communityBuffs: CommunityBuffState;
  houseStats: HouseState;
  baseXp: number;
}

export function computeActionXp({
  equipmentStats,
  drinkStats,
  communityBuffs,
  houseStats,
  baseXp
}: ComputeActionXpParams) {
  const equipBonus = equipmentStats.skillingExperience ?? 0;
  const drinkBonus = drinkStats['/buff_types/wisdom'] ?? 0;
  const houseBonus =
    Object.values(houseStats).reduce((acc, val) => acc + val, 0) * 0.0005;

  const communityBuffLevel = communityBuffs['/community_buff_types/experience'];
  let communityBuffBonus = 0;
  if (communityBuffLevel > 0) {
    const { flatBoost, flatBoostLevelBonus } =
      clientData.communityBuffTypeDetailMap['/community_buff_types/experience'].buff;
    communityBuffBonus = flatBoost + (communityBuffLevel - 1) * flatBoostLevelBonus;
  }
  console.log(equipBonus, drinkBonus, houseBonus, communityBuffBonus);
  return baseXp * (1 + equipBonus + drinkBonus + communityBuffBonus + houseBonus);
}
