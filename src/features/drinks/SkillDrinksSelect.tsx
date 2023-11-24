import { useMemo } from 'react';
import { ItemIcon } from 'src/components/ItemIcon';
import { Select } from 'src/components/Select';
import { clientData } from 'src/core/clientData';
import { SkillHrid } from 'src/core/hrid/SkillHrid';
import { selectSkillDrinks, setSkillDrinks } from 'src/features/drinks/drinksSlice';
import { useAppDispatch } from 'src/hooks/useAppDispatch';
import { useAppSelector } from 'src/hooks/useAppSelector';
import { skillHridToActionTypeHrid } from 'src/util/skillHridToActionTypeHridMapping';

interface SkillDrinksSelectProps {
  skillHrid: SkillHrid;
}

export function SkillDrinksSelect({ skillHrid }: SkillDrinksSelectProps) {
  // TODO: Consider extracting out logic to separate file, maybe mapping between
  // drinks and which skills can use X drink?
  // Only return usable drinks for the chosen skill
  const skillDrinks = useAppSelector(selectSkillDrinks);
  const dispatch = useAppDispatch();

  const actionTypeHrid = skillHridToActionTypeHrid[skillHrid];
  const drinkChoices = useMemo(() => {
    return Object.values(clientData.itemDetailMap).filter(
      (item) =>
        item.categoryHrid === '/item_categories/drink' &&
        item.consumableDetail.usableInActionTypeMap != null &&
        item.consumableDetail.usableInActionTypeMap[actionTypeHrid] === true
    );
  }, [actionTypeHrid]);

  const drinkIcons = skillDrinks[actionTypeHrid]?.map((drink) => {
    return <ItemIcon key={drink.hrid} itemHrid={drink.hrid} />;
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
