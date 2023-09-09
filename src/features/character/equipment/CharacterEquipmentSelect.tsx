import { GameIcon } from 'src/components/GameIcon';
import { Select } from 'src/components/Select';
import { clientData } from 'src/core/clientData';
import { ItemDetail } from 'src/core/items/ItemDetail';
import {
  clearEquip,
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
  const itemHridStripped = equipment[itemLocationHrid]?.hrid.replace('/items/', '');

  if (location == null) return <></>;
  return (
    <div className="form-control">
      <label className="label">
        <span className="label-text">
          <GameIcon svgSetName="items" iconName={itemHridStripped ?? ''} />
          {itemLocationName}
        </span>
      </label>
      <Select
        name={`${itemLocationHrid}_select`}
        options={possibleItems.map((item) => ({ label: item.name, value: item }))}
        value={{
          label: equipment[itemLocationHrid]?.name,
          value: equipment[itemLocationHrid]
        }}
        placeholder="test"
        onChange={(selected) => {
          if (selected?.value == null) {
            dispatch(clearEquip({ locationHrid: itemLocationHrid }));
          } else {
            dispatch(
              setEquipment({
                itemHrid: selected.value.hrid,
                locationHrid: itemLocationHrid
              })
            );
          }
        }}
        isClearable
      />
    </div>
  );
}
