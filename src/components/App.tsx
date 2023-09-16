import { Bars3Icon } from '@heroicons/react/24/solid';
import { Sidebar } from 'src/components/Sidebar';
import { NonCombatSkillHrid } from 'src/core/skills/NonCombatSkillHrid';
import { CharacterEquipment } from 'src/features/character/equipment/CharacterEquipment';
import { CharacterLevels } from 'src/features/character/levels/CharacterLevels';
import { CommunityBuffs } from 'src/features/communityBuff/CommunityBuffs';
import { selectActiveSkillState } from 'src/features/navigation/activeSkillSlice';
import { ActionQueue } from 'src/features/queue/ActionQueue';
import { EnhancePage } from 'src/features/skill/EnhancePage';
import { SkillPage } from 'src/features/skill/SkillPage';
import { useAppSelector } from 'src/hooks/useAppSelector';
import { skillHridToActionType } from 'src/util/hridConverters';

const App = () => {
  const activeSkillState = useAppSelector(selectActiveSkillState);
  const activeSkill = (Object.keys(activeSkillState).find(
    (key) => activeSkillState[key as NonCombatSkillHrid]
  ) ?? '/skills/milking') as NonCombatSkillHrid;

  const activePage =
    activeSkill === '/skills/enhancing' ? (
      <EnhancePage />
    ) : (
      <SkillPage actionTypeHrid={skillHridToActionType(activeSkill)} />
    );
  return (
    <>
      <div className="drawer lg:drawer-open">
        <input type="checkbox" id="drawer-sidebar" className="drawer-toggle" />
        <div className="drawer-content flex flex-col items-center justify-center">
          <nav className="navbar w-full lg:hidden">
            <div className="flex flex-1 ">
              <span
                className="tooltip tooltip-bottom sticky top-0 before:text-xs before:content-[attr(data-tip)]"
                data-tip="Menu"
              >
                <label className="btn-ghost btn-square btn" htmlFor="drawer-sidebar">
                  <Bars3Icon className="h-8 w-8" />
                </label>
              </span>
              <div className="flex place-items-center gap-2">
                <span className="font-extrabold">mwi-calculator</span>
              </div>
            </div>
          </nav>
          <div className="flex-1">{activePage}</div>
        </div>
        <Sidebar />

        <CharacterEquipment />
        <CharacterLevels />
        <CommunityBuffs />
        <ActionQueue />
      </div>
    </>
  );
};

export default App;
