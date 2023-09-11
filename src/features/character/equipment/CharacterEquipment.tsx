import { PlusIcon, TrashIcon } from '@heroicons/react/24/solid';
import { Select } from 'src/components/Select';
import { ItemDetail } from 'src/core/items/ItemDetail';
import { CharacterEnhancementSelect } from 'src/features/character/enhancements/CharacterEnhancementSelect';
import { CharacterEquipmentSelect } from 'src/features/character/equipment/CharacterEquipmentSelect';
import {
  createLoadout,
  deleteLoadout,
  PossibleCharacterEquipmentLocationHrid,
  resetLoadout,
  selectActiveLoadout,
  selectAllLoadouts,
  setActiveLoadout
} from 'src/features/character/loadouts/loadoutSlice';
import { itemLocationToItemMap } from 'src/features/itemLocationToItemMap';
import { useAppDispatch } from 'src/hooks/useAppDispatch';
import { useAppSelector } from 'src/hooks/useAppSelector';

export function CharacterEquipment() {
  const dispatch = useAppDispatch();
  const loadout = useAppSelector(selectActiveLoadout);
  const allLoadouts = useAppSelector(selectAllLoadouts);

  function convertEquipToSelect(entry: [string, ItemDetail | null]) {
    const itemLocationHrid = entry[0] as PossibleCharacterEquipmentLocationHrid;

    return (
      <div className="flex items-end gap-2" key={`${itemLocationHrid}_key`}>
        <CharacterEquipmentSelect
          itemLocationHrid={itemLocationHrid}
          possibleItems={itemLocationToItemMap[itemLocationHrid]}
        />
        <div className="min-w-fit">
          <CharacterEnhancementSelect itemLocationHrid={itemLocationHrid} />
        </div>
      </div>
    );
  }

  const equipmentInputs = Object.entries(loadout.equipment)
    .filter((entry) => !entry[0].includes('tool'))
    .map((entry) => convertEquipToSelect(entry));

  const toolInputs = Object.entries(loadout.equipment)
    .filter((entry) => entry[0].includes('tool'))
    .map((entry) => convertEquipToSelect(entry));
  return (
    <dialog id="characterEquipmentModal" className="modal modal-bottom sm:modal-middle">
      <form method="dialog" className="modal-box sm:min-w-max">
        <label className="label">
          <span className="label-text">Loadout ({loadout.name})</span>
        </label>
        <div className="mb-2 flex gap-4">
          <Select
            className="flex-1"
            options={Object.values(allLoadouts).map((loadout) => ({
              value: loadout,
              label: loadout.name
            }))}
            value={{ value: loadout, label: loadout.name }}
            onChange={(newValue) => {
              dispatch(setActiveLoadout({ name: newValue?.value.name ?? 'default' }));
            }}
          />

          <button
            // Delete Loadout
            // eslint-disable-next-line tailwindcss/classnames-order, prettier/prettier
            className="btn-outline btn-error btn"
            onClick={() => dispatch(deleteLoadout({ name: loadout.name }))}
            disabled={
              Object.values(allLoadouts).length === 1 || loadout.name === 'default'
            }
          >
            <TrashIcon className="h-4 w-4" />
          </button>
          <button
            // Create Loadout
            className="btn-success btn-outline btn"
            onClick={(e) => {
              const newName = `New Loadout ${Object.values(allLoadouts).length + 1}`;
              dispatch(createLoadout({ name: newName }));
              e.preventDefault();
            }}
          >
            <PlusIcon className="h-4 w-4" />
          </button>
        </div>
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
            dispatch(resetLoadout({ name: loadout.name }));
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
