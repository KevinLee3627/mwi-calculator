import { SkillHrid } from 'src/new/core/hrid/SkillHrid';

export type NonCombatSkillHrid = Exclude<
  SkillHrid,
  | '/skills/attack'
  | '/skills/defense'
  | '/skills/intelligence'
  | '/skills/magic'
  | '/skills/power'
  | '/skills/ranged'
  | '/skills/stamina'
  | '/skills/total_level'
>;
