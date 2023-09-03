import { BuffDetail } from 'src/core/buffs/BuffDetail';
import { ActionTypeHrid } from 'src/core/hrid/ActionTypeHrid';

export interface ConsumableDetail {
  cooldownDuration: number;
  usableInActionTypeMap: null | Partial<Record<ActionTypeHrid, boolean>>;
  hitpointRestore: number;
  manapointRestore: number;
  recoveryDuration: number;
  buffs: BuffDetail[] | null;
  defaultCombatTriggers: null; // TODO
}
