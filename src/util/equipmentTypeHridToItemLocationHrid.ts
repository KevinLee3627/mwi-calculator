import { EquipmentTypeHrid } from 'src/core/hrid/EquipmentTypeHrid';
import { PossibleCharacterEquipmentLocationHrid } from 'src/features/character/loadout/loadoutSlice';

export const equipmentTypeHridToItemLocationHrid = (
  equipmentTypeHrid: EquipmentTypeHrid
): PossibleCharacterEquipmentLocationHrid =>
  equipmentTypeHrid.replaceAll(
    '/equipment_type',
    '/item_location'
  ) as PossibleCharacterEquipmentLocationHrid;
