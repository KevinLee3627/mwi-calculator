import { BuffDetail } from 'src/new/core/buffs/BuffDetail';
import { ActionTypeHrid } from 'src/new/core/hrid/ActionTypeHrid';
import { CommunityBuffTypeHrid } from 'src/new/core/hrid/CommunityBuffTypeHrid';

export interface CommunityBuffTypeDetail {
  hrid: CommunityBuffTypeHrid;
  name: string;
  usableInActionTypeMap: Record<ActionTypeHrid, boolean>;
  buff: BuffDetail;
  description: string;
  cowbellCost: number;
  sortIndex: number;
}
