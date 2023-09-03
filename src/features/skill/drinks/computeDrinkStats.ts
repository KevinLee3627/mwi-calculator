import { NonCombatActionTypeHrid } from 'src/core/actions/NonCombatActionTypeHrid';
import { BuffTypeHrid } from 'src/core/hrid/BuffTypeHrid';
import { SkillDrinksState } from 'src/features/skill/drinks/drinksSlice';

export function computeDrinkStats(
  drinksState: SkillDrinksState,
  actionTypeHrid: NonCombatActionTypeHrid
) {
  // organize buffs given and their values
  const drinks = drinksState[actionTypeHrid];
  // TODO: How to handle error?
  if (drinks == null) return {} as Record<BuffTypeHrid, number>;

  const x = drinks.reduce<Record<string, number>>((acc, drink) => {
    // For each drink, add buffs to map
    drink.consumableDetail.buffs?.forEach((buff) => {
      if (acc[buff.typeHrid] == null) acc[buff.typeHrid] = 0;
      acc[buff.typeHrid] += buff.flatBoost;
    });
    return acc;
  }, {}) as Partial<Record<BuffTypeHrid, number>>;
  return x;
}
