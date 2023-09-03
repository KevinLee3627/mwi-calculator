import { NonCombatActionTypeHrid } from 'src/core/actions/NonCombatActionTypeHrid';
import { BuffTypeHrid } from 'src/core/hrid/BuffTypeHrid';
import { NonCombatSkillHrid } from 'src/core/skills/NonCombatSkillHrid';
import { computeEquipmentStats } from 'src/features/character/equipment/computeEquipmentStats';
import { CharacterLevelState } from 'src/features/character/levels/characterLevelSlice';
import { actionTypeEfficiencyStatMapping } from 'src/features/skill/actionTypeStatMapping';
import { computeDrinkStats } from 'src/features/skill/drinks/computeDrinkStats';
import { actionTypeToSkillHrid, actionTypeToSkillName } from 'src/util/hridConverters';

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
  const skillEffStatName = actionTypeEfficiencyStatMapping[actionTypeHrid];
  let equipBonus = 0;
  if (skillEffStatName == null) equipBonus = 0;
  else equipBonus = equipmentStats[skillEffStatName] ?? 0;

  // from necklace
  equipBonus += equipmentStats['skillingEfficiency'] ?? 0;

  const effDrinkBonus = drinkStats['/buff_types/efficiency'] ?? 0;

  const levelDrinkBuffName = `/buff_types/${actionTypeToSkillName(
    actionTypeHrid
  )}_level` as BuffTypeHrid;
  const levelDrinkBonus = drinkStats[levelDrinkBuffName] ?? 0;
  const skillHrid = actionTypeToSkillHrid(actionTypeHrid);
  const effectiveLevel = characterLevels[skillHrid] + levelDrinkBonus;
  const levelBonus = Math.max(effectiveLevel - levelRequirement, 0) / 100;

  return equipBonus + effDrinkBonus + levelBonus;
}
