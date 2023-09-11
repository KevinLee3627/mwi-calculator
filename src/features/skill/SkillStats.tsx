import { NonCombatActionTypeHrid } from 'src/core/actions/NonCombatActionTypeHrid';
import { NonCombatStats } from 'src/core/items/NonCombatStats';
import { computeEquipmentStats } from 'src/features/character/equipment/computeEquipmentStats';
import { selectActiveLoadout } from 'src/features/character/loadouts/loadoutSlice';
import { actionTypeStatMapping } from 'src/features/skill/actionTypeStatMapping';
import { computeDrinkStats } from 'src/features/skill/drinks/computeDrinkStats';
import { selectSkillDrinks } from 'src/features/skill/drinks/drinksSlice';
import { useAppSelector } from 'src/hooks/useAppSelector';

interface SkillStatsProps {
  actionTypeHrid: NonCombatActionTypeHrid;
}

export function SkillStats({ actionTypeHrid }: SkillStatsProps) {
  // Get relevant stats for a given skill
  const loadout = useAppSelector(selectActiveLoadout);
  const drinksState = useAppSelector(selectSkillDrinks);

  const equipmentStats = computeEquipmentStats(
    loadout.equipment,
    loadout.enhancementLevels
  );
  const visibleEquipmentStats = Object.entries(equipmentStats)
    .filter(
      ([statName, statValue]) =>
        statValue !== 0 &&
        actionTypeStatMapping[actionTypeHrid][statName as keyof NonCombatStats] != null
    )
    .map(([statName, statValue]) => (
      <p key={statName}>
        {statName}: {statValue * 100}
      </p>
    ));

  const x = computeDrinkStats(drinksState, actionTypeHrid);
  const visibleDrinkStats = Object.entries(x ?? {}).map(([buffTypeHrid, buffValue]) => (
    <p key={buffTypeHrid}>
      {buffTypeHrid}: {buffValue}
    </p>
  ));

  return (
    <div>
      {visibleEquipmentStats}
      {visibleDrinkStats}
    </div>
  );
}
