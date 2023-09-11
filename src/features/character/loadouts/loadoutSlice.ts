import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { clientData } from 'src/core/clientData';
import { ItemHrid } from 'src/core/hrid/ItemHrid';
import { ItemLocationHrid } from 'src/core/hrid/ItemLocationHrid';
import { ItemDetail } from 'src/core/items/ItemDetail';
import { RootState } from 'src/store/store';

const createId = (name: string) => `loadout_${name}`;

export type PossibleCharacterEquipmentLocationHrid = Exclude<
  ItemLocationHrid,
  '/item_locations/two_hand' | '/item_locations/inventory'
>;

export type CharacterEquipmentState = Record<
  PossibleCharacterEquipmentLocationHrid,
  ItemDetail | null
>;

export const characterEquipmentInitialState: CharacterEquipmentState = {
  '/item_locations/head': null,
  '/item_locations/body': null,
  '/item_locations/legs': null,
  '/item_locations/feet': null,
  '/item_locations/hands': null,
  '/item_locations/main_hand': null,
  '/item_locations/off_hand': null,
  '/item_locations/earrings': null,
  '/item_locations/neck': null,
  '/item_locations/ring': null,
  '/item_locations/pouch': null,
  '/item_locations/milking_tool': null,
  '/item_locations/foraging_tool': null,
  '/item_locations/woodcutting_tool': null,
  '/item_locations/cheesesmithing_tool': null,
  '/item_locations/crafting_tool': null,
  '/item_locations/tailoring_tool': null,
  '/item_locations/cooking_tool': null,
  '/item_locations/brewing_tool': null,
  '/item_locations/enhancing_tool': null
};

export type CharacterEnhancementState = Record<
  PossibleCharacterEquipmentLocationHrid,
  number
>;

export const characterEnhancementInitialState: CharacterEnhancementState = {
  '/item_locations/head': 0,
  '/item_locations/body': 0,
  '/item_locations/legs': 0,
  '/item_locations/feet': 0,
  '/item_locations/hands': 0,
  '/item_locations/main_hand': 0,
  '/item_locations/off_hand': 0,
  '/item_locations/earrings': 0,
  '/item_locations/neck': 0,
  '/item_locations/ring': 0,
  '/item_locations/pouch': 0,
  '/item_locations/milking_tool': 0,
  '/item_locations/foraging_tool': 0,
  '/item_locations/woodcutting_tool': 0,
  '/item_locations/cheesesmithing_tool': 0,
  '/item_locations/crafting_tool': 0,
  '/item_locations/tailoring_tool': 0,
  '/item_locations/cooking_tool': 0,
  '/item_locations/brewing_tool': 0,
  '/item_locations/enhancing_tool': 0
};

export interface Loadout {
  id: string;
  name: string;
  equipment: CharacterEquipmentState;
  enhancementLevels: CharacterEnhancementState;
}

export type LoadoutState = {
  activeLoadoutId: string;
  loadouts: Record<string, Loadout>;
};

export const loadoutInitialState: LoadoutState = {
  activeLoadoutId: createId('default'),
  loadouts: {
    loadout_default: {
      id: createId('default'),
      name: 'default',
      equipment: characterEquipmentInitialState,
      enhancementLevels: characterEnhancementInitialState
    }
  }
};

interface CreateLoadoutPayload {
  name: string;
  equipment?: Loadout['equipment'];
}

interface SetActiveLoadoutPayload {
  name: string;
}

interface DeleteLoadoutPayload {
  name: string;
}

interface RenameLoadoutPayload {
  oldName: Loadout['name'];
  newName: Loadout['name'];
}

interface SetEquipPayload {
  locationHrid: PossibleCharacterEquipmentLocationHrid;
  itemHrid: ItemHrid;
}

interface ClearEquipPayload {
  locationHrid: PossibleCharacterEquipmentLocationHrid;
}

interface SetEnhancementLevelPayload {
  locationHrid: PossibleCharacterEquipmentLocationHrid;
  level: number;
}

interface ResetLoadoutPayload {
  name: string;
}

export const loadoutSlice = createSlice({
  name: 'loadout',
  initialState: loadoutInitialState,
  reducers: {
    createLoadout: (state, action: PayloadAction<CreateLoadoutPayload>) => {
      const { payload } = action;
      const id = createId(payload.name);
      state.loadouts[id] = {
        id,
        name: payload.name,
        equipment: characterEquipmentInitialState,
        enhancementLevels: characterEnhancementInitialState
      };
    },
    setActiveLoadout: (state, action: PayloadAction<SetActiveLoadoutPayload>) => {
      const { payload } = action;
      state.activeLoadoutId = createId(payload.name);
    },
    deleteLoadout: (state, action: PayloadAction<DeleteLoadoutPayload>) => {
      delete state.loadouts[createId(action.payload.name)];
      state.activeLoadoutId = createId(
        Object.values(state.loadouts).at(-1)?.name ?? 'default'
      );
    },
    renameLoadout: (state, action: PayloadAction<RenameLoadoutPayload>) => {
      const { loadouts } = state;
      const { payload } = action;
      loadouts[createId(payload.oldName)].name = payload.newName;
    },
    setEquip: (state, action: PayloadAction<SetEquipPayload>) => {
      const { loadouts, activeLoadoutId } = state;
      const { payload } = action;
      loadouts[activeLoadoutId].equipment[payload.locationHrid] =
        clientData.itemDetailMap[payload.itemHrid];
    },
    clearEquip: (state, action: PayloadAction<ClearEquipPayload>) => {
      const { loadouts, activeLoadoutId } = state;
      const { payload } = action;
      loadouts[activeLoadoutId].equipment[payload.locationHrid] = null;
    },
    setEnhancementLevel: (state, action: PayloadAction<SetEnhancementLevelPayload>) => {
      const { loadouts, activeLoadoutId } = state;
      const { payload } = action;
      loadouts[activeLoadoutId].enhancementLevels[payload.locationHrid] = payload.level;
    },
    resetLoadout: (state, action: PayloadAction<ResetLoadoutPayload>) => {
      const { loadouts } = state;
      const { payload } = action;
      loadouts[createId(payload.name)].equipment = characterEquipmentInitialState;
      loadouts[createId(payload.name)].enhancementLevels =
        characterEnhancementInitialState;
    }
  }
});

export const {
  createLoadout,
  setActiveLoadout,
  resetLoadout,
  deleteLoadout,
  renameLoadout,
  setEquip,
  clearEquip,
  setEnhancementLevel
} = loadoutSlice.actions;

export const selectActiveLoadout = (state: RootState) =>
  state.loadout.loadouts[state.loadout.activeLoadoutId];
export const selectAllLoadouts = (state: RootState) => state.loadout.loadouts;
