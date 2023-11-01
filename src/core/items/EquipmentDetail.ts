import { EquipmentTypeHrid } from 'src/core/hrid/EquipmentTypeHrid';
import { CombatEnhancementBonuses } from 'src/core/items/CombatEnhancementBonuses';
import { CombatStats } from 'src/core/items/CombatStats';
import { LevelRequirement } from 'src/core/items/LevelRequirement';
import { NonCombatEnhancementBonuses } from 'src/core/items/NonCombatEnhancementBonuses';
import { NonCombatStats } from 'src/core/items/NonCombatStats';

export interface EquipmentDetail {
  type: '' | EquipmentTypeHrid;
  levelRequirements: null | LevelRequirement[];
  combatStats: CombatStats;
  noncombatStats: NonCombatStats;
  combatEnhancementBonuses: CombatEnhancementBonuses;
  noncombatEnhancementBonuses: NonCombatEnhancementBonuses;
}
