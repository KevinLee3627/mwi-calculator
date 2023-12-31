import { createListenerMiddleware, isAnyOf } from '@reduxjs/toolkit';
import { activePageSlice } from 'src/features/activePageSlice';
import { characterLevelsSlice } from 'src/features/character/levels/characterLevelsSlice';
import { loadoutSlice } from 'src/features/character/loadout/loadoutSlice';
import { communityBuffSlice } from 'src/features/communityBuff/communityBuffSlice';
import { currentXpSlice } from 'src/features/currentXpSlice';
import { skillDrinksSlice } from 'src/features/drinks/drinksSlice';
import { houseSlice } from 'src/features/house/houseSlice';
import { actionQueueSlice } from 'src/features/queue/actionQueueSlice';
import { targetActionsSlice } from 'src/features/targetActionsSlice';
import { targetLevelsSlice } from 'src/features/targetLevelSlice';
import { store } from 'src/store/store';

export const characterLevelsListenerMiddleware = createListenerMiddleware();
characterLevelsListenerMiddleware.startListening({
  actionCreator: characterLevelsSlice.actions.setLevel,
  effect: () => {
    localStorage.setItem(
      'characterLevels',
      JSON.stringify(store.getState().characterLevels)
    );
  }
});

export const loadoutListenerMiddleware = createListenerMiddleware();
loadoutListenerMiddleware.startListening({
  matcher: isAnyOf(
    loadoutSlice.actions.setEquip,
    loadoutSlice.actions.clearEquip,
    loadoutSlice.actions.createLoadout,
    loadoutSlice.actions.setActiveLoadout,
    loadoutSlice.actions.resetLoadout,
    loadoutSlice.actions.deleteLoadout,
    loadoutSlice.actions.renameLoadout,
    loadoutSlice.actions.resetLoadout,
    loadoutSlice.actions.setEnhancementLevel
  ),
  effect: () => {
    localStorage.setItem('loadout', JSON.stringify(store.getState().loadout));
  }
});

export const skillDrinksListenerMiddleware = createListenerMiddleware();
skillDrinksListenerMiddleware.startListening({
  actionCreator: skillDrinksSlice.actions.setSkillDrinks,
  effect: () => {
    localStorage.setItem('skillDrinks', JSON.stringify(store.getState().skillDrinks));
  }
});

export const activePageListenerMiddleware = createListenerMiddleware();
activePageListenerMiddleware.startListening({
  actionCreator: activePageSlice.actions.setActivePage,
  effect: () => {
    localStorage.setItem('activePage', JSON.stringify(store.getState().activePage));
  }
});

export const targetLevelsListenerMiddleware = createListenerMiddleware();
targetLevelsListenerMiddleware.startListening({
  actionCreator: targetLevelsSlice.actions.setTargetLevel,
  effect: () => {
    localStorage.setItem('targetLevels', JSON.stringify(store.getState().targetLevels));
  }
});

export const targetActionsListenerMiddleware = createListenerMiddleware();
targetActionsListenerMiddleware.startListening({
  actionCreator: targetActionsSlice.actions.setTargetAction,
  effect: () => {
    localStorage.setItem('targetActions', JSON.stringify(store.getState().targetActions));
  }
});

export const communityBuffListenerMiddleware = createListenerMiddleware();
communityBuffListenerMiddleware.startListening({
  actionCreator: communityBuffSlice.actions.setBuffLevel,
  effect: () => {
    localStorage.setItem('communityBuff', JSON.stringify(store.getState().communityBuff));
  }
});

export const houseListenerMiddleware = createListenerMiddleware();
houseListenerMiddleware.startListening({
  actionCreator: houseSlice.actions.setRoomLevel,
  effect: () => {
    localStorage.setItem('house', JSON.stringify(store.getState().house));
  }
});

export const currentXpListenerMiddleware = createListenerMiddleware();
currentXpListenerMiddleware.startListening({
  actionCreator: currentXpSlice.actions.setSkillXp,
  effect: () => {
    localStorage.setItem('currentXp', JSON.stringify(store.getState().currentXp));
  }
});

export const actionQueueListenerMiddleware = createListenerMiddleware();
actionQueueListenerMiddleware.startListening({
  matcher: isAnyOf(
    actionQueueSlice.actions.createActionQueueEntry,
    actionQueueSlice.actions.updateActionType,
    actionQueueSlice.actions.updateActionHrid,
    actionQueueSlice.actions.updateNumActions,
    actionQueueSlice.actions.deleteActionQueueEntry,
    actionQueueSlice.actions.reorderActionQueue
  ),
  effect: (action) => {
    console.log('saved', action);
    localStorage.setItem('actionQueue', JSON.stringify(store.getState().actionQueue));
  }
});
