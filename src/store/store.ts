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
import { marketApi } from 'src/features/market/services/market';
import {
  activeSkillInitialState,
  activeSkillSlice
} from 'src/features/navigation/activeSkillSlice';
import {
  skillDrinksInitialState,
  skillDrinksSlice
} from 'src/features/skill/drinks/drinksSlice';
import {
  targetLevelInitialState,
  targetLevelSlice
} from 'src/features/skill/targets/targetLevelSlice';
import {
  activeSkillListenerMiddleware,
  characterEnhancementListenerMiddleware,
  characterEquipmentListenerMiddleware,
  characterLevelListenerMiddleware,
  skillDrinksListenerMiddleware,
  targetLevelListenerMiddleware
} from 'src/store/listenerMiddleware';

const tryLocalStorage = (key: string, fallback: object) =>
  localStorage.getItem(key) != null
    ? JSON.parse(localStorage.getItem(key) as string)
    : fallback;

export const store = configureStore({
  reducer: {
    characterLevel: characterLevelSlice.reducer,
    characterEquipment: characterEquipmentSlice.reducer,
    characterEnhancement: characterEnhancementSlice.reducer,
    skillDrinks: skillDrinksSlice.reducer,
    activeSkill: activeSkillSlice.reducer,
    targetLevel: targetLevelSlice.reducer,
    [marketApi.reducerPath]: marketApi.reducer
  },
  middleware: (getDefaultMiddleware) => [
    ...getDefaultMiddleware(),
    characterLevelListenerMiddleware.middleware,
    characterEquipmentListenerMiddleware.middleware,
    characterEnhancementListenerMiddleware.middleware,
    skillDrinksListenerMiddleware.middleware,
    activeSkillListenerMiddleware.middleware,
    targetLevelListenerMiddleware.middleware,
    marketApi.middleware
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
    ),
    skillDrinks: tryLocalStorage('skillDrinks', skillDrinksInitialState),
    activeSkill: tryLocalStorage('activeSkill', activeSkillInitialState),
    targetLevel: tryLocalStorage('targetLevel', targetLevelInitialState)
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
