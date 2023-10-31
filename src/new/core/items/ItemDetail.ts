import { ItemCategoryHrid } from 'src/old/core/hrid/ItemCategoryHrid';
import { ItemHrid } from 'src/old/core/hrid/ItemHrid';
import { AbilityBookDetail } from 'src/old/core/items/AbilityBookDetail';
import { ConsumableDetail } from 'src/old/core/items/ConsumableDetail';
import { EquipmentDetail } from 'src/old/core/items/EquipmentDetail';
import { InputItem } from 'src/old/core/items/InputItem';

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
