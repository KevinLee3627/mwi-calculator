import { selectCharacterEquipment } from 'src/features/character/equipment/characterEquipmentSlice';
import { SkillDrinksSelect } from 'src/features/skill/drinks/SkillDrinksSelect';
import { SkillTable } from 'src/features/skill/SkillTable';
import { useAppSelector } from 'src/hooks/useAppSelector';

export function SkillPage() {
  const equipment = useAppSelector(selectCharacterEquipment);

  console.log(equipment);

  return (
    <div>
      <div></div>
      <SkillDrinksSelect actionTypeHrid="/action_types/milking" />
      <SkillTable actionTypeHrid="/action_types/milking" />
    </div>
  );
}
