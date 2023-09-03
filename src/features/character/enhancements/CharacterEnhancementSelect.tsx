import { Select } from 'src/components/Select';
import {
  selectCharacterEnhancement,
  setEnhancementLevel
} from 'src/features/character/enhancements/characterEnhancementSlice';
import { PossibleCharacterEquipmentLocationHrid } from 'src/features/character/equipment/characterEquipmentSlice';
import { useAppDispatch } from 'src/hooks/useAppDispatch';
import { useAppSelector } from 'src/hooks/useAppSelector';
import { range } from 'src/util/range';

interface CharacterEnhancementSelectProps {
  itemLocationHrid: PossibleCharacterEquipmentLocationHrid;
}

export function CharacterEnhancementSelect({
  itemLocationHrid
}: CharacterEnhancementSelectProps) {
  const enhancement = useAppSelector(selectCharacterEnhancement);
  const dispatch = useAppDispatch();
  return (
    <Select
      name={`${itemLocationHrid}_select_enhancement`}
      options={range(1, 20).map((val) => ({
        label: `+${val.toString()}`,
        value: val
      }))}
      defaultValue={{
        label: `+${enhancement[itemLocationHrid]}`,
        value: enhancement[itemLocationHrid]
      }}
      onChange={(selected) => {
        if (selected?.value == null) return;

        dispatch(
          setEnhancementLevel({
            enhancementLevel: selected.value,
            locationHrid: itemLocationHrid
          })
        );
      }}
    />
  );
}
