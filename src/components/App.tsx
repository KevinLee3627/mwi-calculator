import { Header } from 'src/components/Header';
import { CharacterEquipment } from 'src/features/character/equipment/CharacterEquipment';
import { CharacterLevels } from 'src/features/character/levels/CharacterLevels';

const App = () => {
  return (
    <>
      <Header />
      {/* <CharacterLevels /> */}
      <CharacterEquipment />
    </>
  );
};

export default App;
