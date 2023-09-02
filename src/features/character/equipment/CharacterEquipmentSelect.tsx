import { Select } from 'src/components/Select';
import { clientData } from 'src/core/clientData';
import { ItemDetail } from 'src/core/items/ItemDetail';
import {
  PossibleCharacterEquipmentLocationHrid,
  selectCharacterEquipment,
  setEquipment
} from 'src/features/character/equipment/characterEquipmentSlice';
import { useAppDispatch } from 'src/hooks/useAppDispatch';
import { useAppSelector } from 'src/hooks/useAppSelector';

interface CharacterEquipmentSelectProps {
  itemLocationHrid: PossibleCharacterEquipmentLocationHrid;
  possibleItems: ItemDetail[];
}

export function CharacterEquipmentSelect({
  itemLocationHrid,
  possibleItems
}: CharacterEquipmentSelectProps) {
  const equipment = useAppSelector(selectCharacterEquipment);
  const dispatch = useAppDispatch();

  const itemLocationName = clientData.itemLocationDetailMap[itemLocationHrid].name;
  const location = itemLocationHrid.split('/').at(-1);

  if (location == null) return <></>;
  return (
    <div className="flex-1">
      <span>{itemLocationName}</span>
      <Select
        name={`${itemLocationHrid}_select`}
        options={possibleItems.map((item) => ({ label: item.name, value: item }))}
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
}
