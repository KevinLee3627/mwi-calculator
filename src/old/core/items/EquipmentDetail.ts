import { EquipmentTypeHrid } from 'src/old/core/hrid/EquipmentTypeHrid';
import { CombatEnhancementBonuses } from 'src/old/core/items/CombatEnhancementBonuses';
import { CombatStats } from 'src/old/core/items/CombatStats';
import { LevelRequirement } from 'src/old/core/items/LevelRequirement';
import { NonCombatEnhancementBonuses } from 'src/old/core/items/NonCombatEnhancementBonuses';
import { NonCombatStats } from 'src/old/core/items/NonCombatStats';

export interface EquipmentDetail {
  type: '' | EquipmentTypeHrid;
  levelRequirements: null | LevelRequirement[];
  combatStats: CombatStats;
  noncombatStats: NonCombatStats;
  combatEnhancementBonuses: CombatEnhancementBonuses;
  noncombatEnhancementBonuses: NonCombatEnhancementBonuses;
}
