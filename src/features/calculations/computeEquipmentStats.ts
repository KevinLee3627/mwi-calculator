import { clientData } from 'src/core/clientData';
import { NonCombatStats } from 'src/core/items/NonCombatStats';
import {
  CharacterEquipmentState,
  Loadout
} from 'src/features/character/loadout/loadoutSlice';

export function computeEquipmentStats(loadout: Loadout) {
  // Look through all player equipment and gather the bonuses up
  const stats = Object.entries(loadout.equipment).reduce<Record<string, number>>(
    (acc, entry) => {
      const itemLocationHrid = entry[0] as keyof CharacterEquipmentState;
      const item = entry[1];
      if (item == null) return acc;

      const equipmentTypeHrid = item.equipmentDetail.type;
      if (equipmentTypeHrid === '') return acc;

      const { noncombatStats, noncombatEnhancementBonuses } = item.equipmentDetail;

      // Loop over the noncombat stats for the current item
      Object.entries(noncombatStats).forEach((entry) => {
        const statName = entry[0] as keyof NonCombatStats;
        const baseStatValue = entry[1];

        if (acc[statName] == null) acc[statName] = 0;

        const multiTable = clientData.enhancementLevelTotalBonusMultiplierTable;
        const enhanceLevel = loadout.enhancementLevels[itemLocationHrid];
        const enhanceBonus =
          multiTable[enhanceLevel] * noncombatEnhancementBonuses[statName];
        acc[statName] += baseStatValue + enhanceBonus;
      });

      return acc;
    },
    {}
  ) as Record<keyof NonCombatStats, number | undefined>;
  return stats;
}
