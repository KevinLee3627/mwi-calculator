import { SkillHrid } from 'src/core/hrid/SkillHrid';

export type NonCombatSkillHrid = Extract<
  SkillHrid,
  | '/skills/brewing'
  | '/skills/cheesesmithing'
  | '/skills/cooking'
  | '/skills/crafting'
  | '/skills/enhancing'
  | '/skills/foraging'
  | '/skills/milking'
  | '/skills/tailoring'
  | '/skills/woodcutting'
>;
