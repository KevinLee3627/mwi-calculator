import { clientData } from 'src/old/core/clientData';
import { computeEquipmentStats } from 'src/old/features/character/equipment/computeEquipmentStats';
import { CommunityBuffState } from 'src/old/features/communityBuff/communityBuffSlice';
import { computeDrinkStats } from 'src/old/features/skill/drinks/computeDrinkStats';

interface ComputeGatheringQuantityBonusParams {
  drinkStats: ReturnType<typeof computeDrinkStats>;
  equipmentStats: ReturnType<typeof computeEquipmentStats>;
  communityBuffs: CommunityBuffState;
}

export function computeGatheringQuantityBonus({
  drinkStats,
  equipmentStats,
  communityBuffs
}: ComputeGatheringQuantityBonusParams) {
  const teaDropQuantityBonus = drinkStats['/buff_types/gathering'] ?? 0;
  const equipDropQuantitybonus = equipmentStats['gatheringQuantity'] ?? 0;

  const communityBuffLevel = communityBuffs['/community_buff_types/gathering_quantity'];
  let communityBuffBonus = 0;
  if (communityBuffLevel > 0) {
    const { flatBoost, flatBoostLevelBonus } =
      clientData.communityBuffTypeDetailMap['/community_buff_types/gathering_quantity']
        .buff;
    communityBuffBonus = flatBoost + (communityBuffLevel - 1) * flatBoostLevelBonus;
  }

  const bonus = teaDropQuantityBonus + equipDropQuantitybonus + communityBuffBonus;
  return bonus;
}
