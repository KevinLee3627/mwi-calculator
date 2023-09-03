import { Header } from 'src/components/Header';
import { CharacterEquipment } from 'src/features/character/equipment/CharacterEquipment';
import { CharacterLevels } from 'src/features/character/levels/CharacterLevels';
import { SkillPage } from 'src/features/skill/SkillPage';

const App = () => {
  return (
    <>
      <Header />
      <CharacterLevels />
      <CharacterEquipment />
      <SkillPage />
    </>
  );
};

export default App;
