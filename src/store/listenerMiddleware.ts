import { createListenerMiddleware, isAnyOf } from '@reduxjs/toolkit';
import { characterLevelSlice } from 'src/features/character/levels/characterLevelSlice';
import { loadoutSlice } from 'src/features/character/loadouts/loadoutSlice';
import { communityBuffSlice } from 'src/features/communityBuff/communityBuffSlice';
import { activeSkillSlice } from 'src/features/navigation/activeSkillSlice';
import { actionQueueSlice } from 'src/features/queue/actionQueueSlice';
import { skillDrinksSlice } from 'src/features/skill/drinks/drinksSlice';
import { targetLevelSlice } from 'src/features/skill/targets/targetLevelSlice';
import { store } from 'src/store/store';

export const characterLevelListenerMiddleware = createListenerMiddleware();
characterLevelListenerMiddleware.startListening({
  actionCreator: characterLevelSlice.actions.setLevel,
  effect: () => {
    localStorage.setItem(
      'characterLevel',
      JSON.stringify(store.getState().characterLevel)
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

export const activeSkillListenerMiddleware = createListenerMiddleware();
activeSkillListenerMiddleware.startListening({
  actionCreator: activeSkillSlice.actions.setActiveSkill,
  effect: () => {
    localStorage.setItem('activeSkill', JSON.stringify(store.getState().activeSkill));
  }
});

export const targetLevelListenerMiddleware = createListenerMiddleware();
targetLevelListenerMiddleware.startListening({
  actionCreator: targetLevelSlice.actions.setTargetLevel,
  effect: () => {
    localStorage.setItem('targetLevel', JSON.stringify(store.getState().targetLevel));
  }
});

export const communityBuffListenerMiddleware = createListenerMiddleware();
communityBuffListenerMiddleware.startListening({
  actionCreator: communityBuffSlice.actions.setBuffLevel,
  effect: () => {
    localStorage.setItem('communityBuff', JSON.stringify(store.getState().communityBuff));
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
