import { BuffTypeHrid } from 'src/core/hrid/BuffTypeHrid';
import { SkillHrid } from 'src/core/hrid/SkillHrid';

export const skillHridToTeaBuffHrid: Record<
  Exclude<SkillHrid, '/skills/total_level'>,
  BuffTypeHrid
> = {
  '/skills/attack': '/buff_types/attack_level',
  '/skills/brewing': '/buff_types/brewing_level',
  '/skills/cheesesmithing': '/buff_types/cheesesmithing_level',
  '/skills/cooking': '/buff_types/cooking_level',
  '/skills/crafting': '/buff_types/crafting_level',
  '/skills/defense': '/buff_types/defense_level',
  '/skills/enhancing': '/buff_types/enhancing_level',
  '/skills/foraging': '/buff_types/foraging_level',
  '/skills/intelligence': '/buff_types/intelligence_level',
  '/skills/magic': '/buff_types/magic_level',
  '/skills/milking': '/buff_types/milking_level',
  '/skills/power': '/buff_types/power_level',
  '/skills/ranged': '/buff_types/ranged_level',
  '/skills/stamina': '/buff_types/stamina_level',
  '/skills/tailoring': '/buff_types/tailoring_level',
  '/skills/woodcutting': '/buff_types/woodcutting_level'
};
