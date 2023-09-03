import { NonCombatActionTypeHrid } from 'src/core/actions/NonCombatActionTypeHrid';
import { NonCombatSkillHrid } from 'src/core/skills/NonCombatSkillHrid';
import { computeEquipmentStats } from 'src/features/character/equipment/computeEquipmentStats';
import { CharacterLevelState } from 'src/features/character/levels/characterLevelSlice';
import { actionTypeEfficiencyStatMapping } from 'src/features/skill/actionTypeStatMapping';
import { computeDrinkStats } from 'src/features/skill/drinks/computeDrinkStats';

interface ComputeSkillEfficiencyParams {
  actionTypeHrid: NonCombatActionTypeHrid;
  equipmentStats: ReturnType<typeof computeEquipmentStats>;
  drinkStats: ReturnType<typeof computeDrinkStats>;
  characterLevels: CharacterLevelState;
  levelRequirement: number;
}
export function computeSkillEfficiency({
  actionTypeHrid,
  equipmentStats,
  drinkStats,
  characterLevels,
  levelRequirement
}: ComputeSkillEfficiencyParams) {
  const effStatName = actionTypeEfficiencyStatMapping[actionTypeHrid];
  let equipBonus = 0;
  if (effStatName == null) equipBonus = 0;
  else equipBonus = equipmentStats[effStatName] ?? 0;

  const drinkBonus = drinkStats['/buff_types/efficiency'] ?? 0;

  const skillHrid = actionTypeHrid.replace(
    '/action_type',
    '/skill'
  ) as NonCombatSkillHrid;

  const levelBonus = Math.max(characterLevels[skillHrid] - levelRequirement, 0) / 100;
  return equipBonus + drinkBonus + levelBonus;
}
