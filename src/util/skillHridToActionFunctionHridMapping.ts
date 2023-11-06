import { ActionFunctionHrid } from 'src/core/hrid/ActionFunctionHrid';
import { SkillHrid } from 'src/core/hrid/SkillHrid';

export const skillHridToActionFunctionHrid: Record<SkillHrid, ActionFunctionHrid> = {
  '/skills/attack': '/action_functions/combat',
  '/skills/brewing': '/action_functions/production',
  '/skills/cheesesmithing': '/action_functions/production',
  '/skills/cooking': '/action_functions/production',
  '/skills/crafting': '/action_functions/production',
  '/skills/defense': '/action_functions/combat',
  '/skills/enhancing': '/action_functions/enhancing',
  '/skills/foraging': '/action_functions/gathering',
  '/skills/intelligence': '/action_functions/combat',
  '/skills/magic': '/action_functions/combat',
  '/skills/milking': '/action_functions/gathering',
  '/skills/power': '/action_functions/combat',
  '/skills/ranged': '/action_functions/combat',
  '/skills/stamina': '/action_functions/combat',
  '/skills/tailoring': '/action_functions/production',
  '/skills/total_level': '/action_functions/combat',
  '/skills/woodcutting': '/action_functions/gathering'
};
