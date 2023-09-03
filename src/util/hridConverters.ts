import { ActionTypeHrid } from 'src/core/hrid/ActionTypeHrid';
import { EquipmentTypeHrid } from 'src/core/hrid/EquipmentTypeHrid';
import { NonCombatSkillHrid } from 'src/core/skills/NonCombatSkillHrid';
import { PossibleCharacterEquipmentLocationHrid } from 'src/features/character/equipment/characterEquipmentSlice';

export const actionTypeToSkillHrid = (
  actionTypeHrid: ActionTypeHrid
): NonCombatSkillHrid =>
  actionTypeHrid.replaceAll('action_type', 'skill') as NonCombatSkillHrid;
// Converts EquipmentTypeHrid to ItemLocationHrid

export const equipmentTypeToItemLocation = (
  equipmentTypeHrid: EquipmentTypeHrid
): PossibleCharacterEquipmentLocationHrid =>
  equipmentTypeHrid.replaceAll(
    '/equipment_type',
    '/item_location'
  ) as PossibleCharacterEquipmentLocationHrid;
