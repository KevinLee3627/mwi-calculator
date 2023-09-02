import { useMemo } from 'react';
import { clientData } from 'src/core/clientData';
import { ItemDetail } from 'src/core/items/ItemDetail';
import { CharacterEnhancementSelect } from 'src/features/character/enhancements/CharacterEnhancementSelect';
import { CharacterEquipmentSelect } from 'src/features/character/equipment/CharacterEquipmentSelect';
import {
  PossibleCharacterEquipmentLocationHrid,
  selectCharacterEquipment
} from 'src/features/character/equipment/characterEquipmentSlice';
import { useAppSelector } from 'src/hooks/useAppSelector';

export function CharacterEquipment() {
  const equipment = useAppSelector(selectCharacterEquipment);

  // Creates mapping between item location and items from client data
  const itemMap = useMemo(() => {
    return Object.values(clientData.itemDetailMap).reduce<Record<string, ItemDetail[]>>(
      (acc, val) => {
        if (val.equipmentDetail.type === '') return acc;

        const location = val.equipmentDetail.type.split('/').at(-1);
        if (location == null) return acc;
        if (acc[location] == null) {
          acc[location] = [];
        }
        acc[location].push(val);
        return acc;
      },
      {}
    );
  }, []);

  function convertEquipToSelect(entry: [string, ItemDetail | null]) {
    const itemLocationHrid = entry[0] as PossibleCharacterEquipmentLocationHrid;
    // Why use location vs. itemLocationHrid? in clientData.itemDetailMap uses
    // EquipmentTypeHrid instead of ItemLocationHrid, which means the two Hrid
    // types have the same suffixes but different prefixes.
    // ex: EquipmentTypeHrid = /equipment_type/head
    // ex: ItemLocationHrid = /item_location/head
    const location = itemLocationHrid.split('/').at(-1);

    if (location == null) return <></>;
    return (
      <div className="flex items-end gap-2" key={`${itemLocationHrid}_key`}>
        <CharacterEquipmentSelect
          itemLocationHrid={itemLocationHrid}
          possibleItems={itemMap[location]}
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
      </form>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
}
