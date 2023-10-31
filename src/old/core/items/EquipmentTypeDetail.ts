import { EquipmentTypeHrid } from 'src/old/core/hrid/EquipmentTypeHrid';
import { ItemLocationHrid } from 'src/old/core/hrid/ItemLocationHrid';

export interface EquipmentTypeDetail {
  hrid: EquipmentTypeHrid;
  name: string;
  itemLocationHrid: ItemLocationHrid;
  sortIndex: number;
}
