import { BuffDetail } from 'src/core/buffs/BuffDetail';
import { ActionTypeHrid } from 'src/core/hrid/ActionTypeHrid';
import { CommunityBuffTypeHrid } from 'src/core/hrid/CommunityBuffTypeHrid';

export interface CommunityBuffTypeDetail {
  hrid: CommunityBuffTypeHrid;
  name: string;
  usableInActionTypeMap: Record<ActionTypeHrid, boolean>;
  buff: BuffDetail;
  description: string;
  cowbellCost: number;
  sortIndex: number;
}
