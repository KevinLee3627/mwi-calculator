import { clientData } from 'src/core/clientData';
import { ItemDetail } from 'src/core/items/ItemDetail';
import { NonCombatStats } from 'src/core/items/NonCombatStats';

const multiplierTable = clientData.enhancementLevelTotalBonusMultiplierTable;

export function calculateEnhancedBonus(
  equip: ItemDetail,
  enhanceLevel: number,
  stat: keyof NonCombatStats
) {
  if (enhanceLevel < 0 || enhanceLevel > 20) {
    // TODO: Throw error?
  }

  const totalBonusMultiplier =
    equip.equipmentDetail.noncombatEnhancementBonuses[stat] *
    multiplierTable[enhanceLevel];

  return totalBonusMultiplier;
}
