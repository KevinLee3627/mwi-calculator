import { SkillDrinksSelect } from 'src/features/skill/drinks/SkillDrinksSelect';
import { SkillTable } from 'src/features/skill/SkillTable';

export function SkillPage() {
  return (
    <div>
      <SkillDrinksSelect actionTypeHrid="/action_types/milking" />
      <SkillTable />
    </div>
  );
}
