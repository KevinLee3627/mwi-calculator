import { ItemHrid } from 'src/old/core/hrid/ItemHrid';

export interface DropTableEntry {
  itemHrid: ItemHrid;
  dropRate: number;
  minCount: number;
  maxCount: number;
}
