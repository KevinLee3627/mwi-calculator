import { useMemo } from 'react';
import { Select } from 'src/components/Select';
import { clientData } from 'src/core/clientData';
import { ItemDetail } from 'src/core/items/ItemDetail';
import {
  PossibleCharacterEquipmentLocationHrid,
  selectCharacterEquipment,
  setEquipment
} from 'src/features/character/characterEquipmentSlice';
import { useAppDispatch } from 'src/hooks/useAppDispatch';
import { useAppSelector } from 'src/hooks/useAppSelector';

export function CharacterEquipment() {
  const equipment = useAppSelector(selectCharacterEquipment);
  const dispatch = useAppDispatch();

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
    const itemLocationName = clientData.itemLocationDetailMap[itemLocationHrid].name;
    const location = itemLocationHrid.split('/').at(-1);
    console.log(location);
    if (location == null) return <></>;
    return (
      <div className="" key={`${itemLocationHrid}_key`}>
        <span>{itemLocationName}</span>
        <Select
          name={`${itemLocationHrid}_select`}
          options={itemMap[location].map((item) => ({ label: item.name, value: item }))}
          defaultValue={{
            label: equipment[itemLocationHrid]?.name,
            value: equipment[itemLocationHrid]
          }}
          placeholder="test"
          onChange={(selected) => {
            if (selected?.value == null) return;
            dispatch(
              setEquipment({
                itemHrid: selected.value.hrid,
                locationHrid: itemLocationHrid
              })
            );
          }}
        />
      </div>
    );
  });
  return <div>{inputs}</div>;
}
