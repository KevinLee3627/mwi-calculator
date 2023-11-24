import { useMemo } from 'react';
import { GameIcon } from 'src/components/GameIcon';
import { clientData } from 'src/core/clientData';
import { HouseRoomHrid } from 'src/core/hrid/HouseRoomHrid';
import { NonCombatSkillHrid } from 'src/core/skills/NonCombatSkillHrid';
import { CharacterLevelInput } from 'src/features/character/levels/CharacterLevelInput';
import { CharacterEnhancementSelect } from 'src/features/character/loadout/CharacterEnhancementSelect';
import { CharacterEquipmentSelect } from 'src/features/character/loadout/CharacterEquipmentSelect';
import { CommunityBuffsDisplay } from 'src/features/communityBuff/CommunityBuffsDisplay';
import { SkillDrinksSelect } from 'src/features/drinks/SkillDrinksSelect';
import { EnhancingTable } from 'src/features/EnhancingTable';
import { SkillTable } from 'src/features/SkillTable';
import { useStats } from 'src/hooks/useStats';
import { actionTypeToolLocationMapping } from 'src/util/actionTypeToolLocationMapping';
import { openModal } from 'src/util/openModal';
import { skillHridToActionTypeHrid } from 'src/util/skillHridToActionTypeHridMapping';

interface SkillPageProps {
  skillHrid: NonCombatSkillHrid;
}

export function SkillPage({ skillHrid }: SkillPageProps) {
  const { house } = useStats();

  const actionTypeHrid = skillHridToActionTypeHrid[skillHrid];

  const tableData = useMemo(
    () =>
      Object.values(clientData.actionDetailMap).filter(
        (value) => value.type === actionTypeHrid
      ),
    [actionTypeHrid]
  );

  if (actionTypeHrid === '/action_types/combat') return <div>Nope...</div>;

  return (
    <div>
      <div className="flex max-w-fit flex-col items-start sm:max-w-full sm:flex-row sm:items-end">
        <div className="ml-4 sm:ml-0">
          <CharacterLevelInput skillHrid={skillHrid} />
        </div>
        <div className="ml-4">
          <SkillDrinksSelect skillHrid={skillHrid} />
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

        <CommunityBuffsDisplay />

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
              if (roomDetail.skillHrid !== skillHrid) return null;

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
      {actionTypeHrid === '/action_types/enhancing' ? (
        <div>
          <EnhancingTable />
        </div>
      ) : (
        <div>
          <SkillTable data={tableData} skillHrid={skillHrid} />
        </div>
      )}
    </div>
  );
}
