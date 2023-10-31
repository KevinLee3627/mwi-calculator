import { clientData } from 'src/old/core/clientData';
import { ItemDetail } from 'src/old/core/items/ItemDetail';
import { equipmentTypeToItemLocation } from 'src/old/util/hridConverters';

export const itemLocationToItemMap = Object.values(clientData.itemDetailMap).reduce<
  Record<string, ItemDetail[]>
>((acc, val) => {
  if (val.equipmentDetail.type === '') return acc;
  const itemLocationHrid = equipmentTypeToItemLocation(val.equipmentDetail.type);
  if (acc[itemLocationHrid] == null) {
    acc[itemLocationHrid] = [];
  }
  acc[itemLocationHrid].push(val);
  return acc;
}, {});
