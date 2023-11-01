import { ItemCategoryHrid } from 'src/new/core/hrid/ItemCategoryHrid';
import { ItemHrid } from 'src/new/core/hrid/ItemHrid';
import { AbilityBookDetail } from 'src/new/core/items/AbilityBookDetail';
import { ConsumableDetail } from 'src/new/core/items/ConsumableDetail';
import { EquipmentDetail } from 'src/new/core/items/EquipmentDetail';
import { InputItem } from 'src/new/core/items/InputItem';

export interface ItemDetail {
  hrid: ItemHrid;
  name: string;
  description: string;
  categoryHrid: ItemCategoryHrid;
  sellPrice: number;
  isTradable: boolean;
  isOpenable: boolean;
  itemLevel: number;
  enhancementCosts: null | InputItem[]; // TODO - Rename InputItem?
  protectionItemHrids: null | ItemHrid[];
  equipmentDetail: EquipmentDetail;
  consumableDetail: ConsumableDetail;
  abilityBookDetail: AbilityBookDetail;
}
