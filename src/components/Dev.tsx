import { useStats } from 'src/hooks/useStats';

export function Dev() {
  const { characterLevels, activeLoadout, communityBuffs } = useStats();
  const levelsTable = (
    <table className="table">
      <thead>
        <tr>
          <th>skill</th>
          <th>level</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(characterLevels).map((entry) => {
          const [key, val] = entry;
          return (
            <tr key={key}>
              <td>{key}</td>
              <td>{val}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );

  const loadoutTable = (
    <table className="table">
      <thead>
        <tr>
          <th>location</th>
          <th>level</th>
          <th>enhance</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(activeLoadout.equipment).map((entry) => {
          const [key, val] = entry;
          return (
            <tr key={key}>
              <td>{key}</td>
              <td>{val?.hrid ?? 'null'}</td>
              <td>{(activeLoadout.enhancementLevels as Record<string, number>)[key]}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );

  const communityBuffTable = (
    <table className="table">
      <thead>
        <tr>
          <th>location</th>
          <th>level</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(communityBuffs).map((entry) => {
          const [key, val] = entry;
          return (
            <tr key={key}>
              <td>{key}</td>
              <td>{val}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
  return (
    <div className="flex">
      {levelsTable} {loadoutTable} {communityBuffTable}
    </div>
  );
}
