import { configureStore } from '@reduxjs/toolkit';
// import {
//   characterLevelInitialState,
//   characterLevelSlice
// } from 'src/old/features/character/levels/characterLevelSlice';
// import {
//   loadoutInitialState,
//   loadoutSlice
// } from 'src/old/features/character/loadouts/loadoutSlice';
// import {
//   communityBuffInitialState,
//   communityBuffSlice
// } from 'src/old/features/communityBuff/communityBuffSlice';
// import { marketApi } from 'src/old/features/market/services/market';
// import {
//   activeSkillInitialState,
//   activeSkillSlice
// } from 'src/old/features/navigation/activeSkillSlice';
// import {
//   actionQueueInitialState,
//   actionQueueSlice
// } from 'src/old/features/queue/actionQueueSlice';
// import {
//   skillDrinksInitialState,
//   skillDrinksSlice
// } from 'src/old/features/skill/drinks/drinksSlice';
// import {
//   targetLevelInitialState,
//   targetLevelSlice
// } from 'src/old/features/skill/targets/targetLevelSlice';
// import {
//   actionQueueListenerMiddleware,
//   activeSkillListenerMiddleware,
//   characterLevelListenerMiddleware,
//   communityBuffListenerMiddleware,
//   loadoutListenerMiddleware,
//   skillDrinksListenerMiddleware,
//   targetLevelListenerMiddleware
// } from 'src/store/listenerMiddleware';

const tryLocalStorage = (key: string, fallback: object) =>
  localStorage.getItem(key) != null
    ? JSON.parse(localStorage.getItem(key) as string)
    : fallback;

export const store = configureStore({
  reducer: {
    // characterLevel: characterLevelSlice.reducer,
    // loadout: loadoutSlice.reducer,
    // skillDrinks: skillDrinksSlice.reducer,
    // activeSkill: activeSkillSlice.reducer,
    // targetLevel: targetLevelSlice.reducer,
    // communityBuff: communityBuffSlice.reducer,
    // actionQueue: actionQueueSlice.reducer,
    // [marketApi.reducerPath]: marketApi.reducer
  },
  middleware: (getDefaultMiddleware) => [
    ...getDefaultMiddleware()
    // characterLevelListenerMiddleware.middleware,
    // loadoutListenerMiddleware.middleware,
    // skillDrinksListenerMiddleware.middleware,
    // activeSkillListenerMiddleware.middleware,
    // targetLevelListenerMiddleware.middleware,
    // communityBuffListenerMiddleware.middleware,
    // actionQueueListenerMiddleware.middleware,
    // marketApi.middleware
  ]
  // preloadedState: {
  //   characterLevel: tryLocalStorage('characterLevel', characterLevelInitialState),
  //   loadout: tryLocalStorage('loadout', loadoutInitialState),
  //   skillDrinks: tryLocalStorage('skillDrinks', skillDrinksInitialState),
  //   activeSkill: tryLocalStorage('activeSkill', activeSkillInitialState),
  //   targetLevel: tryLocalStorage('targetLevel', targetLevelInitialState),
  //   communityBuff: tryLocalStorage('communityBuff', communityBuffInitialState),
  //   actionQueue: tryLocalStorage('actionQueue', actionQueueInitialState)
  // }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
