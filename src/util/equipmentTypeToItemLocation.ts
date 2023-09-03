// Converts EquipmentTypeHrid to ItemLocationHrid

import { EquipmentTypeHrid } from 'src/core/hrid/EquipmentTypeHrid';
import { PossibleCharacterEquipmentLocationHrid } from 'src/features/character/equipment/characterEquipmentSlice';

export const equipmentTypeToItemLocation = (
  equipmentTypeHrid: EquipmentTypeHrid
): PossibleCharacterEquipmentLocationHrid =>
  equipmentTypeHrid.replaceAll(
    '/equipment_type',
    '/item_location'
  ) as PossibleCharacterEquipmentLocationHrid;
