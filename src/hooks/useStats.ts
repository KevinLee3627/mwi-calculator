import { selectCharacterLevels } from 'src/features/character/levels/characterLevelsSlice';
import {
  selectActiveLoadout,
  selectAllLoadouts
} from 'src/features/character/loadout/loadoutSlice';
import { selectCommunityBuffs } from 'src/features/communityBuff/communityBuffSlice';
import { useAppSelector } from 'src/hooks/useAppSelector';

export function useStats() {
  const characterLevels = useAppSelector(selectCharacterLevels);
  const activeLoadout = useAppSelector(selectActiveLoadout);
  const allLoadouts = useAppSelector(selectAllLoadouts);
  const communityBuffs = useAppSelector(selectCommunityBuffs);

  return { characterLevels, activeLoadout, allLoadouts, communityBuffs };
}
