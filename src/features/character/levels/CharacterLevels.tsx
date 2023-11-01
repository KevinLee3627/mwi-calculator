import { NonCombatSkillHrid } from 'src/core/skills/NonCombatSkillHrid';
import { CharacterLevelInput } from 'src/features/character/levels/CharacterLevelInput';
import { selectCharacterLevels } from 'src/features/character/levels/characterLevelsSlice';
import { useAppSelector } from 'src/hooks/useAppSelector';

export function CharacterLevels() {
  const levels = useAppSelector(selectCharacterLevels);

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
