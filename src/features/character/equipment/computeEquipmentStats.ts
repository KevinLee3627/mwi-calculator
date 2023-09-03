import { NonCombatStats } from 'src/core/items/NonCombatStats';
import { CharacterEnhancementState } from 'src/features/character/enhancements/characterEnhancementSlice';
import { calculateEnhancedBonus } from 'src/features/character/equipment/calculateEnhancedBonus';
import { CharacterEquipmentState } from 'src/features/character/equipment/characterEquipmentSlice';
import { equipmentTypeToItemLocation } from 'src/util/equipmentTypeToItemLocation';

export function computeEquipmentStats(
  equipment: CharacterEquipmentState,
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
