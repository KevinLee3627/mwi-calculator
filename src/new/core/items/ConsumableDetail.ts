import { BuffDetail } from 'src/old/core/buffs/BuffDetail';
import { ActionTypeHrid } from 'src/old/core/hrid/ActionTypeHrid';

export interface ConsumableDetail {
  cooldownDuration: number;
  usableInActionTypeMap: null | Partial<Record<ActionTypeHrid, boolean>>;
  hitpointRestore: number;
  manapointRestore: number;
  recoveryDuration: number;
  buffs: BuffDetail[] | null;
  defaultCombatTriggers: null; // TODO
}
