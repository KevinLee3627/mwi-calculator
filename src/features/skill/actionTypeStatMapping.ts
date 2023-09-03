import { NonCombatActionTypeHrid } from 'src/core/actions/NonCombatActionTypeHrid';
import { NonCombatStats } from 'src/core/items/NonCombatStats';

const skillingMiscStats: (keyof NonCombatStats)[] = [
  'skillingEfficiency',
  'skillingExperience',
  'skillingRareFind'
];

export const actionTypeStatMapping: Record<
  NonCombatActionTypeHrid,
  (keyof NonCombatStats)[]
> = {
  '/action_types/milking': ['milkingEfficiency', 'milkingSpeed', ...skillingMiscStats],
  '/action_types/foraging': ['foragingEfficiency', 'foragingSpeed', ...skillingMiscStats],
  '/action_types/woodcutting': [
    'woodcuttingEfficiency',
    'woodcuttingSpeed',
    ...skillingMiscStats
  ],
  '/action_types/cheesesmithing': [
    'cheesesmithingEfficiency',
    'cheesesmithingSpeed',
    ...skillingMiscStats
  ],
  '/action_types/crafting': ['craftingEfficiency', 'craftingSpeed', ...skillingMiscStats],
  '/action_types/tailoring': [
    'tailoringEfficiency',
    'tailoringSpeed',
    ...skillingMiscStats
  ],
  '/action_types/cooking': ['cookingEfficiency', 'cookingSpeed', ...skillingMiscStats],
  '/action_types/brewing': ['brewingEfficiency', 'brewingSpeed', ...skillingMiscStats],
  '/action_types/enhancing': ['enhancingSpeed', 'enhancingSuccess']
};
