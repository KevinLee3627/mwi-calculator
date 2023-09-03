import { NonCombatActionTypeHrid } from 'src/core/actions/NonCombatActionTypeHrid';
import { NonCombatStats } from 'src/core/items/NonCombatStats';
import { selectCharacterEnhancement } from 'src/features/character/enhancements/characterEnhancementSlice';
import { selectCharacterEquipment } from 'src/features/character/equipment/characterEquipmentSlice';
import { computeEquipmentStats } from 'src/features/character/equipment/computeEquipmentStats';
import { CharacterLevelInput } from 'src/features/character/levels/CharacterLevelInput';
import { selectCharacterLevel } from 'src/features/character/levels/characterLevelSlice';
import { computeDrinkStats } from 'src/features/skill/drinks/computeDrinkStats';
import { selectSkillDrinks } from 'src/features/skill/drinks/drinksSlice';
import { SkillDrinksSelect } from 'src/features/skill/drinks/SkillDrinksSelect';
import { SkillStats } from 'src/features/skill/SkillStats';
import { SkillTable } from 'src/features/skill/SkillTable';
import { useAppSelector } from 'src/hooks/useAppSelector';
import { actionTypeToSkill } from 'src/util/actionTypeToSkill';

interface SkillPageProps {
  actionTypeHrid: NonCombatActionTypeHrid;
}
export function SkillPage({ actionTypeHrid }: SkillPageProps) {
  const equipment = useAppSelector(selectCharacterEquipment);
  const enhancementLevels = useAppSelector(selectCharacterEnhancement);
  const drinks = useAppSelector(selectSkillDrinks);
  const levels = useAppSelector(selectCharacterLevel);
  const equipmentStats = computeEquipmentStats(equipment, enhancementLevels) as Record<
    keyof NonCombatStats,
    number
  >;
  const drinkStats = computeDrinkStats(drinks, actionTypeHrid);
  return (
    <div className="mx-auto w-11/12">
      {/* <SkillStats actionTypeHrid={actionTypeHrid} /> */}
      <div className="flex items-end">
        <div className="inline-block">
          <CharacterLevelInput skillHrid={actionTypeToSkill(actionTypeHrid)} />
        </div>
        <div className="ml-4 inline-block">
          <SkillDrinksSelect actionTypeHrid={actionTypeHrid} />
        </div>
      </div>
      <SkillTable
        actionTypeHrid={actionTypeHrid}
        equipmentStats={equipmentStats}
        drinkStats={drinkStats}
        characterLevels={levels}
      />
    </div>
  );
}
