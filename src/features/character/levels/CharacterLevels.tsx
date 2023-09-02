import { clientData } from 'src/core/clientData';
import { NonCombatSkillHrid } from 'src/core/skills/NonCombatSkillHrid';
import {
  selectCharacterLevel,
  setLevel
} from 'src/features/character/levels/characterLevelSlice';
import { useAppDispatch } from 'src/hooks/useAppDispatch';
import { useAppSelector } from 'src/hooks/useAppSelector';

export function CharacterLevels() {
  const levels = useAppSelector(selectCharacterLevel);
  const dispatch = useAppDispatch();

  const inputs = Object.entries(levels).map((entry) => {
    const skillHrid = entry[0] as NonCombatSkillHrid;
    const skillName = clientData.skillDetailMap[skillHrid].name;

    return (
      <div className="form-control" key={`${skillHrid}_key`}>
        <label className="label">
          <span className="label-text">{skillName}</span>
        </label>
        <input
          type="number"
          min={0}
          max={200}
          id={`${skillHrid}_level_input`}
          name={`${skillHrid}_level_input`}
          className="input-primary input"
          value={levels[skillHrid]}
          onChange={(e) => {
            const value = parseInt(e.target.value, 10);
            dispatch(setLevel({ skillHrid, value }));
          }}
        />
      </div>
    );
  });
  return (
    <dialog id="characterLevelModal" className="modal modal-bottom sm:modal-middle">
      <form method="dialog" className="modal-box sm:min-w-max">
        {inputs}
      </form>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
}
