import { useState } from 'react';
import { clientData } from 'src/core/clientData';
import { ItemHrid } from 'src/core/hrid/ItemHrid';
import { InputItem } from 'src/core/items/InputItem';
import { ItemDetail } from 'src/core/items/ItemDetail';
import { computeEquipmentStats } from 'src/features/character/equipment/computeEquipmentStats';
import { CharacterLevelState } from 'src/features/character/levels/characterLevelSlice';
import { Market } from 'src/features/market/Market';
import { useGetMedianMarketDataQuery } from 'src/features/market/services/market';
import { computeDrinkStats } from 'src/features/skill/drinks/computeDrinkStats';
import { findLastIndex } from 'src/util/findLastIndex';
import { range } from 'src/util/range';
interface EnhancingTableProps {
  equipmentStats: ReturnType<typeof computeEquipmentStats>;
  drinkStats: ReturnType<typeof computeDrinkStats>;
  characterLevels: CharacterLevelState;
  itemToEnhance: ItemDetail;
  targetLevel: number;
}

export function EnhancingTable({
  equipmentStats,
  drinkStats,
  characterLevels,
  itemToEnhance,
  targetLevel
}: EnhancingTableProps) {
  const [overrides, setOverrides] = useState<Partial<Record<ItemHrid, number>>>();

  const { data: marketData, error, isLoading } = useGetMedianMarketDataQuery('');
  if (error || isLoading || marketData == null) return <div>Error getting market</div>;

  const market = new Market(marketData);

  const characterEnhancingLevel = characterLevels['/skills/enhancing'];
  const enhancingTeaLevelBonus = drinkStats['/buff_types/enhancing_level'] ?? 0;
  const effectiveEnhancingLevel = characterEnhancingLevel + enhancingTeaLevelBonus;
  const toolBonus = equipmentStats.enhancingSuccess;

  // binomial distribution stuff? been too long since I took any stats...

  // Credit for math code goes to https://github.com/tristo7/cowculator/
  // HELP: If anyone would like to help explain the math behind this code
  // I would really appreciate it...

  const FAIL_XP = 0.1;
  const TARGET_COL = range(0, 21 - 1);
  const actionTimer =
    (clientData.actionDetailMap['/actions/enhancing/enhance'].baseTimeCost / 1000000000) *
    Math.min(
      1,
      1 /
        (1 +
          (effectiveEnhancingLevel - itemToEnhance.itemLevel) / 100 +
          (equipmentStats.enhancingSpeed ?? 0))
    );

  function X(N: number) {
    // This is the probability of hitting when your equipment is at level N
    // for example, table[0] = 0.5 = 50%, which is the chance to 'hit'
    // when your item is at +0 !!!
    const baseSuccessRate = clientData.enhancementLevelSuccessRateTable[N];

    const rest =
      Math.min((effectiveEnhancingLevel / itemToEnhance.itemLevel + 1) / 2, 1) +
      toolBonus +
      0.0005 * Math.max(effectiveEnhancingLevel - itemToEnhance.itemLevel, 0);
    return baseSuccessRate * rest;
  }

  function Z(N: number) {
    if (N <= 0) {
      return 1 - X(0);
    } else if (N === 1) {
      return (1 - X(N)) * X(N - 1);
    }
    // Factorial of function X()
    return (
      (1 - X(N)) *
      range(0, N - 1)
        .map((i) => X(i))
        .reduce((acc, val) => acc * val)
    );
  }

  function S(N: number) {
    if (N <= 0) {
      return 1 - X(N);
    } else if (N === 1) {
      // This is the probability of hitting when your equipment is at level N
      // for example, table[0] = 0.5 = 50%, which is the chance to 'hit'
      // when your item is at +0 !!!
      return X(N - 1);
    }

    // Factorial of function X, again
    return range(0, N - 1)
      .map((i) => X(i))
      .reduce((acc, val) => acc * val);
  }

  // ??? Why
  function T(N: number) {
    return N + 1;
  }

  const costPerEnhance =
    itemToEnhance.enhancementCosts?.reduce((acc, val) => {
      const enhancementItemCost =
        overrides?.[val.itemHrid] ?? market.getApproxValue(val.itemHrid);

      return acc + enhancementItemCost * val.count;
    }, 0) ?? 1;

  const extraProtectionItems: InputItem[] =
    itemToEnhance.protectionItemHrids?.map((hrid) => ({
      count: 1,
      itemHrid: hrid
    })) ?? [];
  const protectionItems: InputItem[] = [
    // TODO: casting :(
    { count: 1, itemHrid: itemToEnhance.hrid } as InputItem,
    { count: 1, itemHrid: '/items/mirror_of_protection' },
    ...extraProtectionItems
  ];

  const protectionCost = /* protCostOverride || */ protectionItems.reduce((acc, val) => {
    const cost = market?.getApproxValue(val.itemHrid) ?? -1;
    if (acc === -1 || cost < acc) return cost;
    return acc;
  }, -1);

  const pCol = TARGET_COL.map((val) => (val === 0 ? 0 : X(val - 1)));
  const sCol = TARGET_COL.map((val) => S(val));
  const zCol = TARGET_COL.map((val) => Z(val));
  const tCol = TARGET_COL.map((val) => T(val));
  const costCol = TARGET_COL.reduce<number[]>((acc, _val, i) => {
    if (i === 0) return [0];
    const prev =
      acc.reduce((sum, _, j) => sum + zCol[TARGET_COL[j]] * tCol[TARGET_COL[j]], 0) +
      sCol[i] * tCol[i - 1];

    const cost = (prev / sCol[i]) * costPerEnhance;
    acc.push(cost);
    return acc;
  }, []);

  const inflectionCol = TARGET_COL.reduce<number[]>((acc, val) => {
    if (val <= 1) {
      acc.push(costCol[val]);
    } else {
      const back = acc[acc.length - 1];
      const back2 = acc[acc.length - 2];

      const one = protectionCost * (1 - pCol[val]) + costPerEnhance;
      const two = (1 - pCol[val]) * back2;
      const newValue = Math.min(costCol[val], (back + one - two) / pCol[val]);
      acc.push(newValue);
    }
    return acc;
  }, []);

  const protLevel = findLastIndex(costCol, (val, i) => val <= inflectionCol[i]);
  const actionsCol = TARGET_COL.reduce<number[]>((acc, x) => {
    if (x <= protLevel) {
      acc.push(costCol[x] / costPerEnhance);
    } else {
      const back = acc[acc.length - 1];
      const back2 = acc[acc.length - 2];
      acc.push((back + 1 - (1 - pCol[x]) * back2) / pCol[x]);
    }
    return acc;
  }, []);

  const protUsedCol = TARGET_COL.map(
    (x) => (inflectionCol[x] - actionsCol[x] * costPerEnhance) / protectionCost
  );

  const criticalCol = TARGET_COL.reduce<number[]>((acc, val) => {
    const blessedBonus = drinkStats['/buff_types/blessed'] ?? 0;
    if (val <= 1 || blessedBonus === 0) {
      acc.push(1);
    } else {
      const back = acc[acc.length - 1];
      const teaInvert = 1 - blessedBonus;
      const thing =
        (Math.pow(teaInvert, 2) +
          blessedBonus * teaInvert * (1 - pCol[val]) +
          blessedBonus / pCol[val - 1]) *
        back;
      acc.push(thing);
    }
    return acc;
  }, []);

  const expectedCostCol = TARGET_COL.map((x) => inflectionCol[x] / criticalCol[x]);
  const cost = expectedCostCol[targetLevel];
  const sample = range(0, clientData.enhancementLevelSuccessRateTable.length - 1);

  const averageEnhanceXp =
    (sample.map((i) => S(i) * i + Z(i) * (i + 1) * FAIL_XP).reduce((a, b) => a + b) /
      sample.map((i) => Z(i) * T(i)).reduce((a, b) => a + b)) *
    1.5 *
    (itemToEnhance.itemLevel + 10) *
    (drinkStats['/buff_types/wisdom'] ?? 1);

  // console.table({ x1: X(1), z0: Z(0), z1: Z(1), z5: Z(5), s0: S(0), s1: S(1), s5: S(5) });

  const protectionItemRows = protectionItems.map((x) => {
    const marketItem = clientData.itemDetailMap[x.itemHrid];
    return (
      <tr key={marketItem.hrid}>
        <td>{marketItem.name}</td>
        <td>{market.getEntry(marketItem.hrid).ask}</td>
        <td>{market.getEntry(marketItem.hrid).bid}</td>
        <td>{marketItem.sellPrice}</td>
      </tr>
    );
  });

  const marketRows = itemToEnhance?.enhancementCosts?.map((x) => {
    if (x.itemHrid === '/items/coin') {
      return (
        <tr key={'override/enhancing/' + x.itemHrid}>
          <td>Coin</td>
          <td>{x.count}</td>
          <td colSpan={3} />
          <td>1</td>
          <td>{actionsCol[targetLevel] * x.count}</td>
        </tr>
      );
    }

    const marketItem = clientData.itemDetailMap[x.itemHrid];
    const enhancementItemCost =
      overrides?.[x.itemHrid] ?? market.getApproxValue(x.itemHrid);

    return (
      <tr key={'override/enhancing/' + x.itemHrid}>
        <td>{marketItem.name}</td>
        <td>{x.count}</td>
        <td>{market.getEntry(marketItem.hrid).ask}</td>
        <td>{market.getEntry(marketItem.hrid).bid}</td>
        <td>
          <input
            className="input-primary input"
            type="text"
            value={enhancementItemCost.toString()}
            onChange={(e) => {
              const overrideVal = e.target.value;
              setOverrides((value) => {
                if (value != null) return { ...value, [marketItem.hrid]: overrideVal };
                else return {};
              });
            }}
          />
        </td>
        <td>{actionsCol[targetLevel] * x.count}</td>
      </tr>
    );
  });

  return (
    <div>
      <div className="w-6/12 bg-base-100 p-4 shadow-xl">
        <h2 className="card-title">Results</h2>
        <table className="table">
          <tbody>
            <tr className="hover">
              <th>Time/Action (s)</th>
              <td>{actionTimer}</td>
            </tr>
            <tr className="hover">
              <th>Avg XP/Action</th>
              <td>{averageEnhanceXp.toFixed(2)}</td>
            </tr>
            <tr className="hover">
              <th>XP/hr</th>
              <td>{(averageEnhanceXp * 3600) / actionTimer}</td>
            </tr>
            <tr className="hover">
              <th>Protection Level</th>
              <td>{protLevel}</td>
            </tr>
            <tr className="hover">
              <th>Protections Used</th>
              <td>{protUsedCol[targetLevel].toFixed(2)}</td>
            </tr>
            <tr className="hover">
              <th>Average Actions</th>
              <td>{Math.ceil(actionsCol[targetLevel])}</td>
            </tr>
            <tr className="hover">
              <th>Average Time</th>
              <td>{(actionsCol[targetLevel] * actionTimer).toFixed(2)}</td>
            </tr>
            <tr className="hover">
              <th>Average Cost</th>
              <td>{cost.toFixed(2)}</td>
            </tr>
            <tr className="hover">
              <th>Average Total XP</th>
              <td>{(actionsCol[targetLevel] * averageEnhanceXp).toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>Item</th>
            <th>Count</th>
            <th>Ask</th>
            <th>Bid</th>
            <th>Value</th>
            <th>Average Used</th>
          </tr>
        </thead>
        <tbody>
          {marketRows}
          <tr>
            <th colSpan={5}>Total</th>
            <td>{costPerEnhance}</td>
            <td>lol</td>
          </tr>
        </tbody>
      </table>
      <table>
        <thead>
          <tr>
            <th>Item</th>
            <th>Ask</th>
            <th>Bid</th>
            <th>Vendor</th>
          </tr>
        </thead>
        <tbody>{protectionItemRows}</tbody>
      </table>
    </div>
  );
}
