import { createListenerMiddleware, isAnyOf } from '@reduxjs/toolkit';
import { characterLevelSlice } from 'src/features/character/levels/characterLevelSlice';
import { loadoutSlice } from 'src/features/character/loadouts/loadoutSlice';
import { activeSkillSlice } from 'src/features/navigation/activeSkillSlice';
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

// export const characterEnhancementListenerMiddleware = createListenerMiddleware();
// characterEnhancementListenerMiddleware.startListening({
//   actionCreator: characterEnhancementSlice.actions.setEnhancementLevel,
//   effect: (action) => {
//     if (action.type === 'characterEnhancement/setEnhancementLevel') {
//       localStorage.setItem(
//         'characterEnhancement',
//         JSON.stringify(store.getState().characterEnhancement)
//       );
//     } else if (action.type === 'characterEnhancement/resetEnhancementLevels') {
//       localStorage.removeItem('characterEnhancement');
//     }
//   }
// });

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
