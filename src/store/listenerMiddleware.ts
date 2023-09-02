import { createListenerMiddleware } from '@reduxjs/toolkit';
import { characterLevelSlice } from 'src/features/character/characterLevelSlice';
import { characterEquipmentSlice } from 'src/features/character/equipment/characterEquipmentSlice';
import { store } from 'src/store/store';

export const characterLevelListenerMiddleware = createListenerMiddleware();
characterLevelListenerMiddleware.startListening({
  actionCreator: characterLevelSlice.actions.setLevel,
  effect: () => {
    localStorage.setItem(
      'characterLevel',
      JSON.stringify(store.getState().characterLevel)
    );
  }
});

export const characterEquipmentListenerMiddleware = createListenerMiddleware();
characterEquipmentListenerMiddleware.startListening({
  actionCreator: characterEquipmentSlice.actions.setEquipment,
  effect: () => {
    localStorage.setItem(
      'characterEquipment',
      JSON.stringify(store.getState().characterEquipment)
    );
  }
});
