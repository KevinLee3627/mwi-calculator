import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { clientData } from 'src/core/clientData';
import { ItemHrid } from 'src/core/hrid/ItemHrid';
import { ItemLocationHrid } from 'src/core/hrid/ItemLocationHrid';
import { ItemDetail } from 'src/core/items/ItemDetail';
import { RootState } from 'src/store/store';

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

export interface SetEquipmentPayload {
  locationHrid: PossibleCharacterEquipmentLocationHrid;
  itemHrid: ItemHrid;
}

export const characterEquipmentSlice = createSlice({
  name: 'characterEquipment',
  initialState: characterEquipmentInitialState,
  reducers: {
    setEquipment: (state, action: PayloadAction<SetEquipmentPayload>) => {
      const { payload } = action;
      state[payload.locationHrid] = clientData.itemDetailMap[payload.itemHrid];
    },
    resetEquipment: () => characterEquipmentInitialState
  }
});

export const { setEquipment, resetEquipment } = characterEquipmentSlice.actions;

export const selectCharacterEquipment = (state: RootState) => state.characterEquipment;
