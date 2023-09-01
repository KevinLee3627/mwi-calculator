import { ActionTypeHrid } from 'src/core/hrid/ActionTypeHrid';

export interface ConsumableDetail {
  cooldownDuration: number;
  usableInActionTypeMap: null | { [key in ActionTypeHrid]: boolean };
  hitpointRestore: number;
  manapointRestore: number;
  recoveryDuration: number;
  buffs: null;
  defaultCombatTriggers: null; // TODO
}
