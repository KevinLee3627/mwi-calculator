import { BuffTypeHrid } from 'src/core/hrid/BuffTypeHrid';
import { NonCombatSkillHrid } from 'src/core/skills/NonCombatSkillHrid';
import { SkillDrinksState } from 'src/features/drinks/drinksSlice';
import { skillHridToActionTypeHrid } from 'src/util/skillHridToActionTypeHridMapping';

export function computeDrinkStats(
  drinksState: SkillDrinksState,
  skillHrid: NonCombatSkillHrid
) {
  const actionTypeHrid = skillHridToActionTypeHrid[skillHrid];
  // organize buffs given and their values
  const drinks = drinksState[actionTypeHrid];
  // TODO: How to handle error?
  if (drinks == null) return {} as Record<BuffTypeHrid, number>;

  const x = drinks.reduce<Record<string, number>>((acc, drink) => {
    // For each drink, add buffs to map
    if (drink.consumableDetail.buffs == null) return acc;

    drink.consumableDetail.buffs.forEach((buff) => {
      if (acc[buff.typeHrid] == null) acc[buff.typeHrid] = 0;
      acc[buff.typeHrid] += buff.flatBoost;
    });
    return acc;
  }, {}) as Record<BuffTypeHrid, number>;
  return x;
}
