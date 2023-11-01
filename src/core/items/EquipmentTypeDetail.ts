import { EquipmentTypeHrid } from 'src/core/hrid/EquipmentTypeHrid';
import { ItemLocationHrid } from 'src/core/hrid/ItemLocationHrid';

export interface EquipmentTypeDetail {
  hrid: EquipmentTypeHrid;
  name: string;
  itemLocationHrid: ItemLocationHrid;
  sortIndex: number;
}
