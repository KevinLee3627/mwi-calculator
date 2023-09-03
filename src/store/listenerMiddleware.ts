import { createListenerMiddleware, isAnyOf } from '@reduxjs/toolkit';
import { characterEnhancementSlice } from 'src/features/character/enhancements/characterEnhancementSlice';
import { characterEquipmentSlice } from 'src/features/character/equipment/characterEquipmentSlice';
import { characterLevelSlice } from 'src/features/character/levels/characterLevelSlice';
import { skillDrinksSlice } from 'src/features/skill/drinks/drinksSlice';
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

export const characterEquipmentListenerMiddleware = createListenerMiddleware();
characterEquipmentListenerMiddleware.startListening({
  matcher: isAnyOf(
    characterEquipmentSlice.actions.setEquipment,
    characterEquipmentSlice.actions.resetEquipment
  ),
  effect: (action) => {
    if (action.type === 'characterEquipment/setEquipment') {
      localStorage.setItem(
        'characterEquipment',
        JSON.stringify(store.getState().characterEquipment)
      );
    } else if (action.type === 'characterEquipment/resetEquipment') {
      localStorage.removeItem('characterEquipment');
    }
  }
});

export const characterEnhancementListenerMiddleware = createListenerMiddleware();
characterEnhancementListenerMiddleware.startListening({
  actionCreator: characterEnhancementSlice.actions.setEnhancementLevel,
  effect: () => {
    localStorage.setItem(
      'characterEnhancement',
      JSON.stringify(store.getState().characterEnhancement)
    );
  }
});

export const skillDrinksListenerMiddleware = createListenerMiddleware();
skillDrinksListenerMiddleware.startListening({
  actionCreator: skillDrinksSlice.actions.setSkillDrinks,
  effect: () => {
    localStorage.setItem('skillDrinks', JSON.stringify(store.getState().skillDrinks));
  }
});

skillDrinksSlice;
