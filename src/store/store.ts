import { configureStore } from '@reduxjs/toolkit';
import { activeSkillInitialState, activeSkillSlice } from 'src/features/activeSkillSlice';
import {
  characterLevelsInitialState,
  characterLevelsSlice
} from 'src/features/character/levels/characterLevelsSlice';
import {
  loadoutInitialState,
  loadoutSlice
} from 'src/features/character/loadout/loadoutSlice';
import {
  communityBuffInitialState,
  communityBuffSlice
} from 'src/features/communityBuff/communityBuffSlice';
import { currentXpInitialState, currentXpSlice } from 'src/features/currentXpSlice';
// import {
//   actionQueueInitialState,
//   actionQueueSlice
// } from 'src/old/features/queue/actionQueueSlice';
import {
  skillDrinksInitialState,
  skillDrinksSlice
} from 'src/features/drinks/drinksSlice';
import { houseInitialState, houseSlice } from 'src/features/house/houseSlice';
import { marketApi } from 'src/features/market/marketApi';
import {
  targetLevelsInitialState,
  targetLevelsSlice
} from 'src/features/targetLevelSlice';
import {
  // actionQueueListenerMiddleware,
  activeSkillListenerMiddleware,
  characterLevelsListenerMiddleware,
  communityBuffListenerMiddleware,
  currentXpListenerMiddleware,
  houseListenerMiddleware,
  loadoutListenerMiddleware,
  skillDrinksListenerMiddleware,
  targetLevelsListenerMiddleware
} from 'src/store/listenerMiddleware';

const tryLocalStorage = (key: string, fallback: object) =>
  localStorage.getItem(key) != null
    ? JSON.parse(localStorage.getItem(key) as string)
    : fallback;

export const store = configureStore({
  reducer: {
    characterLevels: characterLevelsSlice.reducer,
    loadout: loadoutSlice.reducer,
    skillDrinks: skillDrinksSlice.reducer,
    activeSkill: activeSkillSlice.reducer,
    targetLevels: targetLevelsSlice.reducer,
    communityBuff: communityBuffSlice.reducer,
    house: houseSlice.reducer,
    currentXp: currentXpSlice.reducer,
    // actionQueue: actionQueueSlice.reducer,
    [marketApi.reducerPath]: marketApi.reducer
  },
  middleware: (getDefaultMiddleware) => [
    ...getDefaultMiddleware(),
    characterLevelsListenerMiddleware.middleware,
    loadoutListenerMiddleware.middleware,
    skillDrinksListenerMiddleware.middleware,
    activeSkillListenerMiddleware.middleware,
    targetLevelsListenerMiddleware.middleware,
    communityBuffListenerMiddleware.middleware,
    houseListenerMiddleware.middleware,
    currentXpListenerMiddleware.middleware,
    // actionQueueListenerMiddleware.middleware,
    marketApi.middleware
  ],
  preloadedState: {
    characterLevels: tryLocalStorage('characterLevels', characterLevelsInitialState),
    loadout: tryLocalStorage('loadout', loadoutInitialState),
    skillDrinks: tryLocalStorage('skillDrinks', skillDrinksInitialState),
    activeSkill: tryLocalStorage('activeSkill', activeSkillInitialState),
    targetLevels: tryLocalStorage('targetLevels', targetLevelsInitialState),
    communityBuff: tryLocalStorage('communityBuff', communityBuffInitialState),
    house: tryLocalStorage('house', houseInitialState),
    currentXp: tryLocalStorage('currentXp', currentXpInitialState)
    //   actionQueue: tryLocalStorage('actionQueue', actionQueueInitialState)
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
