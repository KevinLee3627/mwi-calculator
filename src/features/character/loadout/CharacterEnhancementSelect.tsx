import { Select } from 'src/components/Select';
import {
  PossibleCharacterEquipmentLocationHrid,
  setEnhancementLevel
} from 'src/features/character/loadout/loadoutSlice';
import { useAppDispatch } from 'src/hooks/useAppDispatch';
import { useStats } from 'src/hooks/useStats';
import { range } from 'src/util/range';

interface CharacterEnhancementSelectProps {
  itemLocationHrid: PossibleCharacterEquipmentLocationHrid;
}

export function CharacterEnhancementSelect({
  itemLocationHrid
}: CharacterEnhancementSelectProps) {
  const { activeLoadout } = useStats();
  const dispatch = useAppDispatch();
  return (
    <Select
      options={range(0, 20).map((val) => ({
        label: `+${val.toString()}`,
        value: val
      }))}
      value={{
        label: `+${activeLoadout.enhancementLevels[itemLocationHrid]}`,
        value: activeLoadout.enhancementLevels[itemLocationHrid]
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
