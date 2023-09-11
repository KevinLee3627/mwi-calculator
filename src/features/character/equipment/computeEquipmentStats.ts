import { NonCombatStats } from 'src/core/items/NonCombatStats';
import { calculateEnhancedBonus } from 'src/features/character/equipment/calculateEnhancedBonus';
import {
  CharacterEnhancementState,
  Loadout
} from 'src/features/character/loadouts/loadoutSlice';
import { equipmentTypeToItemLocation } from 'src/util/hridConverters';

export function computeEquipmentStats(
  equipment: Loadout['equipment'],
  enhancementLevels: CharacterEnhancementState
) {
  // Look through all player equipment and gather the bonuses up
  const stats = Object.values(equipment).reduce<Record<string, number>>((acc, item) => {
    if (item == null) return acc;
    const equipmentTypeHrid = item.equipmentDetail.type;
    if (equipmentTypeHrid === '') return acc;

    const noncombatStats = item.equipmentDetail.noncombatStats;
    Object.entries(noncombatStats).forEach((entry) => {
      const statName = entry[0] as keyof NonCombatStats;
      const baseStatValue = entry[1];
      if (acc[statName] == null) acc[statName] = 0;
      acc[statName] +=
        baseStatValue +
        calculateEnhancedBonus(
          item,
          enhancementLevels[equipmentTypeToItemLocation(equipmentTypeHrid)],
          statName
        );
    });

    return acc;
  }, {}) as Record<keyof NonCombatStats, number>;
  return stats;
}
