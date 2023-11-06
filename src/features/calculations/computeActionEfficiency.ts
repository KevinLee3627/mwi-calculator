import { clientData } from 'src/core/clientData';
import { NonCombatSkillHrid } from 'src/core/skills/NonCombatSkillHrid';
import { computeCommunityBuffStats } from 'src/features/calculations/computeCommunityBuffStats';
import { computeDrinkStats } from 'src/features/calculations/computeDrinkStats';
import { computeEquipmentStats } from 'src/features/calculations/computeEquipmentStats';
import { HouseState } from 'src/features/house/houseSlice';
import { skillHridToEfficiencyBonus } from 'src/util/skillHridToEfficiencyBonusMapping';
import { skillHridToRoomHrid } from 'src/util/skillHridToRoomHridMapping';
import { skillHridToTeaBuffHrid } from 'src/util/skillHridToTeaBuffHridMapping';

interface ComputeActionEfficiencyParams {
  actionLevel: number;
  characterLevel: number;
  equipmentStats: ReturnType<typeof computeEquipmentStats>;
  drinkStats: ReturnType<typeof computeDrinkStats>;
  communityBuffStats: ReturnType<typeof computeCommunityBuffStats>;
  house: HouseState;
  skillHrid: NonCombatSkillHrid;
}

const { communityBuffTypeDetailMap } = clientData;

export function computeActionEfficiency({
  actionLevel,
  characterLevel,
  equipmentStats,
  drinkStats,
  communityBuffStats,
  house,
  skillHrid
}: ComputeActionEfficiencyParams) {
  const levelBonus = Math.max(0, characterLevel - actionLevel);

  const skillTeaBonus = drinkStats[skillHridToTeaBuffHrid[skillHrid]];
  const effTeaBonus = drinkStats['/buff_types/efficiency'];
  const necklaceBonus = equipmentStats['skillingEfficiency'] ?? 0;

  // turns /skills/milking --> milkingEfficiency
  const equipEffStatName = skillHridToEfficiencyBonus[skillHrid];
  const gearBonus = equipEffStatName ? equipmentStats[equipEffStatName] : 0;

  const communityBuffBonus =
    communityBuffStats['/community_buff_types/production_efficiency'] ?? 0;

  const roomHrid = skillHridToRoomHrid[skillHrid];
  const houseBonus = clientData.houseRoomDetailMap[roomHrid];

  return 0;
}
