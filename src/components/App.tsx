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
          <div className="flex-1">
            <SkillPage actionTypeHrid="/action_types/cheesesmithing" />
            {/* <div>ls</div> */}
          </div>
          <label
            htmlFor="drawer-sidebar"
            className="btn-primary drawer-button btn lg:hidden"
          >
            OPEN DRAWER!!!
          </label>
        </div>
        <Sidebar />
        {/* <div className="sticky top-16 z-50 overflow-y-auto sm:h-screen sm:w-2/12">
      </div> */}
        <CharacterLevels />
        <CharacterEquipment />
      </div>
    </>
  );
};

export default App;
