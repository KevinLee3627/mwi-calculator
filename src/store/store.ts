import { configureStore } from '@reduxjs/toolkit';
import { activePageInitialState, activePageSlice } from 'src/features/activePageSlice';
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
import {
  skillDrinksInitialState,
  skillDrinksSlice
} from 'src/features/drinks/drinksSlice';
import { houseInitialState, houseSlice } from 'src/features/house/houseSlice';
import { marketApi } from 'src/features/market/marketApi';
import {
  actionQueueInitialState,
  actionQueueSlice
} from 'src/features/queue/actionQueueSlice';
import {
  targetActionsInitialState,
  targetActionsSlice
} from 'src/features/targetActionsSlice';
import {
  targetLevelsInitialState,
  targetLevelsSlice
} from 'src/features/targetLevelSlice';
import {
  actionQueueListenerMiddleware,
  activePageListenerMiddleware,
  characterLevelsListenerMiddleware,
  communityBuffListenerMiddleware,
  currentXpListenerMiddleware,
  houseListenerMiddleware,
  loadoutListenerMiddleware,
  skillDrinksListenerMiddleware,
  targetActionsListenerMiddleware,
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
    activePage: activePageSlice.reducer,
    targetLevels: targetLevelsSlice.reducer,
    targetActions: targetActionsSlice.reducer,
    communityBuff: communityBuffSlice.reducer,
    house: houseSlice.reducer,
    currentXp: currentXpSlice.reducer,
    actionQueue: actionQueueSlice.reducer,
    [marketApi.reducerPath]: marketApi.reducer
  },
  middleware: (getDefaultMiddleware) => [
    ...getDefaultMiddleware(),
    characterLevelsListenerMiddleware.middleware,
    loadoutListenerMiddleware.middleware,
    skillDrinksListenerMiddleware.middleware,
    activePageListenerMiddleware.middleware,
    targetLevelsListenerMiddleware.middleware,
    targetActionsListenerMiddleware.middleware,
    communityBuffListenerMiddleware.middleware,
    houseListenerMiddleware.middleware,
    currentXpListenerMiddleware.middleware,
    actionQueueListenerMiddleware.middleware,
    marketApi.middleware
  ],
  preloadedState: {
    characterLevels: tryLocalStorage('characterLevels', characterLevelsInitialState),
    loadout: tryLocalStorage('loadout', loadoutInitialState),
    skillDrinks: tryLocalStorage('skillDrinks', skillDrinksInitialState),
    activePage: tryLocalStorage('activePage', activePageInitialState),
    targetLevels: tryLocalStorage('targetLevels', targetLevelsInitialState),
    targetActions: tryLocalStorage('targetActions', targetActionsInitialState),
    communityBuff: tryLocalStorage('communityBuff', communityBuffInitialState),
    house: tryLocalStorage('house', houseInitialState),
    currentXp: tryLocalStorage('currentXp', currentXpInitialState),
    actionQueue: tryLocalStorage('actionQueue', actionQueueInitialState)
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
