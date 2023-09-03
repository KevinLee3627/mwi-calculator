import { NonCombatActionTypeHrid } from 'src/core/actions/NonCombatActionTypeHrid';
import { NonCombatStats } from 'src/core/items/NonCombatStats';

const skillingMiscStats: Record<
  Extract<
    keyof NonCombatStats,
    'skillingEfficiency' | 'skillingExperience' | 'skillingRareFind'
  >,
  boolean
> = {
  skillingEfficiency: true,
  skillingExperience: true,
  skillingRareFind: true
};

export const actionTypeStatMapping: Record<
  NonCombatActionTypeHrid,
  Partial<Record<keyof NonCombatStats, boolean>>
> = {
  '/action_types/milking': {
    milkingEfficiency: true,
    milkingSpeed: true,
    ...skillingMiscStats
  },
  '/action_types/foraging': {
    foragingEfficiency: true,
    foragingSpeed: true,
    ...skillingMiscStats
  },
  '/action_types/woodcutting': {
    woodcuttingEfficiency: true,
    woodcuttingSpeed: true,
    ...skillingMiscStats
  },
  '/action_types/cheesesmithing': {
    cheesesmithingEfficiency: true,
    cheesesmithingSpeed: true,
    ...skillingMiscStats
  },
  '/action_types/crafting': {
    craftingEfficiency: true,
    craftingSpeed: true,
    ...skillingMiscStats
  },
  '/action_types/tailoring': {
    tailoringEfficiency: true,
    tailoringSpeed: true,
    ...skillingMiscStats
  },
  '/action_types/cooking': {
    cookingEfficiency: true,
    cookingSpeed: true,
    ...skillingMiscStats
  },
  '/action_types/brewing': {
    brewingEfficiency: true,
    brewingSpeed: true,
    ...skillingMiscStats
  },
  '/action_types/enhancing': {
    enhancingSpeed: true,
    enhancingSuccess: true,
    skillingExperience: true
  }
};

export const actionTypeSpeedStatMapping: Record<
  NonCombatActionTypeHrid,
  keyof NonCombatStats
> = {
  '/action_types/brewing': 'brewingSpeed',
  '/action_types/cheesesmithing': 'cheesesmithingSpeed',
  '/action_types/cooking': 'cookingSpeed',
  '/action_types/crafting': 'craftingSpeed',
  '/action_types/enhancing': 'enhancingSpeed',
  '/action_types/foraging': 'foragingSpeed',
  '/action_types/milking': 'milkingSpeed',
  '/action_types/tailoring': 'tailoringSpeed',
  '/action_types/woodcutting': 'woodcuttingSpeed'
};

export const actionTypeEfficiencyStatMapping: Record<
  NonCombatActionTypeHrid,
  keyof NonCombatStats | null
> = {
  '/action_types/brewing': 'brewingEfficiency',
  '/action_types/cheesesmithing': 'cheesesmithingEfficiency',
  '/action_types/cooking': 'cookingEfficiency',
  '/action_types/crafting': 'craftingEfficiency',
  '/action_types/enhancing': null,
  '/action_types/foraging': 'foragingEfficiency',
  '/action_types/milking': 'milkingEfficiency',
  '/action_types/tailoring': 'tailoringEfficiency',
  '/action_types/woodcutting': 'woodcuttingEfficiency'
};
