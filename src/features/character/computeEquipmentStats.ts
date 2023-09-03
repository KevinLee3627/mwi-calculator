import { NonCombatStats } from 'src/core/items/NonCombatStats';
import { calculateEnhancedBonus } from 'src/features/character/calculateEnhancedBonus';
import { CharacterEnhancementState } from 'src/features/character/enhancements/characterEnhancementSlice';
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
      const stat = entry[0] as keyof NonCombatStats;
      const val = entry[1];
      if (acc[stat] == null) acc[stat] = 0;
      acc[stat] +=
        val +
        calculateEnhancedBonus(
          item,
          enhancementLevels[equipmentTypeToItemLocation(equipmentTypeHrid)],
          stat
        );
    });

    return acc;
  }, {});
  return stats;
}
