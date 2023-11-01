import { NonCombatActionTypeHrid } from 'src/core/actions/NonCombatActionTypeHrid';
import { PossibleCharacterEquipmentLocationHrid } from 'src/features/character/loadout/loadoutSlice';

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
