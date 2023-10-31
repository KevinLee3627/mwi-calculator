import { NonCombatSkillHrid } from 'src/old/core/skills/NonCombatSkillHrid';
import { CharacterLevelInput } from 'src/old/features/character/levels/CharacterLevelInput';
import { selectCharacterLevel } from 'src/old/features/character/levels/characterLevelSlice';
import { useAppSelector } from 'src/old/hooks/useAppSelector';

export function CharacterLevels() {
  const levels = useAppSelector(selectCharacterLevel);

  const inputs = Object.entries(levels).map((entry) => (
    <CharacterLevelInput key={entry[0]} skillHrid={entry[0] as NonCombatSkillHrid} />
  ));
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
