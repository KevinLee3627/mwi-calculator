import { useMemo } from 'react';
import { GameIcon } from 'src/old/components/GameIcon';
import { NonCombatActionTypeHrid } from 'src/old/core/actions/NonCombatActionTypeHrid';
import { clientData } from 'src/old/core/clientData';
import { CommunityBuffTypeHrid } from 'src/old/core/hrid/CommunityBuffTypeHrid';
import { NonCombatStats } from 'src/old/core/items/NonCombatStats';
import { CharacterEnhancementSelect } from 'src/old/features/character/enhancements/CharacterEnhancementSelect';
import { CharacterEquipmentSelect } from 'src/old/features/character/equipment/CharacterEquipmentSelect';
import { computeEquipmentStats } from 'src/old/features/character/equipment/computeEquipmentStats';
import { CharacterLevelInput } from 'src/old/features/character/levels/CharacterLevelInput';
import { selectCharacterLevel } from 'src/old/features/character/levels/characterLevelSlice';
import { selectActiveLoadout } from 'src/old/features/character/loadouts/loadoutSlice';
import { selectCommunityBuffState } from 'src/old/features/communityBuff/communityBuffSlice';
import { itemLocationToItemMap } from 'src/old/features/itemLocationToItemMap';
import {
  actionTypeActionFunctionMapping,
  actionTypeToolLocationMapping
} from 'src/old/features/skill/actionTypeStatMapping';
import { computeDrinkStats } from 'src/old/features/skill/drinks/computeDrinkStats';
import { selectSkillDrinks } from 'src/old/features/skill/drinks/drinksSlice';
import { SkillDrinksSelect } from 'src/old/features/skill/drinks/SkillDrinksSelect';
import { SkillTable } from 'src/old/features/skill/SkillTable';
import { useAppSelector } from 'src/old/hooks/useAppSelector';
import { actionTypeToSkillHrid } from 'src/old/util/hridConverters';
import { openModal } from 'src/old/util/openModal';

interface SkillPageProps {
  actionTypeHrid: NonCombatActionTypeHrid;
}
export function SkillPage({ actionTypeHrid }: SkillPageProps) {
  const loadout = useAppSelector(selectActiveLoadout);
  const drinks = useAppSelector(selectSkillDrinks);
  const levels = useAppSelector(selectCharacterLevel);
  const communityBuffs = useAppSelector(selectCommunityBuffState);
  const equipmentStats = computeEquipmentStats(
    loadout.equipment,
    loadout.enhancementLevels
  ) as Record<keyof NonCombatStats, number>;
  const drinkStats = computeDrinkStats(drinks, actionTypeHrid);

  const actionFunctionHrid = actionTypeActionFunctionMapping[actionTypeHrid];

  const tableData = useMemo(
    () =>
      Object.values(clientData.actionDetailMap).filter(
        (value) => value.type === actionTypeHrid
      ),
    [actionTypeHrid]
  );

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
        <div
          className="form-control ml-4 hover:cursor-pointer"
          onClick={() => openModal('communityBuffsModal')}
        >
          <label className="label">
            <span className="label-text">Community Buffs</span>
          </label>
          <div className="flex h-12 rounded border border-primary">
            {Object.entries(communityBuffs).map((entry) => {
              const buffHrid = entry[0] as CommunityBuffTypeHrid;
              const buffLevel = entry[1];
              const buffDetail = clientData.communityBuffTypeDetailMap[buffHrid];
              return (
                <div key={buffDetail.hrid} className="grid h-12 w-12 place-items-center">
                  <GameIcon
                    svgSetName="buffs"
                    iconName={buffDetail.buff.typeHrid.split('/').at(-1) ?? ''}
                  />
                  <p>{buffLevel}</p>
                </div>
              );
            })}
          </div>
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
