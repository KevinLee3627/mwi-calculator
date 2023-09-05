import { createListenerMiddleware, isAnyOf } from '@reduxjs/toolkit';
import { characterEnhancementSlice } from 'src/features/character/enhancements/characterEnhancementSlice';
import { characterEquipmentSlice } from 'src/features/character/equipment/characterEquipmentSlice';
import { characterLevelSlice } from 'src/features/character/levels/characterLevelSlice';
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

export const characterEquipmentListenerMiddleware = createListenerMiddleware();
characterEquipmentListenerMiddleware.startListening({
  matcher: isAnyOf(
    characterEquipmentSlice.actions.setEquipment,
    characterEquipmentSlice.actions.resetAllEquipment
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
  effect: (action) => {
    if (action.type === 'characterEnhancement/setEnhancementLevel') {
      localStorage.setItem(
        'characterEnhancement',
        JSON.stringify(store.getState().characterEnhancement)
      );
    } else if (action.type === 'characterEnhancement/resetEnhancementLevels') {
      localStorage.removeItem('characterEnhancement');
    }
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
