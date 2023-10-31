import { EquipmentTypeHrid } from 'src/new/core/hrid/EquipmentTypeHrid';
import { ItemLocationHrid } from 'src/new/core/hrid/ItemLocationHrid';

export interface EquipmentTypeDetail {
  hrid: EquipmentTypeHrid;
  name: string;
  itemLocationHrid: ItemLocationHrid;
  sortIndex: number;
}
