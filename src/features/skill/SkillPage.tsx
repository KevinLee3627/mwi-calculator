import { NonCombatActionTypeHrid } from 'src/core/actions/NonCombatActionTypeHrid';
import { NonCombatStats } from 'src/core/items/NonCombatStats';
import { CharacterEnhancementSelect } from 'src/features/character/enhancements/CharacterEnhancementSelect';
import { selectCharacterEnhancement } from 'src/features/character/enhancements/characterEnhancementSlice';
import { CharacterEquipmentSelect } from 'src/features/character/equipment/CharacterEquipmentSelect';
import { selectCharacterEquipment } from 'src/features/character/equipment/characterEquipmentSlice';
import { computeEquipmentStats } from 'src/features/character/equipment/computeEquipmentStats';
import { CharacterLevelInput } from 'src/features/character/levels/CharacterLevelInput';
import { selectCharacterLevel } from 'src/features/character/levels/characterLevelSlice';
import { itemLocationToItemMap } from 'src/features/itemLocationToItemMap';
import {
  actionTypeActionFunctionMapping,
  actionTypeToolLocationMapping
} from 'src/features/skill/actionTypeStatMapping';
import { computeDrinkStats } from 'src/features/skill/drinks/computeDrinkStats';
import { selectSkillDrinks } from 'src/features/skill/drinks/drinksSlice';
import { SkillDrinksSelect } from 'src/features/skill/drinks/SkillDrinksSelect';
import { SkillStats } from 'src/features/skill/SkillStats';
import { SkillTable } from 'src/features/skill/SkillTable';
import { useAppSelector } from 'src/hooks/useAppSelector';
import { actionTypeToSkillHrid } from 'src/util/hridConverters';

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

  const actionFunctionHrid = actionTypeActionFunctionMapping[actionTypeHrid];
  return (
    <div>
      {/* <SkillStats actionTypeHrid={actionTypeHrid} /> */}
      <div className="flex max-w-fit flex-col items-start sm:flex-row sm:items-end">
        <div className="ml-4 sm:ml-0">
          <CharacterLevelInput skillHrid={actionTypeToSkillHrid(actionTypeHrid)} />
        </div>
        <div className="ml-4">
          <SkillDrinksSelect actionTypeHrid={actionTypeHrid} />
        </div>
        <div className="ml-4 flex items-end gap-2">
          <CharacterEquipmentSelect
            itemLocationHrid={actionTypeToolLocationMapping[actionTypeHrid]}
            possibleItems={
              itemLocationToItemMap[actionTypeToolLocationMapping[actionTypeHrid]]
            }
          />
          <CharacterEnhancementSelect
            itemLocationHrid={actionTypeToolLocationMapping[actionTypeHrid]}
          />
        </div>
      </div>
      <SkillTable
        actionTypeHrid={actionTypeHrid}
        actionFunctionHrid={actionFunctionHrid}
        equipmentStats={equipmentStats}
        drinkStats={drinkStats}
        characterLevels={levels}
      />
    </div>
  );
}
