import clientData from 'core/clientData.json';
import DataGrid from 'react-data-grid';

const columns = [
  { key: 'level', name: 'Level' },
  { key: 'xp', name: 'XP' }
];

const rows = clientData.levelExperienceTable.map((xp, i) => ({ level: i, xp }));

const App = () => {
  return (
    <>
      <div className="flex justify-center bg-gray-300">Hello, world</div>
      <DataGrid columns={columns} rows={rows} />
    </>
  );
};

export default App;
