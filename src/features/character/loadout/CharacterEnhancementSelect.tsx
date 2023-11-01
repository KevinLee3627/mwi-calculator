import { Select } from 'src/components/Select';
import {
  PossibleCharacterEquipmentLocationHrid,
  selectActiveLoadout,
  setEnhancementLevel
} from 'src/features/character/loadout/loadoutSlice';
import { useAppDispatch } from 'src/hooks/useAppDispatch';
import { useAppSelector } from 'src/hooks/useAppSelector';
import { range } from 'src/util/range';

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
