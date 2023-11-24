import { Bars3Icon } from '@heroicons/react/24/solid';
import { Sidebar } from 'src/components/Sidebar';
import { CharacterLevels } from 'src/features/character/levels/CharacterLevels';
import { CharacterEquipment } from 'src/features/character/loadout/CharacterEquipment';
import { CommunityBuffs } from 'src/features/communityBuff/CommunityBuffs';
import { UserHouseModal } from 'src/features/house/UserHouseModal';
import { ActionQueue } from 'src/features/queue/ActionQueue';
import { SkillPage } from 'src/features/SkillPage';

const App = () => {
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
                <span className="font-extrabold">cowculator</span>
              </div>
            </div>
          </nav>
          <div className="flex-1">
            {/* <Dev /> */}
            <SkillPage />
          </div>
        </div>
        <Sidebar />
        <CharacterEquipment />
        <CharacterLevels />
        <CommunityBuffs />
        <UserHouseModal />
        <ActionQueue />
      </div>
    </>
  );
};

export default App;
