import { useEffect, useMemo, useState } from 'react';
import { Select } from 'src/components/Select';
import { NonCombatActionTypeHrid } from 'src/core/actions/NonCombatActionTypeHrid';
import { clientData } from 'src/core/clientData';
import { ActionCategoryHrid } from 'src/core/hrid/ActionCategoryHrid';
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

  const validActions = useMemo(
    () =>
      Object.values(clientData.actionDetailMap).filter(
        (value) => value.type === actionTypeHrid
      ),
    [actionTypeHrid]
  );
  const actionCategoryHrids = useMemo(() => {
    return Array.from(new Set(validActions.map((val) => val.category)));
  }, [validActions]);

  const [actionCategoryHrid, setActionCategoryHrid] = useState<ActionCategoryHrid>();
  const tableData = useMemo(() => {
    console.log(actionCategoryHrid);
    if (actionCategoryHrid == null) return validActions;
    else return validActions.filter((val) => val.category === actionCategoryHrid);
  }, [validActions, actionCategoryHrid]);

  useEffect(() => {
    // Resets the category dropdown when switching skills
    setActionCategoryHrid(undefined);
  }, [actionTypeHrid]);

  return (
    <div>
      <div className="flex max-w-fit flex-col items-start sm:max-w-full sm:flex-row sm:items-end">
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
        <div className="ml-4">
          <label className="label">
            <span className="label-text">Category</span>
          </label>
          <Select
            value={{
              label: actionCategoryHrid
                ? clientData.actionCategoryDetailMap[actionCategoryHrid].name
                : '',
              value: actionCategoryHrid
            }}
            options={actionCategoryHrids.map((category) => ({
              label: clientData.actionCategoryDetailMap[category].name,
              value: category
            }))}
            onChange={(selected) => {
              setActionCategoryHrid(selected?.value);
            }}
            isClearable
          />
        </div>
      </div>
      <SkillTable
        actionTypeHrid={actionTypeHrid}
        actionFunctionHrid={actionFunctionHrid}
        equipmentStats={equipmentStats}
        drinkStats={drinkStats}
        characterLevels={levels}
        data={tableData}
      />
    </div>
  );
}
