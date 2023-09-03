import { ActionTypeHrid } from 'src/core/hrid/ActionTypeHrid';
import { NonCombatSkillHrid } from 'src/core/skills/NonCombatSkillHrid';

export const actionTypeToSkill = (actionTypeHrid: ActionTypeHrid): NonCombatSkillHrid =>
  actionTypeHrid.replaceAll('action_type', 'skill') as NonCombatSkillHrid;
