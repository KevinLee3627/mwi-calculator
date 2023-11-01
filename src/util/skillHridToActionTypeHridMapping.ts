import { ActionTypeHrid } from 'src/core/hrid/ActionTypeHrid';
import { SkillHrid } from 'src/core/hrid/SkillHrid';

export const skillHridToActionTypeHrid: Record<SkillHrid, ActionTypeHrid> = {
  '/skills/attack': '/action_types/combat',
  '/skills/brewing': '/action_types/brewing',
  '/skills/cheesesmithing': '/action_types/cheesesmithing',
  '/skills/cooking': '/action_types/cooking',
  '/skills/crafting': '/action_types/crafting',
  '/skills/defense': '/action_types/combat',
  '/skills/enhancing': '/action_types/enhancing',
  '/skills/foraging': '/action_types/foraging',
  '/skills/intelligence': '/action_types/combat',
  '/skills/magic': '/action_types/combat',
  '/skills/milking': '/action_types/milking',
  '/skills/power': '/action_types/combat',
  '/skills/ranged': '/action_types/combat',
  '/skills/stamina': '/action_types/combat',
  '/skills/tailoring': '/action_types/tailoring',
  '/skills/total_level': '/action_types/combat',
  '/skills/woodcutting': '/action_types/combat'
};
