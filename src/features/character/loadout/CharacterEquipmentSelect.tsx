import { GameIcon } from 'src/components/GameIcon';
import { Select } from 'src/components/Select';
import { clientData } from 'src/core/clientData';
import { ItemDetail } from 'src/core/items/ItemDetail';
import {
  clearEquip,
  PossibleCharacterEquipmentLocationHrid,
  setEquip
} from 'src/features/character/loadout/loadoutSlice';
import { useAppDispatch } from 'src/hooks/useAppDispatch';
import { useStats } from 'src/hooks/useStats';

interface CharacterEquipmentSelectProps {
  itemLocationHrid: PossibleCharacterEquipmentLocationHrid;
  possibleItems: ItemDetail[];
}

export function CharacterEquipmentSelect({
  itemLocationHrid,
  possibleItems
}: CharacterEquipmentSelectProps) {
  const { activeLoadout } = useStats();
  const dispatch = useAppDispatch();
  const itemLocationName = clientData.itemLocationDetailMap[itemLocationHrid].name;
  const location = itemLocationHrid.split('/').at(-1);
  const itemHridStripped = activeLoadout.equipment[itemLocationHrid]?.hrid.replace(
    '/items/',
    ''
  );

  if (location == null) return <></>;
  return (
    <div className="form-control">
      <label className="label">
        <span className="label-text">
          {itemHridStripped ? (
            <GameIcon svgSetName="items" iconName={itemHridStripped ?? ''} />
          ) : null}
          {itemLocationName}
        </span>
      </label>
      <Select
        name={`${itemLocationHrid}_select`}
        options={possibleItems.map((item) => ({ label: item.name, value: item }))}
        value={{
          label: activeLoadout.equipment[itemLocationHrid]?.name,
          value: activeLoadout.equipment[itemLocationHrid]
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
