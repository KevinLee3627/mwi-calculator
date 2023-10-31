import { selectCommunityBuffState } from 'src/old/features/communityBuff/communityBuffSlice';
import { useAppSelector } from 'src/old/hooks/useAppSelector';

export function useStats() {
  const buffs = useAppSelector(selectCommunityBuffState);
  return { buffs };
}
