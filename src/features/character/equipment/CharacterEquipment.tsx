import { ItemDetail } from 'src/core/items/ItemDetail';
import { CharacterEnhancementSelect } from 'src/features/character/enhancements/CharacterEnhancementSelect';
import { resetEnhancementLevels } from 'src/features/character/enhancements/characterEnhancementSlice';
import { CharacterEquipmentSelect } from 'src/features/character/equipment/CharacterEquipmentSelect';
import {
  PossibleCharacterEquipmentLocationHrid,
  resetAllEquipment,
  selectCharacterEquipment
} from 'src/features/character/equipment/characterEquipmentSlice';
import { itemLocationToItemMap } from 'src/features/itemLocationToItemMap';
import { useAppDispatch } from 'src/hooks/useAppDispatch';
import { useAppSelector } from 'src/hooks/useAppSelector';

export function CharacterEquipment() {
  const dispatch = useAppDispatch();
  const equipment = useAppSelector(selectCharacterEquipment);

  // Creates mapping between item location and items from client data

  function convertEquipToSelect(entry: [string, ItemDetail | null]) {
    const itemLocationHrid = entry[0] as PossibleCharacterEquipmentLocationHrid;
    // Why use location vs. itemLocationHrid? in clientData.itemDetailMap uses
    // EquipmentTypeHrid instead of ItemLocationHrid, which means the two Hrid
    // types have the same suffixes but different prefixes.
    // ex: EquipmentTypeHrid = /equipment_type/head
    // ex: ItemLocationHrid = /item_location/head

    return (
      <div className="flex items-end gap-2" key={`${itemLocationHrid}_key`}>
        <CharacterEquipmentSelect
          itemLocationHrid={itemLocationHrid}
          possibleItems={itemLocationToItemMap[itemLocationHrid]}
        />
        <CharacterEnhancementSelect itemLocationHrid={itemLocationHrid} />
      </div>
    );
  }

  const equipmentInputs = Object.entries(equipment)
    .filter((entry) => !entry[0].includes('tool'))
    .map((entry) => convertEquipToSelect(entry));

  const toolInputs = Object.entries(equipment)
    .filter((entry) => entry[0].includes('tool'))
    .map((entry) => convertEquipToSelect(entry));
  return (
    <dialog id="characterEquipmentModal" className="modal modal-bottom sm:modal-middle">
      <form method="dialog" className="modal-box sm:min-w-max">
        <div className="gap-12 sm:flex">
          <div>
            <h1 className="text-lg font-bold">Equipment</h1>
            {equipmentInputs}
          </div>
          <div className="mt-8 sm:mt-0">
            <h1 className="text-lg font-bold">Tools</h1>
            {toolInputs}
          </div>
        </div>
        <button
          className="btn-error btn mt-4"
          onClick={(e) => {
            dispatch(resetAllEquipment());
            dispatch(resetEnhancementLevels());
            // preventDefault stops button from 'submitting' the form and thus
            // stops the modal from closing.
            e.preventDefault();
          }}
        >
          RESET
        </button>
      </form>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
}
