import { ItemIcon } from 'src/components/ItemIcon';
import { Select } from 'src/components/Select';
import { clientData } from 'src/core/clientData';
import { itemLocationToItemMap } from 'src/features/character/loadout/itemLocationToItemMap';
import {
  clearEquip,
  PossibleCharacterEquipmentLocationHrid,
  setEquip
} from 'src/features/character/loadout/loadoutSlice';
import { useAppDispatch } from 'src/hooks/useAppDispatch';
import { useStats } from 'src/hooks/useStats';

interface CharacterEquipmentSelectProps {
  itemLocationHrid: PossibleCharacterEquipmentLocationHrid;
}

export function CharacterEquipmentSelect({
  itemLocationHrid
}: CharacterEquipmentSelectProps) {
  const { activeLoadout } = useStats();
  const dispatch = useAppDispatch();
  const possibleItems = itemLocationToItemMap[itemLocationHrid];
  const itemLocationName = clientData.itemLocationDetailMap[itemLocationHrid].name;
  const location = itemLocationHrid.split('/').at(-1);
  const item = activeLoadout.equipment[itemLocationHrid];

  if (location == null) return <></>;
  return (
    <div className="form-control">
      <label className="label">
        <span className="label-text">
          {item ? <ItemIcon itemHrid={item.hrid} /> : null}
          {itemLocationName}
        </span>
      </label>
      <Select
        name={`${itemLocationHrid}_select`}
        options={possibleItems.map((item) => ({ label: item.name, value: item }))}
        value={{
          label: item?.name,
          value: item
        }}
        placeholder="test"
        onChange={(selected) => {
          if (selected?.value == null) {
            dispatch(clearEquip({ locationHrid: itemLocationHrid }));
          } else {
            dispatch(
              setEquip({
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
