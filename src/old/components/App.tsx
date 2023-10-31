import { Bars3Icon } from '@heroicons/react/24/solid';
import { Sidebar } from 'src/old/components/Sidebar';
import { NonCombatSkillHrid } from 'src/old/core/skills/NonCombatSkillHrid';
import { CharacterEquipment } from 'src/old/features/character/equipment/CharacterEquipment';
import { CharacterLevels } from 'src/old/features/character/levels/CharacterLevels';
import { CommunityBuffs } from 'src/old/features/communityBuff/CommunityBuffs';
import { selectActiveSkillState } from 'src/old/features/navigation/activeSkillSlice';
import { ActionQueue } from 'src/old/features/queue/ActionQueue';
import { EnhancePage } from 'src/old/features/skill/EnhancePage';
import { SkillPage } from 'src/old/features/skill/SkillPage';
import { useAppSelector } from 'src/old/hooks/useAppSelector';
import { skillHridToActionType } from 'src/old/util/hridConverters';

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
