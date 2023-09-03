import { NonCombatActionTypeHrid } from 'src/core/actions/NonCombatActionTypeHrid';
import { computeEquipmentStats } from 'src/features/character/equipment/computeEquipmentStats';
import { selectCharacterEnhancement } from 'src/features/character/enhancements/characterEnhancementSlice';
import { selectCharacterEquipment } from 'src/features/character/equipment/characterEquipmentSlice';
import { SkillDrinksSelect } from 'src/features/skill/drinks/SkillDrinksSelect';
import { SkillStats } from 'src/features/skill/SkillStats';
import { SkillTable } from 'src/features/skill/SkillTable';
import { useAppSelector } from 'src/hooks/useAppSelector';

interface SkillPageProps {
  actionTypeHrid: NonCombatActionTypeHrid;
}
export function SkillPage({ actionTypeHrid }: SkillPageProps) {
  const equipment = useAppSelector(selectCharacterEquipment);
  const enhancementLevels = useAppSelector(selectCharacterEnhancement);
  return (
    <div>
      <SkillStats actionTypeHrid={actionTypeHrid} />
      <SkillDrinksSelect actionTypeHrid={actionTypeHrid} />
      <SkillTable actionTypeHrid={actionTypeHrid} />
    </div>
  );
}
