import { ItemHrid } from 'src/new/core/hrid/ItemHrid';

export interface DropTableEntry {
  itemHrid: ItemHrid;
  dropRate: number;
  minCount: number;
  maxCount: number;
}
