import { EquipmentTypeHrid } from 'src/new/core/hrid/EquipmentTypeHrid';
import { CombatEnhancementBonuses } from 'src/new/core/items/CombatEnhancementBonuses';
import { CombatStats } from 'src/new/core/items/CombatStats';
import { LevelRequirement } from 'src/new/core/items/LevelRequirement';
import { NonCombatEnhancementBonuses } from 'src/new/core/items/NonCombatEnhancementBonuses';
import { NonCombatStats } from 'src/new/core/items/NonCombatStats';

export interface EquipmentDetail {
  type: '' | EquipmentTypeHrid;
  levelRequirements: null | LevelRequirement[];
  combatStats: CombatStats;
  noncombatStats: NonCombatStats;
  combatEnhancementBonuses: CombatEnhancementBonuses;
  noncombatEnhancementBonuses: NonCombatEnhancementBonuses;
}
