import { NonCombatActionTypeHrid } from 'src/core/actions/NonCombatActionTypeHrid';
import { clientData } from 'src/core/clientData';
import { NonCombatStats } from 'src/core/items/NonCombatStats';
import { selectCharacterEnhancement } from 'src/features/character/enhancements/characterEnhancementSlice';
import { CharacterEquipmentSelect } from 'src/features/character/equipment/CharacterEquipmentSelect';
import { selectCharacterEquipment } from 'src/features/character/equipment/characterEquipmentSlice';
import { computeEquipmentStats } from 'src/features/character/equipment/computeEquipmentStats';
import { CharacterLevelInput } from 'src/features/character/levels/CharacterLevelInput';
import { selectCharacterLevel } from 'src/features/character/levels/characterLevelSlice';
import { itemLocationToItemMap } from 'src/features/itemLocationToItemMap';
import { actionTypeToolLocationMapping } from 'src/features/skill/actionTypeStatMapping';
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
  return (
    <div className="mx-auto w-11/12">
      {/* <SkillStats actionTypeHrid={actionTypeHrid} /> */}
      <div className="flex items-end">
        <div>
          <CharacterLevelInput skillHrid={actionTypeToSkillHrid(actionTypeHrid)} />
        </div>
        <div className="ml-4">
          <SkillDrinksSelect actionTypeHrid={actionTypeHrid} />
        </div>
        <div className="ml-4">
          <CharacterEquipmentSelect
            itemLocationHrid={actionTypeToolLocationMapping[actionTypeHrid]}
            possibleItems={
              itemLocationToItemMap[actionTypeToolLocationMapping[actionTypeHrid]]
            }
          />
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
