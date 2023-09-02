import { clientData } from 'src/core/clientData';
import { SkillHrid } from 'src/core/hrid/SkillHrid';
import {
  characterLevelSlice,
  selectCharacterLevel
} from 'src/features/character/characterLevelSlice';
import { useAppDispatch } from 'src/hooks/useAppDispatch';
import { useAppSelector } from 'src/hooks/useAppSelector';

export function CharacterLevels() {
  const levels = useAppSelector(selectCharacterLevel);
  const dispatch = useAppDispatch();

  const inputs = Object.entries(levels).map((entry) => {
    const skillHrid = entry[0] as SkillHrid;
    const skillName = clientData.skillDetailMap[skillHrid].name;

    return (
      <tr key={`${skillHrid}_level`}>
        <td>{skillName}</td>
        <td>
          <input
            type="text"
            id={`${skillHrid}_input`}
            name={`${skillHrid}_input`}
            className="input-primary input"
            defaultValue={levels[skillHrid]}
            onChange={(e) => {
              dispatch(
                characterLevelSlice.actions.setLevel({
                  skillHrid,
                  value: parseInt(e.target.value, 10)
                })
              );
            }}
          />
        </td>
      </tr>
    );
  });
  return (
    <table>
      <tbody>{inputs}</tbody>
    </table>
  );
}
