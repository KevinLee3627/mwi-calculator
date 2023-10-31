import { NonCombatActionTypeHrid } from 'src/old/core/actions/NonCombatActionTypeHrid';
import { clientData } from 'src/old/core/clientData';
import { BuffTypeHrid } from 'src/old/core/hrid/BuffTypeHrid';
import { computeEquipmentStats } from 'src/old/features/character/equipment/computeEquipmentStats';
import { CharacterLevelState } from 'src/old/features/character/levels/characterLevelSlice';
import { CommunityBuffState } from 'src/old/features/communityBuff/communityBuffSlice';
import {
  actionTypeActionFunctionMapping,
  actionTypeEfficiencyStatMapping
} from 'src/old/features/skill/actionTypeStatMapping';
import { computeDrinkStats } from 'src/old/features/skill/drinks/computeDrinkStats';
import {
  actionTypeToSkillHrid,
  actionTypeToSkillName
} from 'src/old/util/hridConverters';

interface ComputeSkillEfficiencyParams {
  actionTypeHrid: NonCombatActionTypeHrid;
  equipmentStats: ReturnType<typeof computeEquipmentStats>;
  drinkStats: ReturnType<typeof computeDrinkStats>;
  characterLevels: CharacterLevelState;
  levelRequirement: number;
  communityBuffs: CommunityBuffState;
}
export function computeSkillEfficiency({
  actionTypeHrid,
  equipmentStats,
  drinkStats,
  characterLevels,
  levelRequirement,
  communityBuffs
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

  let communityBuffBonus = 0;

  const actionFunction = actionTypeActionFunctionMapping[actionTypeHrid];
  const communityBuffLevel =
    communityBuffs['/community_buff_types/production_efficiency'];
  if (actionFunction === '/action_functions/production' && communityBuffLevel > 0) {
    const { flatBoost, flatBoostLevelBonus } =
      clientData.communityBuffTypeDetailMap['/community_buff_types/production_efficiency']
        .buff;
    communityBuffBonus = flatBoost + (communityBuffLevel - 1) * flatBoostLevelBonus;
  }

  return equipBonus + effDrinkBonus + levelBonus + communityBuffBonus;
}
