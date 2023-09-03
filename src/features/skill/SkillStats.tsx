import { NonCombatActionTypeHrid } from 'src/core/actions/NonCombatActionTypeHrid';
import { NonCombatStats } from 'src/core/items/NonCombatStats';
import { selectCharacterEnhancement } from 'src/features/character/enhancements/characterEnhancementSlice';
import { selectCharacterEquipment } from 'src/features/character/equipment/characterEquipmentSlice';
import { computeEquipmentStats } from 'src/features/character/equipment/computeEquipmentStats';
import { actionTypeStatMapping } from 'src/features/skill/actionTypeStatMapping';
import { computeDrinkStats } from 'src/features/skill/drinks/computeDrinkStats';
import { selectSkillDrinks } from 'src/features/skill/drinks/drinksSlice';
import { useAppSelector } from 'src/hooks/useAppSelector';

interface SkillStatsProps {
  actionTypeHrid: NonCombatActionTypeHrid;
}

export function SkillStats({ actionTypeHrid }: SkillStatsProps) {
  // Get relevant stats for a given skill
  const equipment = useAppSelector(selectCharacterEquipment);
  const enhancementLevels = useAppSelector(selectCharacterEnhancement);
  const drinksState = useAppSelector(selectSkillDrinks);

  const equipmentStats = computeEquipmentStats(equipment, enhancementLevels);

  const visibleEquipmentStats = Object.entries(equipmentStats)
    .filter(
      ([statName, statValue]) =>
        statValue !== 0 &&
        actionTypeStatMapping[actionTypeHrid].includes(statName as keyof NonCombatStats)
    )
    .map(([statName, statValue]) => (
      <p key={statName}>
        {statName}: {statValue * 100}
      </p>
    ));

  const x = computeDrinkStats(drinksState, actionTypeHrid);
  console.log(x);

  return <div>{visibleEquipmentStats}</div>;
}
