import { BuffDetail } from 'src/old/core/buffs/BuffDetail';
import { ActionTypeHrid } from 'src/old/core/hrid/ActionTypeHrid';
import { CommunityBuffTypeHrid } from 'src/old/core/hrid/CommunityBuffTypeHrid';

export interface CommunityBuffTypeDetail {
  hrid: CommunityBuffTypeHrid;
  name: string;
  usableInActionTypeMap: Record<ActionTypeHrid, boolean>;
  buff: BuffDetail;
  description: string;
  cowbellCost: number;
  sortIndex: number;
}
