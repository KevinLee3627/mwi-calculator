import { createListenerMiddleware } from '@reduxjs/toolkit';
import { characterEnhancementSlice } from 'src/features/character/enhancements/characterEnhancementSlice';
import { characterEquipmentSlice } from 'src/features/character/equipment/characterEquipmentSlice';
import { characterLevelSlice } from 'src/features/character/levels/characterLevelSlice';
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

export const characterEnhancementListenerMiddleware = createListenerMiddleware();
characterEnhancementListenerMiddleware.startListening({
  actionCreator: characterEnhancementSlice.actions.setEnhancementLevel,
  effect: () => {
    localStorage.setItem(
      'characterEnhancement',
      JSON.stringify(store.getState().characterEnhancement)
    );
  }
});
