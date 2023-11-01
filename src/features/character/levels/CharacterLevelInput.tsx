import { GameIcon } from 'src/components/GameIcon';
import { clientData } from 'src/core/clientData';
import { NonCombatSkillHrid } from 'src/core/skills/NonCombatSkillHrid';
import { setLevel } from 'src/features/character/levels/characterLevelsSlice';
import { useAppDispatch } from 'src/hooks/useAppDispatch';
import { useStats } from 'src/hooks/useStats';

interface CharacterLevelInputProps {
  skillHrid: NonCombatSkillHrid;
}

export function CharacterLevelInput({ skillHrid }: CharacterLevelInputProps) {
  const skillName = clientData.skillDetailMap[skillHrid].name;
  const { characterLevels } = useStats();
  const dispatch = useAppDispatch();

  const skillHridStripped = skillHrid.replace('/skills/', '');
  const icon = <GameIcon svgSetName="skills" iconName={skillHridStripped ?? ''} />;

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
        value={characterLevels[skillHrid]}
        onChange={(e) => {
          const value = parseInt(e.target.value, 10);
          dispatch(setLevel({ skillHrid, value }));
        }}
      />
    </div>
  );
}
