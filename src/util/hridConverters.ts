import { ActionTypeHrid } from 'src/core/hrid/ActionTypeHrid';
import { EquipmentTypeHrid } from 'src/core/hrid/EquipmentTypeHrid';
import { NonCombatSkillHrid } from 'src/core/skills/NonCombatSkillHrid';
import { PossibleCharacterEquipmentLocationHrid } from 'src/features/character/equipment/characterEquipmentSlice';

export const actionTypeToSkillHrid = (
  actionTypeHrid: ActionTypeHrid
): NonCombatSkillHrid =>
  actionTypeHrid.replaceAll('action_types', 'skills') as NonCombatSkillHrid;
// Converts EquipmentTypeHrid to ItemLocationHrid

export const actionTypeToSkillName = (actionTypeHrid: ActionTypeHrid): string =>
  actionTypeHrid.replaceAll('/action_types/', '');

export const equipmentTypeToItemLocation = (
  equipmentTypeHrid: EquipmentTypeHrid
): PossibleCharacterEquipmentLocationHrid =>
  equipmentTypeHrid.replaceAll(
    '/equipment_type',
    '/item_location'
  ) as PossibleCharacterEquipmentLocationHrid;
