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
import { selectActionQueueState } from 'src/features/queue/actionQueueSlice';
import { selectTargetActions } from 'src/features/targetActionsSlice';
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
  const targetActions = useAppSelector(selectTargetActions);
  const currentXp = useAppSelector(selectCurrentXp);
  const actionQueue = useAppSelector(selectActionQueueState);

  return {
    characterLevels,
    activeLoadout,
    allLoadouts,
    communityBuffs,
    activeSkillState,
    house,
    drinks,
    targetLevels,
    targetActions,
    currentXp,
    actionQueue
  };
}
