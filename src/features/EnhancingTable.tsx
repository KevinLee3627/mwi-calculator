import { useMemo, useState } from 'react';
import { Select } from 'src/components/Select';
import { clientData } from 'src/core/clientData';
import { ItemHrid } from 'src/core/hrid/ItemHrid';
import { InputItem } from 'src/core/items/InputItem';
import { computeCommunityBuffStats } from 'src/features/calculations/computeCommunityBuffStats';
import { computeDrinkStats } from 'src/features/calculations/computeDrinkStats';
import { computeEnhancingSpeed } from 'src/features/calculations/computeEnhancingSpeed';
import { computeEquipmentStats } from 'src/features/calculations/computeEquipmentStats';
import { Market } from 'src/features/market/Market';
import { useGetMedianMarketDataQuery } from 'src/features/market/marketApi';
import { useStats } from 'src/hooks/useStats';
import { formatNumber } from 'src/util/formatNumber';
import { range } from 'src/util/range';

export function EnhancingTable() {
  const enhanceItemChoices = useMemo(
    () =>
      Object.values(clientData.itemDetailMap)
        .filter((item) => item.enhancementCosts != null)
        .map((item) => ({
          label: item.name,
          value: item.hrid
        })),
    []
  );

  const [targetLevel, setTargetLevel] = useState(1);
  const [chosenItem, setChosenItem] = useState<ItemHrid>('/items/cheese_pot');
  const itemToEnhance = clientData.itemDetailMap[chosenItem];

  const { communityBuffs, characterLevels, activeLoadout, drinks } = useStats();

  const equipmentStats = computeEquipmentStats(activeLoadout);
  const drinkStats = computeDrinkStats(drinks, '/skills/enhancing');

  const [itemOverrides, setItemOverrides] = useState<Partial<Record<ItemHrid, number>>>();
  const [protOverride, setProtOverride] = useState<number>();
  const {
    data: marketData,
    error,
    isLoading
  } = useGetMedianMarketDataQuery('', { pollingInterval: 1000 * 60 * 30 });

  const market = useMemo(() => {
    if (isLoading || error || marketData == null) return null;
    else return new Market(marketData.market);
  }, [marketData, isLoading, error]);

  const characterEnhancingLevel = characterLevels['/skills/enhancing'];
  const enhancingTeaLevelBonus = drinkStats['/buff_types/enhancing_level'] ?? 0;
  const effectiveEnhancingLevel = characterEnhancingLevel + enhancingTeaLevelBonus;
  const toolBonus = equipmentStats.enhancingSuccess ?? 0;

  // binomial distribution stuff? been too long since I took any stats...

  // Credit for math code goes to https://github.com/tristo7/cowculator/
  // HELP: If anyone would like to help explain the math behind this code
  // I would really appreciate it...

  const FAIL_XP = 0.1;
  const TARGET_COL = range(0, 21 - 1);
  const actionTimer = computeEnhancingSpeed({
    enhancingLevel: effectiveEnhancingLevel,
    itemLevel: itemToEnhance.itemLevel,
    equipmentStats,
    communityBuffStats: computeCommunityBuffStats(communityBuffs)
  });

  // TODO: Move function definitions out of component?
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
      const override = itemOverrides?.[val.itemHrid];
      if (override != null) return acc + override * val.count;
      const vendorPrice = clientData.itemDetailMap[val.itemHrid].sellPrice;
      const enhancementItemCost = market
        ? market.getItemPrice(val.itemHrid)
        : vendorPrice;

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

  const protectionCost = protectionItems.reduce((acc, val) => {
    const vendorPrice = clientData.itemDetailMap[val.itemHrid].sellPrice;
    const marketPrice = market ? market.getItemPrice(val.itemHrid) : vendorPrice;
    const cost = protOverride ?? marketPrice;
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

  // const protLevel = findLastIndex(costCol, (val, i) => val <= inflectionCol[i]);
  const protLevel = costCol.findLastIndex((val, i) => val <= inflectionCol[i]);
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
    (1 + (drinkStats['/buff_types/wisdom'] ?? 0));

  const protectionItemRows = protectionItems.map((x) => {
    const marketItem = clientData.itemDetailMap[x.itemHrid];
    const marketPrices = market?.getItem(x.itemHrid);
    return (
      <tr key={marketItem.hrid} className="hover">
        <td>{marketItem.name}</td>
        <td>{marketPrices?.ask ?? 'N/A'}</td>
        <td>{marketPrices?.bid ?? 'N/A'}</td>
        <td>{marketItem.sellPrice}</td>
      </tr>
    );
  });

  const marketRows = itemToEnhance?.enhancementCosts?.map((x) => {
    if (x.itemHrid === '/items/coin') {
      return (
        <tr key={'override/enhancing/' + x.itemHrid} className="hover">
          <td>Coin</td>
          <td>{x.count}</td>
          <td colSpan={2} />
          <td>1</td>
          <td>{(actionsCol[targetLevel] * x.count).toFixed(2)}</td>
        </tr>
      );
    }

    const override = itemOverrides?.[x.itemHrid];
    const vendorPrice = clientData.itemDetailMap[x.itemHrid].sellPrice;
    const enhancementItemCost =
      override ?? market?.getItemPrice(x.itemHrid) ?? vendorPrice;
    const marketItem = clientData.itemDetailMap[x.itemHrid];
    // const enhancementItemCost =
    //   itemOverrides?.[x.itemHrid] ?? market?.getItemPrice(x.itemHrid);
    const marketPrices = market?.getItem(x.itemHrid);

    return (
      <tr key={'override/enhancing/' + x.itemHrid} className="hover">
        <td>{marketItem.name}</td>
        <td>{x.count}</td>
        <td>{marketPrices?.ask ?? 'N/A'}</td>
        <td>{marketPrices?.bid ?? 'N/A'}</td>
        <td>
          <input
            className="input-primary input"
            type="text"
            value={enhancementItemCost.toString()}
            onChange={(e) => {
              const overrideVal = e.target.value;
              setItemOverrides((value) => {
                if (value != null) return { ...value, [marketItem.hrid]: overrideVal };
                else return {};
              });
            }}
          />
        </td>
        <td>{(actionsCol[targetLevel] * x.count).toFixed(2)}</td>
      </tr>
    );
  });

  return (
    <>
      {error && (
        <div className="alert alert-warning mb-4">
          Market data could not be retrieved - enhancement costs are based on vendor
          prices (but can be overriden)
        </div>
      )}
      <div className="flex gap-4">
        <div className="form-control">
          <label className="label">
            <span className="label-text">Item To Enhance</span>
          </label>
          <Select
            options={enhanceItemChoices}
            value={{
              label: clientData.itemDetailMap[chosenItem].name,
              value: chosenItem
            }}
            placeholder="test"
            onChange={(selected) => {
              if (selected == null) return;
              else setChosenItem(selected.value);
            }}
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Target Level</span>
          </label>
          <Select
            options={range(1, 20).map((val) => ({ label: val.toString(), value: val }))}
            value={{ label: targetLevel?.toString() ?? '', value: targetLevel }}
            onChange={(selected) => setTargetLevel(selected?.value ?? 1)}
          />
        </div>
      </div>
      <div className="grid auto-rows-min gap-2 sm:grid-cols-2">
        <div>
          {/* Results Table */}
          <div className="card flex-col bg-neutral shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Results</h2>
              <table className="table">
                <tbody>
                  <tr className="hover">
                    <th>Time/Action (s)</th>
                    <td>{formatNumber(actionTimer)}</td>
                  </tr>
                  <tr className="hover">
                    <th>Avg XP/Action</th>
                    <td>{formatNumber(averageEnhanceXp)}</td>
                  </tr>
                  <tr className="hover">
                    <th>XP/hr</th>
                    <td>{formatNumber((averageEnhanceXp * 3600) / actionTimer)}</td>
                  </tr>
                  <tr className="hover">
                    <th>Protection Level</th>
                    <td>{protLevel}</td>
                  </tr>
                  <tr className="hover">
                    <th>Protections Used</th>
                    <td>{formatNumber(protUsedCol[targetLevel])}</td>
                  </tr>
                  <tr className="hover">
                    <th>Average Actions</th>
                    <td>{Math.ceil(actionsCol[targetLevel])}</td>
                  </tr>
                  <tr className="hover">
                    <th>Average Time</th>
                    <td>{formatNumber(actionsCol[targetLevel] * actionTimer)}</td>
                  </tr>
                  <tr className="hover">
                    <th>Average Cost</th>
                    <td>{formatNumber(cost)}</td>
                  </tr>
                  <tr className="hover">
                    <th>Average Total XP</th>
                    <td>{formatNumber(actionsCol[targetLevel] * averageEnhanceXp)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div>
          {/* Item Costs Table */}
          <div className="card mb-2 bg-neutral text-neutral-content">
            <div className="card-body">
              <h2 className="card-title text-left">Enhancement Costs</h2>
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
                    <th colSpan={4}>Total</th>
                    <td>{costPerEnhance}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          {/* Protection Costs Table */}
          <div className="card bg-neutral text-neutral-content">
            <div className="card-body">
              <h2 className="card-title text-left">Protection Costs</h2>
              <div>
                <label className="label">
                  <span className="label-text">Protection Cost</span>
                </label>
                <input
                  className="input-primary input"
                  type="text"
                  value={protectionCost.toString()}
                  onChange={(e) => {
                    const overrideVal = e.target.value;
                    setProtOverride(parseInt(overrideVal, 10));
                  }}
                />
              </div>
              <table className="table">
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
          </div>
        </div>
      </div>
    </>
  );
}
