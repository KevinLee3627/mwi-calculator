import { clientData } from 'src/core/clientData';
import { ItemLocationHrid } from 'src/core/hrid/ItemLocationHrid';
import { ItemDetail } from 'src/core/items/ItemDetail';
import { equipmentTypeHridToItemLocationHrid } from 'src/util/equipmentTypeHridToItemLocationHrid';

export const itemLocationToItemMap = Object.values(clientData.itemDetailMap).reduce<
  Record<ItemLocationHrid, ItemDetail[]>
>((acc, val) => {
  if (val.equipmentDetail.type === '') return acc;
  const itemLocationHrid = equipmentTypeHridToItemLocationHrid(val.equipmentDetail.type);
  if (acc[itemLocationHrid] == null) {
    acc[itemLocationHrid] = [];
  }
  acc[itemLocationHrid].push(val);
  return acc;
}, {} as Record<ItemLocationHrid, ItemDetail[]>);
