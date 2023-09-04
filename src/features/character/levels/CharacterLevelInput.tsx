import { clientData } from 'src/core/clientData';
import { NonCombatSkillHrid } from 'src/core/skills/NonCombatSkillHrid';
import {
  selectCharacterLevel,
  setLevel
} from 'src/features/character/levels/characterLevelSlice';
import { useAppDispatch } from 'src/hooks/useAppDispatch';
import { useAppSelector } from 'src/hooks/useAppSelector';
import { svgHrefs } from 'src/util/svgHrefs';

interface CharacterLevelInputProps {
  skillHrid: NonCombatSkillHrid;
}

export function CharacterLevelInput({ skillHrid }: CharacterLevelInputProps) {
  const skillName = clientData.skillDetailMap[skillHrid].name;
  const levels = useAppSelector(selectCharacterLevel);
  const dispatch = useAppDispatch();

  const skillHridStripped = skillHrid.replace('/skills/', '');
  const icon = (
    <svg className="mr-1 inline h-4 w-4" key={`${skillHrid}_icon_key`}>
      <use href={`${svgHrefs.skills}#${skillHridStripped}`}></use>
    </svg>
  );

  return (
    <div className="form-control" key={`${skillHrid}_key`}>
      <label className="label">
        <span className="label-text">
          {icon}
          {skillName} Level
        </span>
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
}
