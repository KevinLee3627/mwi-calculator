import { computeEquipmentStats } from 'src/features/character/equipment/computeEquipmentStats';
import { computeDrinkStats } from 'src/features/skill/drinks/computeDrinkStats';

interface ComputeSkillXpParams {
  equipmentStats: ReturnType<typeof computeEquipmentStats>;
  drinkStats: ReturnType<typeof computeDrinkStats>;
  baseXp: number;
}
export function computeSkillXp({
  equipmentStats,
  drinkStats,
  baseXp
}: ComputeSkillXpParams) {
  const equipBonus = equipmentStats.skillingExperience ?? 0;
  const drinkBonus = drinkStats['/buff_types/wisdom'] ?? 0;
  return baseXp * (1 + equipBonus + drinkBonus);
}
