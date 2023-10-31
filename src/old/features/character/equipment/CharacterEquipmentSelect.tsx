import { GameIcon } from 'src/old/components/GameIcon';
import { Select } from 'src/old/components/Select';
import { clientData } from 'src/old/core/clientData';
import { ItemDetail } from 'src/old/core/items/ItemDetail';
import {
  clearEquip,
  PossibleCharacterEquipmentLocationHrid,
  selectActiveLoadout,
  setEquip
} from 'src/old/features/character/loadouts/loadoutSlice';
import { useAppDispatch } from 'src/old/hooks/useAppDispatch';
import { useAppSelector } from 'src/old/hooks/useAppSelector';

interface CharacterEquipmentSelectProps {
  itemLocationHrid: PossibleCharacterEquipmentLocationHrid;
  possibleItems: ItemDetail[];
}

export function CharacterEquipmentSelect({
  itemLocationHrid,
  possibleItems
}: CharacterEquipmentSelectProps) {
  const loadout = useAppSelector(selectActiveLoadout);
  const dispatch = useAppDispatch();
  const itemLocationName = clientData.itemLocationDetailMap[itemLocationHrid].name;
  const location = itemLocationHrid.split('/').at(-1);
  const itemHridStripped = loadout.equipment[itemLocationHrid]?.hrid.replace(
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
          label: loadout.equipment[itemLocationHrid]?.name,
          value: loadout.equipment[itemLocationHrid]
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
