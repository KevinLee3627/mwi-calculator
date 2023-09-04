import { Bars3Icon } from '@heroicons/react/24/solid';
import { Sidebar } from 'src/components/Sidebar';
import { CharacterEquipment } from 'src/features/character/equipment/CharacterEquipment';
import { CharacterLevels } from 'src/features/character/levels/CharacterLevels';
import { SkillPage } from 'src/features/skill/SkillPage';

const App = () => {
  return (
    <>
      <div className="drawer lg:drawer-open">
        <input type="checkbox" id="drawer-sidebar" className="drawer-toggle" />
        <div className="drawer-content flex flex-col items-center justify-center">
          <nav className="navbar w-full">
            <div className="flex flex-1 lg:hidden">
              <span
                className="tooltip tooltip-bottom sticky top-0 before:text-xs before:content-[attr(data-tip)]"
                data-tip="Menu"
              >
                <label className="btn-ghost btn-square btn" htmlFor="drawer-sidebar">
                  <Bars3Icon className="h-6 w-6" />
                </label>
              </span>
              <div className="flex place-items-center gap-2">
                <span className="font-extrabold">mwi-calculator</span>
              </div>
            </div>
          </nav>
          <div className="flex-1">
            <SkillPage actionTypeHrid="/action_types/cheesesmithing" />
            {/* <div>ls</div> */}
          </div>
        </div>
        <Sidebar />

        <CharacterLevels />
        <CharacterEquipment />
      </div>
    </>
  );
};

export default App;
