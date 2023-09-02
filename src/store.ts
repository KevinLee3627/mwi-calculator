import { configureStore } from '@reduxjs/toolkit';
import { characterLevelSlice } from 'src/features/character/characterLevelSlice';

export const store = configureStore({
  reducer: {
    characterLevel: characterLevelSlice.reducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
