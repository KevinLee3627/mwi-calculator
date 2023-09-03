import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PossibleCharacterEquipmentLocationHrid } from 'src/features/character/equipment/characterEquipmentSlice';
import { RootState } from 'src/store/store';

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

export interface SetEnhancementPayload {
  locationHrid: PossibleCharacterEquipmentLocationHrid;
  enhancementLevel: number;
}

export const characterEnhancementSlice = createSlice({
  name: 'characterEnhancement',
  initialState: characterEnhancementInitialState,
  reducers: {
    setEnhancementLevel: (state, action: PayloadAction<SetEnhancementPayload>) => {
      const { payload } = action;
      state[payload.locationHrid] = payload.enhancementLevel;
    }
  }
});

export const { setEnhancementLevel } = characterEnhancementSlice.actions;

export const selectCharacterEnhancement = (state: RootState) =>
  state.characterEnhancement;
