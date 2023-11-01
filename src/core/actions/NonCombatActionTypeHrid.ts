import { ActionTypeHrid } from 'src/core/hrid/ActionTypeHrid';

export type NonCombatActionTypeHrid = Exclude<ActionTypeHrid, '/action_types/combat'>;
