import { configureStore } from '@reduxjs/toolkit';
import {
  characterEnhancementInitialState,
  characterEnhancementSlice
} from 'src/features/character/enhancements/characterEnhancementSlice';
import {
  characterEquipmentInitialState,
  characterEquipmentSlice
} from 'src/features/character/equipment/characterEquipmentSlice';
import {
  characterLevelInitialState,
  characterLevelSlice
} from 'src/features/character/levels/characterLevelSlice';
import {
  characterEnhancementListenerMiddleware,
  characterEquipmentListenerMiddleware,
  characterLevelListenerMiddleware
} from 'src/store/listenerMiddleware';

const tryLocalStorage = (key: string, fallback: object) =>
  localStorage.getItem(key) != null
    ? JSON.parse(localStorage.getItem(key) as string)
    : fallback;

export const store = configureStore({
  reducer: {
    characterLevel: characterLevelSlice.reducer,
    characterEquipment: characterEquipmentSlice.reducer,
    characterEnhancement: characterEnhancementSlice.reducer
  },
  middleware: (getDefaultMiddleware) => [
    ...getDefaultMiddleware(),
    characterLevelListenerMiddleware.middleware,
    characterEquipmentListenerMiddleware.middleware,
    characterEnhancementListenerMiddleware.middleware
  ],
  preloadedState: {
    characterLevel: tryLocalStorage('characterLevel', characterLevelInitialState),
    characterEquipment: tryLocalStorage(
      'characterEquipment',
      characterEquipmentInitialState
    ),
    characterEnhancement: tryLocalStorage(
      'characterEnhancement',
      characterEnhancementInitialState
    )
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
