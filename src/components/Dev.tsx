import { selectCharacterLevels } from 'src/features/character/levels/characterLevelsSlice';
import { selectActiveLoadout } from 'src/features/character/loadout/loadoutSlice';
import { useAppSelector } from 'src/hooks/useAppSelector';

export function Dev() {
  const characterLevels = useAppSelector(selectCharacterLevels);
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

  const activeLoadout = useAppSelector(selectActiveLoadout);
  console.log(activeLoadout);
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
  return (
    <div className="flex">
      {levelsTable} {loadoutTable}
    </div>
  );
}
