import { Header } from 'src/components/Header';
import { CharacterEquipment } from 'src/features/character/equipment/CharacterEquipment';
import { CharacterLevels } from 'src/features/character/levels/CharacterLevels';
import { SkillTable } from 'src/features/skill/SkillTable';

const App = () => {
  return (
    <>
      <Header />
      <CharacterLevels />
      <CharacterEquipment />
      <SkillTable />
    </>
  );
};

export default App;
