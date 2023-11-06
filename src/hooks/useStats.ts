import { selectActiveSkillState } from 'src/features/activeSkillSlice';
import { selectCharacterLevels } from 'src/features/character/levels/characterLevelsSlice';
import {
  selectActiveLoadout,
  selectAllLoadouts
} from 'src/features/character/loadout/loadoutSlice';
import { selectCommunityBuffs } from 'src/features/communityBuff/communityBuffSlice';
import { selectCurrentXp } from 'src/features/currentXpSlice';
import { selectSkillDrinks } from 'src/features/drinks/drinksSlice';
import { selectHouse } from 'src/features/house/houseSlice';
import { selectTargetLevels } from 'src/features/targetLevelSlice';
import { useAppSelector } from 'src/hooks/useAppSelector';

export function useStats() {
  const characterLevels = useAppSelector(selectCharacterLevels);
  const activeLoadout = useAppSelector(selectActiveLoadout);
  const allLoadouts = useAppSelector(selectAllLoadouts);
  const communityBuffs = useAppSelector(selectCommunityBuffs);
  const activeSkillState = useAppSelector(selectActiveSkillState);
  const house = useAppSelector(selectHouse);
  const drinks = useAppSelector(selectSkillDrinks);
  const targetLevels = useAppSelector(selectTargetLevels);
  const currentXp = useAppSelector(selectCurrentXp);

  return {
    characterLevels,
    activeLoadout,
    allLoadouts,
    communityBuffs,
    activeSkillState,
    house,
    drinks,
    targetLevels,
    currentXp
  };
}

// function computeGatheringQuantityBonus() {
// const teaDropQuantityBonus = drinkStats['/buff_types/gathering'] ?? 0;
// const equipDropQuantitybonus = equipmentStats['gatheringQuantity'] ?? 0;
// const communityBuffLevel = communityBuffs['/community_buff_types/gathering_quantity'];
// let communityBuffBonus = 0;
// if (communityBuffLevel > 0) {
//   const { flatBoost, flatBoostLevelBonus } =
//     clientData.communityBuffTypeDetailMap['/community_buff_types/gathering_quantity']
//       .buff;
//   communityBuffBonus = flatBoost + (communityBuffLevel - 1) * flatBoostLevelBonus;
// }
// const bonus = teaDropQuantityBonus + equipDropQuantitybonus + communityBuffBonus;
// return bonus;
// }
