import { ActionTypeHrid } from 'src/old/core/hrid/ActionTypeHrid';

export type NonCombatActionTypeHrid = Exclude<ActionTypeHrid, '/action_types/combat'>;
