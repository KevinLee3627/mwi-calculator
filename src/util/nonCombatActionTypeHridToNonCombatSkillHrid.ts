import { NonCombatActionTypeHrid } from 'src/core/actions/NonCombatActionTypeHrid';
import { NonCombatSkillHrid } from 'src/core/skills/NonCombatSkillHrid';

// TODO: Ridiculous name...
export const nonCombatActionTypeHridToSkillHrid: Record<
  NonCombatActionTypeHrid,
  NonCombatSkillHrid
> = {
  '/action_types/brewing': '/skills/brewing',
  '/action_types/cheesesmithing': '/skills/cheesesmithing',
  '/action_types/cooking': '/skills/cooking',
  '/action_types/crafting': '/skills/crafting',
  '/action_types/enhancing': '/skills/enhancing',
  '/action_types/foraging': '/skills/foraging',
  '/action_types/milking': '/skills/milking',
  '/action_types/tailoring': '/skills/tailoring',
  '/action_types/woodcutting': '/skills/woodcutting'
};
