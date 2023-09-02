import { configureStore } from '@reduxjs/toolkit';
import {
  characterLevelInitialState,
  characterLevelSlice
} from 'src/features/character/characterLevelSlice';
import { characterLevelListenerMiddleware } from 'src/store/listenerMiddleware';

const tryLocalStorage = (key: string) =>
  localStorage.getItem(key) != null
    ? JSON.parse(localStorage.getItem(key) as string)
    : characterLevelInitialState;

export const store = configureStore({
  reducer: {
    characterLevel: characterLevelSlice.reducer
  },
  middleware: (getDefaultMiddleware) => [
    ...getDefaultMiddleware(),
    characterLevelListenerMiddleware.middleware
  ],
  preloadedState: {
    characterLevel: tryLocalStorage('characterLevel')
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
