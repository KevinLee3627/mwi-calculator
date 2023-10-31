import { clientData } from 'src/old/core/clientData';
import { computeEquipmentStats } from 'src/old/features/character/equipment/computeEquipmentStats';
import { CommunityBuffState } from 'src/old/features/communityBuff/communityBuffSlice';
import { computeDrinkStats } from 'src/old/features/skill/drinks/computeDrinkStats';

interface ComputeSkillXpParams {
  equipmentStats: ReturnType<typeof computeEquipmentStats>;
  drinkStats: ReturnType<typeof computeDrinkStats>;
  communityBuffs: CommunityBuffState;
  baseXp: number;
}
export function computeSkillXp({
  equipmentStats,
  drinkStats,
  communityBuffs,
  baseXp
}: ComputeSkillXpParams) {
  const equipBonus = equipmentStats.skillingExperience ?? 0;
  const drinkBonus = drinkStats['/buff_types/wisdom'] ?? 0;

  const communityBuffLevel = communityBuffs['/community_buff_types/experience'];
  let communityBuffBonus = 0;
  if (communityBuffLevel > 0) {
    const { flatBoost, flatBoostLevelBonus } =
      clientData.communityBuffTypeDetailMap['/community_buff_types/experience'].buff;
    communityBuffBonus = flatBoost + (communityBuffLevel - 1) * flatBoostLevelBonus;
  }
  return baseXp * (1 + equipBonus + drinkBonus + communityBuffBonus);
}
