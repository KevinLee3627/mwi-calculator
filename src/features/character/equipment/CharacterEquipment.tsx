import { useMemo } from 'react';
import { clientData } from 'src/core/clientData';
import { ItemDetail } from 'src/core/items/ItemDetail';
import { CharacterEnhancementSelect } from 'src/features/character/enhancements/CharacterEnhancementSelect';
import { CharacterEquipmentSelect } from 'src/features/character/equipment/CharacterEquipmentSelect';
import {
  PossibleCharacterEquipmentLocationHrid,
  selectCharacterEquipment
} from 'src/features/character/equipment/characterEquipmentSlice';
import { useAppSelector } from 'src/hooks/useAppSelector';

export function CharacterEquipment() {
  const equipment = useAppSelector(selectCharacterEquipment);

  // Creates mapping between item location and items from client data
  const itemMap = useMemo(() => {
    return Object.values(clientData.itemDetailMap).reduce<Record<string, ItemDetail[]>>(
      (acc, val) => {
        if (val.equipmentDetail.type === '') return acc;

        const location = val.equipmentDetail.type.split('/').at(-1);
        if (location == null) return acc;
        if (acc[location] == null) {
          acc[location] = [];
        }
        acc[location].push(val);
        return acc;
      },
      {}
    );
  }, []);

  const inputs = Object.entries(equipment).map((entry) => {
    const itemLocationHrid = entry[0] as PossibleCharacterEquipmentLocationHrid;
    // Why use location vs. itemLocationHrid? in clientData.itemDetailMap uses
    // EquipmentTypeHrid instead of ItemLocationHrid, which means the two Hrid
    // types have the same suffixes but different prefixes.
    // ex: EquipmentTypeHrid = /equipment_type/head
    // ex: ItemLocationHrid = /item_location/head
    const location = itemLocationHrid.split('/').at(-1);
    console.log(location);
    if (location == null) return <></>;
    return (
      <div className="flex items-end" key={`${itemLocationHrid}_key`}>
        <CharacterEquipmentSelect
          itemLocationHrid={itemLocationHrid}
          possibleItems={itemMap[location]}
        />
        <CharacterEnhancementSelect itemLocationHrid={itemLocationHrid} />
      </div>
    );
  });
  return <div>{inputs}</div>;
}
