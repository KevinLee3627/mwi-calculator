import { ActionTypeHrid } from 'src/new/core/hrid/ActionTypeHrid';

export type NonCombatActionTypeHrid = Exclude<ActionTypeHrid, '/action_types/combat'>;
