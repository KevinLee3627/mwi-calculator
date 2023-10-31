import { useMemo } from 'react';
import { GameIcon } from 'src/old/components/GameIcon';
import { Select } from 'src/old/components/Select';
import { NonCombatActionTypeHrid } from 'src/old/core/actions/NonCombatActionTypeHrid';
import { clientData } from 'src/old/core/clientData';
import {
  selectSkillDrinks,
  setSkillDrinks
} from 'src/old/features/skill/drinks/drinksSlice';
import { useAppDispatch } from 'src/old/hooks/useAppDispatch';
import { useAppSelector } from 'src/old/hooks/useAppSelector';

interface SkillDrinksSelectProps {
  actionTypeHrid: NonCombatActionTypeHrid;
}

export function SkillDrinksSelect({ actionTypeHrid }: SkillDrinksSelectProps) {
  // TODO: Consider extracting out logic to separate file, maybe mapping between
  // drinks and which skills can use X drink?
  // Only return usable drinks for the chosen skill
  const skillDrinks = useAppSelector(selectSkillDrinks);
  const dispatch = useAppDispatch();

  const drinkChoices = useMemo(() => {
    return Object.values(clientData.itemDetailMap).filter(
      (item) =>
        item.categoryHrid === '/item_categories/drink' &&
        item.consumableDetail.usableInActionTypeMap != null &&
        item.consumableDetail.usableInActionTypeMap[actionTypeHrid] === true
    );
  }, [actionTypeHrid]);

  const drinkIcons = skillDrinks[actionTypeHrid]?.map((drink) => {
    const drinkHridStripped = drink.hrid.replace('/items/', '');
    return (
      <GameIcon
        key={drinkHridStripped}
        svgSetName="items"
        iconName={drinkHridStripped ?? ''}
      />
    );
  });
  return (
    <div className="form-control">
      <label className="label">
        <span className="label-text">
          Drinks
          {drinkIcons}
        </span>
      </label>
      <Select
        isMulti
        options={drinkChoices.map((drink) => ({ label: drink.name, value: drink }))}
        value={
          skillDrinks[actionTypeHrid]?.map((drink) => ({
            label: drink.name,
            value: drink
          })) ?? []
        }
        onChange={(selected) => {
          dispatch(
            setSkillDrinks({ actionTypeHrid, drinks: selected.map((v) => v.value) })
          );
        }}
        filterOption={(option) => {
          return !skillDrinks[actionTypeHrid]?.some(
            (drink) => drink.hrid === option.data.value.hrid
          );
        }}
        isOptionDisabled={() => (skillDrinks[actionTypeHrid] ?? []).length >= 3}
      />
    </div>
  );
}
