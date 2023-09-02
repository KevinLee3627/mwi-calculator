import { configureStore } from '@reduxjs/toolkit';
import {
  characterEquipmentInitialState,
  characterEquipmentSlice
} from 'src/features/character/characterEquipmentSlice';
import {
  characterLevelInitialState,
  characterLevelSlice
} from 'src/features/character/characterLevelSlice';
import {
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
    characterEquipment: characterEquipmentSlice.reducer
  },
  middleware: (getDefaultMiddleware) => [
    ...getDefaultMiddleware(),
    characterLevelListenerMiddleware.middleware,
    characterEquipmentListenerMiddleware.middleware
  ],
  preloadedState: {
    characterLevel: tryLocalStorage('characterLevel', characterLevelInitialState),
    characterEquipment: tryLocalStorage(
      'characterEquipment',
      characterEquipmentInitialState
    )
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
