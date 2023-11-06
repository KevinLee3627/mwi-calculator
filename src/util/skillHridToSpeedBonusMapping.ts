import { NonCombatStats } from 'src/core/items/NonCombatStats';
import { NonCombatSkillHrid } from 'src/core/skills/NonCombatSkillHrid';

export const skillHridToSpeedBonus: Record<NonCombatSkillHrid, keyof NonCombatStats> = {
  '/skills/brewing': 'brewingSpeed',
  '/skills/cheesesmithing': 'cheesesmithingSpeed',
  '/skills/cooking': 'cookingSpeed',
  '/skills/crafting': 'craftingSpeed',
  '/skills/enhancing': 'enhancingSpeed',
  '/skills/foraging': 'foragingSpeed',
  '/skills/milking': 'milkingSpeed',
  '/skills/tailoring': 'tailoringSpeed',
  '/skills/woodcutting': 'woodcuttingSpeed'
};
