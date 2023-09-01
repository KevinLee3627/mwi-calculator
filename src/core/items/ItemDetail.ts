import { ItemCategoryHrid } from 'src/core/hrid/ItemCategoryHrid';
import { ItemHrid } from 'src/core/hrid/ItemHrid';
import { AbilityBookDetail } from 'src/core/items/AbilityBookDetail';
import { ConsumableDetail } from 'src/core/items/ConsumableDetail';
import { EquipmentDetail } from 'src/core/items/EquipmentDetail';

export interface ItemDetail {
  hrid: ItemHrid;
  name: string;
  description: string;
  categoryHrid: ItemCategoryHrid;
  sellPrice: number;
  isTradable: boolean;
  isOpenable: boolean;
  itemLevel: number;
  enhancementCosts: null | { itemHrid: ItemHrid; count: number }[]; // TODO
  protectionItemHrids: null | []; // TODO
  equipmentDetail: EquipmentDetail;
  consumableDetail: ConsumableDetail;
  abilityBookDetail: AbilityBookDetail;
}
