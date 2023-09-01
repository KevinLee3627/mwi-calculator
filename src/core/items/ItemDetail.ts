import { ItemCategoryHrid } from 'src/core/hrid/ItemCategoryHrid';
import { ItemHrid } from 'src/core/hrid/ItemHrid';
import { AbilityBookDetail } from 'src/core/items/AbilityBookDetail';
import { ConsumableDetail } from 'src/core/items/ConsumableDetail';
import { EquipmentDetail } from 'src/core/items/EquipmentDetail';
import { InputItem } from 'src/core/items/InputItem';

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
