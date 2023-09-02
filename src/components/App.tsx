import clientData from 'core/clientData.json';
import { CharacterLevels } from 'src/components/CharacterLevels';

const App = () => {
  return (
    <>
      <div className="flex justify-center bg-gray-300">Hello, world</div>
      <CharacterLevels />
    </>
  );
};

export default App;
