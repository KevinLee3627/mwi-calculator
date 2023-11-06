import { NonCombatStats } from 'src/core/items/NonCombatStats';
import { NonCombatSkillHrid } from 'src/core/skills/NonCombatSkillHrid';

export const skillHridToEfficiencyBonus: Record<
  NonCombatSkillHrid,
  keyof NonCombatStats | null
> = {
  '/skills/brewing': 'brewingEfficiency',
  '/skills/cheesesmithing': 'cheesesmithingEfficiency',
  '/skills/cooking': 'cookingEfficiency',
  '/skills/crafting': 'craftingEfficiency',
  '/skills/enhancing': null,
  '/skills/foraging': 'foragingEfficiency',
  '/skills/milking': 'milkingEfficiency',
  '/skills/tailoring': 'tailoringEfficiency',
  '/skills/woodcutting': 'woodcuttingEfficiency'
};
