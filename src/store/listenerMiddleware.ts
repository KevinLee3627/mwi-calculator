import { createListenerMiddleware, isAnyOf } from '@reduxjs/toolkit';
import { activeSkillSlice } from 'src/features/activeSkillSlice';
import { characterLevelsSlice } from 'src/features/character/levels/characterLevelsSlice';
import { loadoutSlice } from 'src/features/character/loadout/loadoutSlice';
import { communityBuffSlice } from 'src/features/communityBuff/communityBuffSlice';
import { houseSlice } from 'src/features/house/houseSlice';
// import { actionQueueSlice } from 'src/old/features/queue/actionQueueSlice';
// import { skillDrinksSlice } from 'src/old/features/skill/drinks/drinksSlice';
// import { targetLevelSlice } from 'src/old/features/skill/targets/targetLevelSlice';
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

// export const skillDrinksListenerMiddleware = createListenerMiddleware();
// skillDrinksListenerMiddleware.startListening({
//   actionCreator: skillDrinksSlice.actions.setSkillDrinks,
//   effect: () => {
//     localStorage.setItem('skillDrinks', JSON.stringify(store.getState().skillDrinks));
//   }
// });

export const activeSkillListenerMiddleware = createListenerMiddleware();
activeSkillListenerMiddleware.startListening({
  actionCreator: activeSkillSlice.actions.setActiveSkill,
  effect: () => {
    localStorage.setItem('activeSkill', JSON.stringify(store.getState().activeSkill));
  }
});

// export const targetLevelListenerMiddleware = createListenerMiddleware();
// targetLevelListenerMiddleware.startListening({
//   actionCreator: targetLevelSlice.actions.setTargetLevel,
//   effect: () => {
//     localStorage.setItem('targetLevel', JSON.stringify(store.getState().targetLevel));
//   }
// });

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

// export const actionQueueListenerMiddleware = createListenerMiddleware();
// actionQueueListenerMiddleware.startListening({
//   matcher: isAnyOf(
//     actionQueueSlice.actions.createActionQueueEntry,
//     actionQueueSlice.actions.updateActionType,
//     actionQueueSlice.actions.updateActionHrid,
//     actionQueueSlice.actions.updateNumActions,
//     actionQueueSlice.actions.deleteActionQueueEntry,
//     actionQueueSlice.actions.reorderActionQueue
//   ),
//   effect: (action) => {
//     console.log('saved', action);
//     localStorage.setItem('actionQueue', JSON.stringify(store.getState().actionQueue));
//   }
// });
