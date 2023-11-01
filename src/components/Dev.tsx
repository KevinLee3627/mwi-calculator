import { selectCharacterLevels } from 'src/features/character/levels/characterLevelsSlice';
import { useAppSelector } from 'src/hooks/useAppSelector';

export function Dev() {
  const characterLevels = useAppSelector(selectCharacterLevels);

  return (
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
}
