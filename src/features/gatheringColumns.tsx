import { createColumnHelper } from '@tanstack/react-table';
import { useEffect, useRef } from 'react';
import { useMemo, useState } from 'react';
import { ItemIcon } from 'src/components/ItemIcon';
import { ActionDetail } from 'src/core/actions/ActionDetail';
import { clientData } from 'src/core/clientData';
import { ActionHrid } from 'src/core/hrid/ActionHrid';
import { ItemHrid } from 'src/core/hrid/ItemHrid';
import { NonCombatSkillHrid } from 'src/core/skills/NonCombatSkillHrid';
import { computeActionEfficiency } from 'src/features/calculations/computeActionEfficiency';
import { computeActionTime } from 'src/features/calculations/computeActionTime';
import { computeActionXp } from 'src/features/calculations/computeActionXp';
import { computeCommunityBuffStats } from 'src/features/calculations/computeCommunityBuffStats';
import { computeDrinkStats } from 'src/features/calculations/computeDrinkStats';
import { computeEquipmentStats } from 'src/features/calculations/computeEquipmentStats';
import { Market } from 'src/features/market/Market';
import { useStats } from 'src/hooks/useStats';
import { formatNumber } from 'src/util/formatNumber';
import { skillHridToActionFunctionHrid } from 'src/util/skillHridToActionFunctionHridMapping';
import { skillHridToSpeedBonus } from 'src/util/skillHridToSpeedBonusMapping';

interface UseGatheringColumnsParams {
  data: ActionDetail[];
  skillHrid: NonCombatSkillHrid;
  market: Market | null;
}

interface ActionStat {
  xp: number;
  efficiency: number;
  time: number;
  actionHrid: ActionHrid;
  xpPerHour: number;
  actionsPerSecond: number;
  actionsPerHour: number;
  dropsPerAction: { itemHrid: ItemHrid; amt: number }[];
  dropsProfitPerAction: number;
  rareDropsPerAction: { itemHrid: ItemHrid; amt: number }[];
  inputCostPerAction: number | null;
  outputItemsProfitPerAction: number | null;
}

export function useGatheringColumns({
  skillHrid,
  data,
  market
}: UseGatheringColumnsParams) {
  const actionFunctionHrid = skillHridToActionFunctionHrid[skillHrid];

  const {
    activeLoadout,
    drinks,
    communityBuffs,
    house,
    characterLevels,
    targetLevels,
    targetActions,
    currentXp
  } = useStats();

  const { equipmentStats, drinkStats, communityBuffStats } = useMemo(() => {
    const equipmentStats = computeEquipmentStats(activeLoadout);
    const drinkStats = computeDrinkStats(drinks, skillHrid);
    const communityBuffStats = computeCommunityBuffStats(communityBuffs);

    return { equipmentStats, drinkStats, communityBuffStats };
  }, [activeLoadout, drinks, skillHrid, communityBuffs]);

  const [priceOverrides, setPriceOverrides] = useState<Partial<Record<ItemHrid, number>>>(
    {}
  );

  // Reset price overrides on skill change
  useEffect(() => {
    setPriceOverrides({});
  }, [skillHrid]);

  // https://stackoverflow.com/a/67029060/6506007
  const keyToFocus = useRef<string>('');

  const actionStats = useMemo(() => {
    return data.reduce<Record<ActionHrid, ActionStat>>((acc, action) => {
      const xp = computeActionXp({
        equipmentStats,
        drinkStats,
        communityBuffStats,
        houseStats: house,
        baseXp: action.experienceGain.value
      });

      const efficiency = computeActionEfficiency({
        actionLevel: action.levelRequirement.level,
        characterLevel: characterLevels[skillHrid],
        equipmentStats,
        drinkStats,
        house,
        communityBuffStats,
        skillHrid
      });

      const toolBonus = equipmentStats[skillHridToSpeedBonus[skillHrid]] ?? 0;
      const time = computeActionTime({ baseTimeCost: action.baseTimeCost, toolBonus });

      const xpPerSecond = xp / (time / (1 + efficiency));
      const xpPerHour = xpPerSecond * 3600;

      const actionsPerSecond = 1 / (time / (1 + efficiency));
      const actionsPerHour = 3600 * actionsPerSecond;

      const teaGatheringBonus = drinkStats['/buff_types/gathering'] ?? 0;
      const equipGatheringBonus = equipmentStats['gatheringQuantity'] ?? 0;
      const communityGatheringBonus =
        communityBuffStats['/community_buff_types/gathering_quantity'] ?? 0;
      const gatheringBonus =
        teaGatheringBonus + equipGatheringBonus + communityGatheringBonus;

      const dropsPerAction = (action.dropTable ?? []).map((drop) => {
        const avgPerAction =
          ((1 + gatheringBonus) * (drop.dropRate * (drop.minCount + drop.maxCount))) / 2;
        return { itemHrid: drop.itemHrid, amt: avgPerAction };
      });

      const equipRareFindBonus = equipmentStats['skillingRareFind'] ?? 0;
      const houseRareFindBonus =
        Object.values(house).reduce((acc, val) => acc + val, 0) * 0.002;
      const rareFindBonus = equipRareFindBonus + houseRareFindBonus;

      const rareDropsPerAction = (action.rareDropTable ?? []).map((drop) => {
        const avgPerAction =
          ((1 + rareFindBonus) * (drop.dropRate * (drop.minCount + drop.maxCount))) / 2;
        return { itemHrid: drop.itemHrid, amt: avgPerAction };
      });

      const dropsProfitPerAction = dropsPerAction.reduce((acc, val) => {
        const override = priceOverrides[val.itemHrid];
        if (override != null) return acc + val.amt * override;
        if (market == null)
          return acc + val.amt * clientData.itemDetailMap[val.itemHrid].sellPrice;
        else return acc + val.amt * market.getItemPrice(val.itemHrid);
      }, 0);

      let inputCostPerAction: number | null = null;
      if (action.inputItems != null) {
        inputCostPerAction = action.inputItems.reduce((acc, val) => {
          const override = priceOverrides[val.itemHrid];
          if (override != null) return acc + val.count * override;
          if (market == null)
            return acc + val.count * clientData.itemDetailMap[val.itemHrid].sellPrice;
          else return acc + val.count * market.getItemPrice(val.itemHrid);
        }, 0);
      }

      let outputItemsProfitPerAction: number | null = null;
      if (action.outputItems != null) {
        outputItemsProfitPerAction = action.outputItems.reduce((acc, val) => {
          const override = priceOverrides[val.itemHrid];
          if (override != null) return acc + val.count * override;
          if (market == null)
            return acc + val.count * clientData.itemDetailMap[val.itemHrid].sellPrice;
          else return acc + val.count * market.getItemPrice(val.itemHrid);
        }, 0);
      }

      acc[action.hrid] = {
        actionHrid: action.hrid,
        xp,
        efficiency,
        time,
        xpPerHour,
        actionsPerSecond,
        actionsPerHour,
        dropsPerAction,
        dropsProfitPerAction,
        rareDropsPerAction,
        inputCostPerAction,
        outputItemsProfitPerAction
      };

      return acc;
    }, {} as Record<ActionHrid, ActionStat>);
  }, [
    characterLevels,
    drinkStats,
    equipmentStats,
    communityBuffStats,
    house,
    skillHrid,
    data,
    market,
    priceOverrides
  ]);

  const columnHelper = createColumnHelper<ActionDetail>();
  const columns = useMemo(() => {
    const baseColumns = [
      columnHelper.accessor((row) => row.levelRequirement.level, {
        id: 'levelRequirement',
        header: 'Level Req.',
        cell: ({ row }) => {
          const baseLevelReq = row.original.levelRequirement.level;
          const artisanTeaPenalty = drinkStats['/buff_types/artisan'] ? 5 : 0;
          return baseLevelReq + artisanTeaPenalty;
        }
      }),
      columnHelper.accessor((row) => row.name, { id: 'name', header: 'Name' }),
      columnHelper.accessor((row) => actionStats[row.hrid].xp, {
        id: 'xp',
        header: 'XP',
        cell: ({ row }) => formatNumber(actionStats[row.original.hrid].xp)
      }),
      columnHelper.accessor((row) => row.baseTimeCost, {
        id: 'time',
        header: 'Time (s)',
        cell: ({ row }) => formatNumber(actionStats[row.original.hrid].time)
      }),
      columnHelper.accessor((row) => actionStats[row.hrid].xpPerHour, {
        id: 'xpPerHour',
        header: 'XP/Hr',
        cell: ({ row }) => formatNumber(actionStats[row.original.hrid].xpPerHour)
      }),
      columnHelper.accessor((row) => actionStats[row.hrid].efficiency, {
        id: 'efficiency',
        header: 'Efficiency',
        cell: (info) =>
          `${formatNumber(actionStats[info.row.original.hrid].efficiency * 100)}%`
      })
    ];
    const gatheringColumns = [
      columnHelper.display({
        id: 'dropsPerHour',
        header: 'Drops/hr',
        cell: (info) => {
          const { hrid: actionHrid } = info.row.original;
          const { dropsPerAction, rareDropsPerAction } = actionStats[actionHrid];
          const fullDropTable = [...dropsPerAction, ...rareDropsPerAction];
          return (
            <div>
              {fullDropTable.map((drop) => {
                const itemName = clientData.itemDetailMap[drop.itemHrid].name;
                const dropsPerHour = drop.amt * actionStats[actionHrid].actionsPerHour;
                return (
                  <div key={drop.itemHrid} className="flex">
                    <ItemIcon itemHrid={drop.itemHrid} />
                    {itemName} ({formatNumber(dropsPerHour)})
                  </div>
                );
              })}
            </div>
          );
        }
      }),
      columnHelper.display({
        id: 'price',
        header: 'Price',
        cell: (info) => {
          const { dropTable, hrid: actionHrid } = info.row.original;
          if (dropTable == null || market == null) return 'N/A';
          const dropHrid = dropTable[0].itemHrid;
          const price = market.getItemPrice(dropHrid);

          const key = `${actionHrid}-override`;

          return (
            <input
              key={key}
              className="input-primary input input-sm"
              defaultValue={price}
              value={priceOverrides[dropHrid]}
              onChange={(e) => {
                keyToFocus.current = key;
                setPriceOverrides((state) => {
                  return { ...state, [dropHrid]: e.target.value };
                });
              }}
              autoFocus={key === keyToFocus.current}
            />
          );
        }
      }),
      columnHelper.accessor((row) => actionStats[row.hrid].dropsProfitPerAction, {
        id: 'dropsProfitPerHour',
        header: 'Profit/hr',
        cell: (info) => {
          const { dropsProfitPerAction, actionsPerHour } =
            actionStats[info.row.original.hrid];
          return formatNumber(dropsProfitPerAction * actionsPerHour);
        }
      })
    ];

    const productionColumns = [
      columnHelper.display({
        id: 'inputsPerHour',
        header: 'Inputs/hr',
        cell: ({ row }) => {
          let { inputItems } = row.original;
          const { upgradeItemHrid, hrid } = row.original;

          if (inputItems == null) return <div>N/A</div>;

          if (upgradeItemHrid !== '') {
            inputItems = [...inputItems, { itemHrid: upgradeItemHrid, count: 1 }];
          }

          return inputItems.map((item) => (
            <div key={`${hrid}-${item.itemHrid}`} className="flex">
              <div className="mr-1">
                <ItemIcon itemHrid={item.itemHrid} />
              </div>
              {clientData.itemDetailMap[item.itemHrid].name} (
              {formatNumber(item.count * actionStats[hrid].actionsPerHour)})
            </div>
          ));
        }
      }),
      columnHelper.display({
        id: 'inputPrices',
        header: 'Input Prices',
        cell: ({ row }) => {
          let { inputItems } = row.original;
          const { upgradeItemHrid, hrid: actionHrid } = row.original;

          if (inputItems == null) return <div>N/A</div>;

          if (upgradeItemHrid !== '') {
            inputItems = [...inputItems, { itemHrid: upgradeItemHrid, count: 1 }];
          }

          return inputItems.map((item) => {
            if (market == null) return 'N/A';

            const price = market.getItemPrice(item.itemHrid);
            const key = `${actionHrid}-${item.itemHrid}-input-price-override`;

            return (
              <div
                key={`${actionHrid}-${item.itemHrid}`}
                className="flex items-center justify-between"
              >
                <div className="mr-1">
                  <ItemIcon itemHrid={item.itemHrid} />
                  {clientData.itemDetailMap[item.itemHrid].name}
                </div>
                <input
                  key={key}
                  className="input-primary input input-xs w-32"
                  defaultValue={price}
                  value={priceOverrides[item.itemHrid]}
                  onChange={(e) => {
                    keyToFocus.current = key;
                    setPriceOverrides((state) => {
                      return { ...state, [item.itemHrid]: e.target.value };
                    });
                  }}
                  autoFocus={key === keyToFocus.current}
                />
              </div>
            );
          });
        }
      }),
      columnHelper.display({
        id: 'outputsPerHour',
        header: 'Outputs/hr',
        cell: ({ row }) => {
          const { outputItems, hrid } = row.original;

          if (outputItems == null) return <div>N/A</div>;

          return outputItems.map(({ itemHrid, count }) => (
            <div key={`${hrid}-${itemHrid}`} className="flex">
              <div className="mr-1">
                <ItemIcon itemHrid={itemHrid} />
              </div>
              {clientData.itemDetailMap[itemHrid].name} (
              {formatNumber(count * actionStats[hrid].actionsPerHour)})
            </div>
          ));
        }
      }),
      columnHelper.accessor(
        (row) => {
          const { hrid } = row;
          const { outputItemsProfitPerAction, inputCostPerAction } = actionStats[hrid];
          if (outputItemsProfitPerAction == null || inputCostPerAction == null)
            return -Infinity;
          else return outputItemsProfitPerAction - inputCostPerAction;
        },
        {
          id: 'productionProfitPerHour',
          header: 'Profit/hr',
          cell: ({ row }) => {
            const { hrid } = row.original;
            const { outputItemsProfitPerAction, inputCostPerAction, actionsPerHour } =
              actionStats[hrid];

            if (outputItemsProfitPerAction == null || inputCostPerAction == null)
              return 'N/A';
            return formatNumber(
              (outputItemsProfitPerAction - inputCostPerAction) * actionsPerHour
            );
          }
        }
      )
    ];

    const targetColumns = [
      columnHelper.accessor((row) => actionStats[row.hrid].xp, {
        id: 'actionsToTarget',
        header: '# Actions to Target',
        cell: (info) => {
          const { hrid } = info.row.original;
          const targetXp = clientData.levelExperienceTable[targetLevels[skillHrid]];
          const currentSkillXp = currentXp[skillHrid];
          const actionsToTarget = (targetXp - currentSkillXp) / actionStats[hrid].xp;
          return formatNumber(actionsToTarget);
        }
      }),
      columnHelper.accessor((row) => actionStats[row.hrid].xp, {
        id: 'timeToTarget',
        header: 'Time to Target',
        cell: (info) => {
          const { hrid } = info.row.original;
          const targetXp = clientData.levelExperienceTable[targetLevels[skillHrid]];
          const currentSkillXp = currentXp[skillHrid];
          const actionsToTarget = (targetXp - currentSkillXp) / actionStats[hrid].xp;
          const timeToTarget = actionsToTarget / actionStats[hrid].actionsPerSecond;
          return formatNumber(timeToTarget);
        }
      }),
      columnHelper.accessor((row) => actionStats[row.hrid].actionsPerSecond, {
        id: 'timeToFinishActions',
        header: 'Time to finish # actions',
        cell: (info) => {
          const { hrid } = info.row.original;
          const currentTargetActions = targetActions[skillHrid];
          if (isNaN(currentTargetActions)) return 'N/A';
          const timeToFinish = currentTargetActions / actionStats[hrid].actionsPerSecond;
          return formatNumber(timeToFinish);
        }
      })
    ];
    if (actionFunctionHrid === '/action_functions/gathering')
      return [...baseColumns, ...gatheringColumns, ...targetColumns];
    else if (actionFunctionHrid === '/action_functions/production')
      return [...baseColumns, ...productionColumns, ...targetColumns];
    else return [...baseColumns, ...targetColumns];
  }, [
    columnHelper,
    actionStats,
    drinkStats,
    market,
    priceOverrides,
    currentXp,
    targetLevels,
    targetActions,
    skillHrid,
    actionFunctionHrid
  ]);

  return columns;
}
