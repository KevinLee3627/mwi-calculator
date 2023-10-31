import { Select } from 'src/old/components/Select';
import {
  PossibleCharacterEquipmentLocationHrid,
  selectActiveLoadout,
  setEnhancementLevel
} from 'src/old/features/character/loadouts/loadoutSlice';
import { useAppDispatch } from 'src/old/hooks/useAppDispatch';
import { useAppSelector } from 'src/old/hooks/useAppSelector';
import { range } from 'src/old/util/range';

interface CharacterEnhancementSelectProps {
  itemLocationHrid: PossibleCharacterEquipmentLocationHrid;
}

export function CharacterEnhancementSelect({
  itemLocationHrid
}: CharacterEnhancementSelectProps) {
  const loadout = useAppSelector(selectActiveLoadout);
  const dispatch = useAppDispatch();
  return (
    <Select
      name={`${itemLocationHrid}_select_enhancement`}
      options={range(0, 20).map((val) => ({
        label: `+${val.toString()}`,
        value: val
      }))}
      value={{
        label: `+${loadout.enhancementLevels[itemLocationHrid]}`,
        value: loadout.enhancementLevels[itemLocationHrid]
      }}
      onChange={(selected) => {
        if (selected?.value == null) return;

        dispatch(
          setEnhancementLevel({
            level: selected.value,
            locationHrid: itemLocationHrid
          })
        );
      }}
    />
  );
}
