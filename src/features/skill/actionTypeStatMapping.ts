import { NonCombatActionTypeHrid } from 'src/core/actions/NonCombatActionTypeHrid';
import { ActionFunctionHrid } from 'src/core/hrid/ActionFunctionHrid';
import { NonCombatStats } from 'src/core/items/NonCombatStats';
import { PossibleCharacterEquipmentLocationHrid } from 'src/features/character/loadouts/loadoutSlice';

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

export const actionTypeToolLocationMapping: Record<
  NonCombatActionTypeHrid,
  PossibleCharacterEquipmentLocationHrid
> = {
  '/action_types/brewing': '/item_locations/brewing_tool',
  '/action_types/cheesesmithing': '/item_locations/cheesesmithing_tool',
  '/action_types/cooking': '/item_locations/cooking_tool',
  '/action_types/crafting': '/item_locations/crafting_tool',
  '/action_types/enhancing': '/item_locations/enhancing_tool',
  '/action_types/foraging': '/item_locations/foraging_tool',
  '/action_types/milking': '/item_locations/milking_tool',
  '/action_types/tailoring': '/item_locations/tailoring_tool',
  '/action_types/woodcutting': '/item_locations/woodcutting_tool'
};

export const actionTypeActionFunctionMapping: Record<
  NonCombatActionTypeHrid,
  ActionFunctionHrid
> = {
  '/action_types/brewing': '/action_functions/production',
  '/action_types/cheesesmithing': '/action_functions/production',
  '/action_types/cooking': '/action_functions/production',
  '/action_types/crafting': '/action_functions/production',
  '/action_types/enhancing': '/action_functions/enhancing',
  '/action_types/foraging': '/action_functions/gathering',
  '/action_types/milking': '/action_functions/gathering',
  '/action_types/tailoring': '/action_functions/production',
  '/action_types/woodcutting': '/action_functions/gathering'
};
