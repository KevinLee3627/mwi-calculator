import { CharacterEquipmentState } from 'src/features/character/equipment/characterEquipmentSlice';

export function computeEquipmentStats(equipment: CharacterEquipmentState) {
  // Look through all player equipment and gather the bonuses up
  const stats = Object.values(equipment).reduce<Record<string, number>>((acc, val) => {
    const noncombatStats = val?.equipmentDetail.noncombatStats;
    if (noncombatStats == null) return acc;

    Object.entries(noncombatStats).forEach((entry) => {
      const [key, val] = entry;
      if (acc[key] == null) acc[key] = 0;
      acc[key] += val;
    });

    return acc;
  }, {});
  return stats;
}
