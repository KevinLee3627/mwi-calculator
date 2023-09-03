import { NonCombatActionTypeHrid } from 'src/core/actions/NonCombatActionTypeHrid';
import { NonCombatStats } from 'src/core/items/NonCombatStats';
import { selectCharacterEnhancement } from 'src/features/character/enhancements/characterEnhancementSlice';
import { selectCharacterEquipment } from 'src/features/character/equipment/characterEquipmentSlice';
import { computeEquipmentStats } from 'src/features/character/equipment/computeEquipmentStats';
import { computeDrinkStats } from 'src/features/skill/drinks/computeDrinkStats';
import { selectSkillDrinks } from 'src/features/skill/drinks/drinksSlice';
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
  const drinks = useAppSelector(selectSkillDrinks);

  const equipmentStats = computeEquipmentStats(equipment, enhancementLevels) as Record<
    keyof NonCombatStats,
    number
  >;
  const drinkStats = computeDrinkStats(drinks, actionTypeHrid);
  return (
    <div>
      <SkillStats actionTypeHrid={actionTypeHrid} />
      <SkillDrinksSelect actionTypeHrid={actionTypeHrid} />
      <SkillTable
        actionTypeHrid={actionTypeHrid}
        equipmentStats={equipmentStats}
        drinkStats={drinkStats}
      />
    </div>
  );
}
