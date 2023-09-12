import { useMemo, useState } from 'react';
import { GameIcon } from 'src/components/GameIcon';
import { Select } from 'src/components/Select';
import { clientData } from 'src/core/clientData';
import { ActionTypeHrid } from 'src/core/hrid/ActionTypeHrid';
import { CommunityBuffTypeHrid } from 'src/core/hrid/CommunityBuffTypeHrid';
import { ItemDetail } from 'src/core/items/ItemDetail';
import { NonCombatStats } from 'src/core/items/NonCombatStats';
import { CharacterEnhancementSelect } from 'src/features/character/enhancements/CharacterEnhancementSelect';
import { CharacterEquipmentSelect } from 'src/features/character/equipment/CharacterEquipmentSelect';
import { computeEquipmentStats } from 'src/features/character/equipment/computeEquipmentStats';
import { CharacterLevelInput } from 'src/features/character/levels/CharacterLevelInput';
import { selectCharacterLevel } from 'src/features/character/levels/characterLevelSlice';
import { selectActiveLoadout } from 'src/features/character/loadouts/loadoutSlice';
import { selectCommunityBuffState } from 'src/features/communityBuff/communityBuffSlice';
import { itemLocationToItemMap } from 'src/features/itemLocationToItemMap';
import { actionTypeToolLocationMapping } from 'src/features/skill/actionTypeStatMapping';
import { computeDrinkStats } from 'src/features/skill/drinks/computeDrinkStats';
import { selectSkillDrinks } from 'src/features/skill/drinks/drinksSlice';
import { SkillDrinksSelect } from 'src/features/skill/drinks/SkillDrinksSelect';
import { EnhancingTable } from 'src/features/skill/EnhancingTable';
import { useAppSelector } from 'src/hooks/useAppSelector';
import { actionTypeToSkillHrid } from 'src/util/hridConverters';
import { openModal } from 'src/util/openModal';
import { range } from 'src/util/range';

export function EnhancePage() {
  const actionTypeHrid: ActionTypeHrid = '/action_types/enhancing';
  const loadout = useAppSelector(selectActiveLoadout);
  const drinks = useAppSelector(selectSkillDrinks);
  const levels = useAppSelector(selectCharacterLevel);
  const communityBuffs = useAppSelector(selectCommunityBuffState);
  const equipmentStats = computeEquipmentStats(
    loadout.equipment,
    loadout.enhancementLevels
  ) as Record<keyof NonCombatStats, number>;
  const drinkStats = computeDrinkStats(drinks, actionTypeHrid);

  const enhanceItemChoices = useMemo(
    () =>
      Object.values(clientData.itemDetailMap)
        .filter((item) => item.enhancementCosts != null)
        .map((item) => ({
          label: item.name,
          value: item
        })),
    []
  );

  const [chosenItem, setChosenItem] = useState<ItemDetail>(
    clientData.itemDetailMap['/items/holy_brush']
  );

  const [targetLevel, setTargetLevel] = useState<number>(1);

  return (
    <div>
      {/* TODO: This div is the same as in <SkillPage /> --- maybe extract out to component? */}
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
      <div className="flex gap-4">
        <div>
          <label className="label">
            <span className="label-text">Item to enhance</span>
          </label>
          <Select
            options={enhanceItemChoices}
            value={{ label: chosenItem?.name, value: chosenItem }}
            onChange={(selected) =>
              setChosenItem(
                selected?.value ?? clientData.itemDetailMap['/items/holy_brush']
              )
            }
          />
        </div>
        <div>
          <label className="label">
            <span className="label-text">Target Level</span>
          </label>
          <Select
            options={range(1, 20).map((val) => ({ label: val.toString(), value: val }))}
            value={{ label: targetLevel?.toString() ?? '', value: targetLevel }}
            onChange={(selected) => setTargetLevel(selected?.value ?? 1)}
          />
        </div>
      </div>
      <div className="mt-4">
        <EnhancingTable
          characterLevels={levels}
          drinkStats={drinkStats}
          equipmentStats={equipmentStats}
          itemToEnhance={chosenItem ?? clientData.itemDetailMap['/items/holy_brush']}
          targetLevel={targetLevel}
        />
      </div>
    </div>
  );
}
