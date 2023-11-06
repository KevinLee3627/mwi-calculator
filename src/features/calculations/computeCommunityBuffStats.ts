import { clientData } from 'src/core/clientData';
import { CommunityBuffState } from 'src/features/communityBuff/communityBuffSlice';

export function computeCommunityBuffStats(communityBuffs: CommunityBuffState) {
  return Object.entries(communityBuffs).reduce((acc, entry) => {
    const buffHrid = entry[0] as keyof CommunityBuffState;
    const buffLevel = entry[1];
    const { flatBoost, flatBoostLevelBonus } =
      clientData.communityBuffTypeDetailMap[buffHrid].buff;
    if (buffLevel > 0) acc[buffHrid] = flatBoost + (buffLevel - 1) * flatBoostLevelBonus;
    else acc[buffHrid] = 0;

    return acc;
  }, {} as Record<keyof CommunityBuffState, number>);
}
