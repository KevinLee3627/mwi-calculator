import {
  CheckIcon,
  PencilSquareIcon,
  TrashIcon,
  XMarkIcon
} from '@heroicons/react/24/solid';
import { useState } from 'react';
import { CreatableSelect } from 'src/components/CreatableSelect';
import { ItemDetail } from 'src/core/items/ItemDetail';
import { CharacterEnhancementSelect } from 'src/features/character/loadout/CharacterEnhancementSelect';
import { CharacterEquipmentSelect } from 'src/features/character/loadout/CharacterEquipmentSelect';
import { itemLocationToItemMap } from 'src/features/character/loadout/itemLocationToItemMap';
import {
  createLoadout,
  deleteLoadout,
  PossibleCharacterEquipmentLocationHrid,
  renameLoadout,
  resetLoadout,
  setActiveLoadout
} from 'src/features/character/loadout/loadoutSlice';
import { useAppDispatch } from 'src/hooks/useAppDispatch';
import { useStats } from 'src/hooks/useStats';

export function CharacterEquipment() {
  const dispatch = useAppDispatch();
  const { activeLoadout, allLoadouts } = useStats();

  const [nameInputValue, setNameInputValue] = useState('');
  const [showNameInput, setShowNameInput] = useState(false);

  function convertEquipToSelect(entry: [string, ItemDetail | null]) {
    const itemLocationHrid = entry[0] as PossibleCharacterEquipmentLocationHrid;

    return (
      <div className="flex items-end gap-2" key={`${itemLocationHrid}_key`}>
        <CharacterEquipmentSelect itemLocationHrid={itemLocationHrid} />
        <div className="min-w-fit">
          <CharacterEnhancementSelect itemLocationHrid={itemLocationHrid} />
        </div>
      </div>
    );
  }

  const equipmentInputs = Object.entries(activeLoadout.equipment)
    .filter((entry) => !entry[0].includes('tool'))
    .map((entry) => convertEquipToSelect(entry));

  const toolInputs = Object.entries(activeLoadout.equipment)
    .filter((entry) => entry[0].includes('tool'))
    .map((entry) => convertEquipToSelect(entry));
  return (
    <dialog id="characterEquipmentModal" className="modal modal-bottom sm:modal-middle">
      <form method="dialog" className="modal-box sm:min-w-max">
        <h1 className="text-lg font-bold">
          Loadout{' '}
          <span className="text-base font-normal">(Type to create new loadout)</span>
        </h1>
        <div className="mb-2 flex gap-4">
          {showNameInput ? (
            <input
              type="text"
              className="input-primary input flex-1"
              placeholder={activeLoadout.name}
              value={nameInputValue}
              onChange={(e) => setNameInputValue(e.target.value)}
            />
          ) : (
            <CreatableSelect
              className="flex-1"
              options={Object.values(allLoadouts).map((loadout) => ({
                value: loadout,
                label: loadout.name
              }))}
              value={{ value: activeLoadout, label: activeLoadout.name }}
              onChange={(newValue) => {
                dispatch(setActiveLoadout({ id: newValue?.value.id ?? 0 }));
              }}
              onCreateOption={(inputValue) => {
                dispatch(createLoadout({ name: inputValue }));
              }}
            />
          )}
          {showNameInput ? (
            <button
              className="btn-success btn-outline btn"
              onClick={(e) => {
                dispatch(
                  renameLoadout({ id: activeLoadout.id, newName: nameInputValue })
                );
                setNameInputValue('');
                setShowNameInput(false);
                e.preventDefault();
              }}
            >
              <CheckIcon className="h-4 w-4" />
            </button>
          ) : (
            <button
              className="btn-primary btn-outline btn"
              onClick={(e) => {
                setNameInputValue(activeLoadout.name);
                setShowNameInput(true);
                e.preventDefault();
              }}
            >
              <PencilSquareIcon className="h-4 w-4" />
            </button>
          )}
          {showNameInput ? (
            <button
              // eslint-disable-next-line tailwindcss/classnames-order, prettier/prettier
              className="btn-outline btn-error btn"
              onClick={(e) => {
                setShowNameInput(false);
                e.preventDefault();
              }}
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          ) : (
            <button
              // Delete Loadout
              // eslint-disable-next-line tailwindcss/classnames-order, prettier/prettier
              className="btn-outline btn-error btn"
              onClick={(e) => {
                dispatch(deleteLoadout({ id: activeLoadout.id }));
                e.preventDefault();
              }}
              disabled={Object.values(allLoadouts).length === 1 || activeLoadout.id === 0}
            >
              <TrashIcon className="h-4 w-4" />
            </button>
          )}
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
            dispatch(resetLoadout());
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
