import { useMemo } from 'react';
import { GameIcon } from 'src/components/GameIcon';
import { clientData } from 'src/core/clientData';
import { CommunityBuffTypeHrid } from 'src/core/hrid/CommunityBuffTypeHrid';
import { HouseRoomHrid } from 'src/core/hrid/HouseRoomHrid';
import { CharacterLevelInput } from 'src/features/character/levels/CharacterLevelInput';
import { CharacterEnhancementSelect } from 'src/features/character/loadout/CharacterEnhancementSelect';
import { CharacterEquipmentSelect } from 'src/features/character/loadout/CharacterEquipmentSelect';
import { SkillDrinksSelect } from 'src/features/drinks/SkillDrinksSelect';
import { SkillTable } from 'src/features/SkillTable';
import { useStats } from 'src/hooks/useStats';
import { actionTypeToolLocationMapping } from 'src/util/actionTypeToolLocationMapping';
import { openModal } from 'src/util/openModal';
import { skillHridToActionTypeHrid } from 'src/util/skillHridToActionTypeHridMapping';

export function SkillPage() {
  const { communityBuffs, house, activeSkillState } = useStats();

  const actionTypeHrid = skillHridToActionTypeHrid[activeSkillState.activeSkill];

  const tableData = useMemo(
    () =>
      Object.values(clientData.actionDetailMap).filter(
        (value) => value.type === actionTypeHrid
      ),
    [actionTypeHrid]
  );

  if (actionTypeHrid === '/action_types/combat') return <div>Nope...</div>;
  // const actionFunctionHrid = actionTypeActionFunctionMapping[actionTypeHrid];

  return (
    <div>
      <div className="flex max-w-fit flex-col items-start sm:max-w-full sm:flex-row sm:items-end">
        <div className="ml-4 sm:ml-0">
          <CharacterLevelInput skillHrid={activeSkillState.activeSkill} />
        </div>
        <div className="ml-4">
          <SkillDrinksSelect skillHrid={activeSkillState.activeSkill} />
        </div>
        <div className="ml-4"></div>
        <div className="ml-4 flex items-end gap-2">
          <CharacterEquipmentSelect
            itemLocationHrid={actionTypeToolLocationMapping[actionTypeHrid]}
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

        <div
          className="form-control ml-4 hover:cursor-pointer"
          onClick={() => openModal('houseModal')}
        >
          <label className="label">
            <span className="label-text">House</span>
          </label>
          <div className="flex h-12 rounded border border-primary">
            {Object.entries(house).map((entry) => {
              const roomHrid = entry[0] as HouseRoomHrid;
              const roomLevel = entry[1];
              const roomDetail = clientData.houseRoomDetailMap[roomHrid];
              if (roomDetail.skillHrid !== activeSkillState.activeSkill) return null;

              return (
                <div key={roomDetail.hrid} className="grid h-12 w-12 place-items-center">
                  <GameIcon
                    svgSetName="skills"
                    iconName={roomDetail.skillHrid.split('/').at(-1) ?? ''}
                  />
                  <p>{roomLevel}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div>
        <SkillTable data={tableData} actionTypeHrid={actionTypeHrid} />
      </div>
      {/* <SkillTable
        actionTypeHrid={actionTypeHrid}
        actionFunctionHrid={actionFunctionHrid}
        equipmentStats={equipmentStats}
        drinkStats={drinkStats}
        characterLevels={levels}
        data={tableData}
      /> */}
    </div>
  );
}
