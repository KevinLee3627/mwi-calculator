import { clientData } from 'src/core/clientData';
import { ItemDetail } from 'src/core/items/ItemDetail';

// enhancementLevel being the level you want to enhance an item to, not the
// player's enhancement level

interface XParams {
  enhancementLevel: number;
  characterEnhancingLevel: number;
  item: ItemDetail;
  toolBonus: number;
}
export function X({
  enhancementLevel,
  characterEnhancingLevel,
  item,
  toolBonus
}: XParams) {
  const baseSuccessRate =
    clientData.enhancementLevelSuccessRateTable[enhancementLevel - 1];
  const rest =
    Math.min((characterEnhancingLevel / item.itemLevel + 1) / 2, 1) +
    toolBonus +
    0.0005 * Math.max(characterEnhancingLevel - item.itemLevel, 0);
  return baseSuccessRate * rest;
}
