import { configureStore } from '@reduxjs/toolkit';
import {
  characterLevelInitialState,
  characterLevelSlice
} from 'src/features/character/characterLevelSlice';
import { characterLevelListenerMiddleware } from 'src/listenerMiddleware';

export const store = configureStore({
  reducer: {
    characterLevel: characterLevelSlice.reducer
  },
  middleware: (getDefaultMiddleware) => [
    ...getDefaultMiddleware(),
    characterLevelListenerMiddleware.middleware
  ],
  preloadedState: {
    characterLevel:
      localStorage.getItem('characterLevel') != null
        ? JSON.parse(localStorage.getItem('characterLevel') as string)
        : characterLevelInitialState
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
