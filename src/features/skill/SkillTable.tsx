import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/solid';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable
} from '@tanstack/react-table';
import { useEffect, useMemo, useState } from 'react';
import { GameIcon } from 'src/components/GameIcon';
import { Select } from 'src/components/Select';
import { ActionDetail } from 'src/core/actions/ActionDetail';
import { NonCombatActionTypeHrid } from 'src/core/actions/NonCombatActionTypeHrid';
import { clientData } from 'src/core/clientData';
import { ActionCategoryHrid } from 'src/core/hrid/ActionCategoryHrid';
import { ActionFunctionHrid } from 'src/core/hrid/ActionFunctionHrid';
import { ActionHrid } from 'src/core/hrid/ActionHrid';
import { computeEquipmentStats } from 'src/features/character/equipment/computeEquipmentStats';
import { CharacterLevelState } from 'src/features/character/levels/characterLevelSlice';
import { selectCommunityBuffState } from 'src/features/communityBuff/communityBuffSlice';
import { Market } from 'src/features/market/Market';
import { useGetMarketDataQuery } from 'src/features/market/services/market';
import { computeGatheringQuantityBonus } from 'src/features/skill/computeGatheringQuantityBonus';
import { computeSkillEfficiency } from 'src/features/skill/computeSkillEfficiency';
import { computeSkillTime } from 'src/features/skill/computeSkillTime';
import { computeSkillXp } from 'src/features/skill/computeSkillXp';
import { computeDrinkStats } from 'src/features/skill/drinks/computeDrinkStats';
import {
  selectTargetLevel,
  setTargetLevel
} from 'src/features/skill/targets/targetLevelSlice';
import { useAppDispatch } from 'src/hooks/useAppDispatch';
import { useAppSelector } from 'src/hooks/useAppSelector';
import { actionTypeToSkillHrid } from 'src/util/hridConverters';

interface SkillTableProps {
  actionTypeHrid: NonCombatActionTypeHrid;
  actionFunctionHrid: ActionFunctionHrid;
  equipmentStats: ReturnType<typeof computeEquipmentStats>;
  drinkStats: ReturnType<typeof computeDrinkStats>;
  characterLevels: CharacterLevelState;
  data: ActionDetail[];
}

interface ActionStat {
  xp: number;
  efficiency: number;
  time: number;
  actionHrid: ActionHrid;
}

export function SkillTable({
  actionTypeHrid,
  actionFunctionHrid,
  equipmentStats,
  drinkStats,
  characterLevels,
  data
}: SkillTableProps) {
  const {
    data: marketData,
    error,
    isLoading
  } = useGetMarketDataQuery('', {
    pollingInterval: 1000 * 60 * 30
  });
  console.log(marketData, error, isLoading);

  const market = useMemo(() => {
    return new Market(marketData);
  }, [marketData]);

  const dispatch = useAppDispatch();
  // TODO: Why are we passing the redux store data (characterLevels) in as props?
  const communityBuffs = useAppSelector(selectCommunityBuffState);
  const targetLevelState = useAppSelector(selectTargetLevel);
  const [currentXp, setCurrentXp] = useState(1);
  const [numActions, setNumActions] = useState(1);
  const [actionCategoryHrid, setActionCategoryHrid] = useState<ActionCategoryHrid>();
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'levelRequirement', desc: false }
  ]);
  const [columnVisibility, setColumnVisibility] = useState({});

  const dataFilteredByCategory = useMemo(() => {
    if (actionCategoryHrid == null) return data;
    else return data.filter((val) => val.category === actionCategoryHrid);
  }, [data, actionCategoryHrid]);

  const actionStats = useMemo(() => {
    return dataFilteredByCategory.reduce<Record<string, ActionStat>>((acc, action) => {
      const xp = computeSkillXp({
        equipmentStats,
        drinkStats,
        communityBuffs,
        baseXp: action.experienceGain.value
      });
      const efficiency = computeSkillEfficiency({
        actionTypeHrid,
        equipmentStats,
        drinkStats,
        characterLevels,
        levelRequirement: action.levelRequirement.level,
        communityBuffs
      });
      const time = computeSkillTime({
        actionTypeHrid,
        equipmentStats,
        baseTime: action.baseTimeCost
      });
      acc[action.hrid] = {
        actionHrid: action.hrid,
        xp,
        efficiency,
        time
      };
      return acc;
    }, {});
  }, [
    dataFilteredByCategory,
    actionTypeHrid,
    characterLevels,
    drinkStats,
    equipmentStats,
    communityBuffs
  ]);

  const columnHelper = useMemo(() => createColumnHelper<ActionDetail>(), []);
  const columns = useMemo(() => {
    return [
      columnHelper.accessor((row) => row.levelRequirement.level, {
        header: 'Level Req.',
        id: 'levelRequirement',
        cell: (info) => {
          const baseLevelReq = info.row.original.levelRequirement.level;
          const artisanTeaPenalty = drinkStats['/buff_types/artisan'] ? 5 : 0;
          return baseLevelReq + artisanTeaPenalty;
        }
      }),
      columnHelper.accessor('name', { header: 'Action' }),
      columnHelper.accessor((row) => row.experienceGain.value, {
        header: 'XP',
        cell: (info) => actionStats[info.row.original.hrid].xp.toFixed(2)
      }),
      columnHelper.accessor((row) => row.baseTimeCost, {
        header: 'Time (s)',
        cell: (info) => actionStats[info.row.original.hrid].time.toFixed(2)
      }),
      columnHelper.accessor((row) => row.experienceGain.value / row.baseTimeCost, {
        header: 'XP/hr',
        id: 'xpPerHour',
        cell: (info) => {
          const { hrid } = info.row.original;
          const { xp, time, efficiency } = actionStats[hrid];
          const xpPerSecond = xp / (time / (1 + efficiency));
          return (xpPerSecond * 3600).toFixed(2);
        }
      }),
      columnHelper.accessor((row) => row.levelRequirement.level, {
        header: 'Efficiency',
        id: 'efficiency',
        cell: (info) => actionStats[info.row.original.hrid].efficiency.toFixed(2)
      }),
      columnHelper.accessor((row) => row.inputItems, {
        header: 'Input',
        id: 'inputItems',
        cell: (info) => {
          const { inputItems, upgradeItemHrid } = info.row.original;
          if (inputItems == null) return null;

          const upgradeItemDetail =
            upgradeItemHrid === '' ? null : clientData.itemDetailMap[upgradeItemHrid];
          const strippedUpgradeItemHrid = upgradeItemHrid.split('/').at(-1);
          const icon = (
            <GameIcon svgSetName="items" iconName={strippedUpgradeItemHrid ?? ''} />
          );
          const upgradeItemElem = upgradeItemDetail ? (
            <div>
              {icon}
              {upgradeItemDetail.name} (1)
            </div>
          ) : null;

          const itemElems = inputItems.map((item) => {
            const strippedItemHrid = item.itemHrid.split('/').at(-1);
            const itemDetail = clientData.itemDetailMap[item.itemHrid];

            const artisanTeaBonus = drinkStats['/buff_types/artisan'] ?? 0;
            const inputCost = item.count * (1 - artisanTeaBonus);
            return (
              <div key={item.itemHrid}>
                {strippedItemHrid && (
                  <GameIcon svgSetName="items" iconName={strippedItemHrid} />
                )}
                {itemDetail.name} ({inputCost.toFixed(2)})
              </div>
            );
          });

          return (
            <>
              {upgradeItemElem} {itemElems}
            </>
          );
        }
      }),
      columnHelper.display({
        id: 'inputCost',
        header: 'Input Cost',
        cell: (info) => {
          if (isLoading) return <div>Loading market data</div>;

          const { inputItems } = info.row.original;
          if (inputItems != null) {
            const artisanTeaBonus = drinkStats['/buff_types/artisan'] ?? 0;
            const averageCost = inputItems.reduce(
              (acc, item) =>
                acc +
                market.getApproxValue(item.itemHrid) * item.count * (1 - artisanTeaBonus),
              0
            );

            return <div>{averageCost.toFixed(2)}</div>;
          } else {
            return <div>N/A</div>;
          }
        }
      }),
      columnHelper.accessor((row) => row.outputItems, {
        header: 'Output',
        id: 'outputItems',
        cell: (info) => {
          const { outputItems } = info.row.original;
          if (outputItems == null) return null;
          const itemElems = outputItems.map((item) => {
            const strippedItemHrid = item.itemHrid.split('/').at(-1);
            const itemDetail = clientData.itemDetailMap[item.itemHrid];

            const gourmetTeaBonus = drinkStats['/buff_types/gourmet'] ?? 0;
            const output = item.count * (1 + gourmetTeaBonus);
            return (
              <div key={item.itemHrid}>
                <GameIcon svgSetName="items" iconName={strippedItemHrid ?? ''} />
                {itemDetail.name} ({output.toFixed(2)})
              </div>
            );
          });

          return itemElems;
        }
      }),
      columnHelper.display({
        id: 'outputCost',
        header: 'Output Cost',
        cell: (info) => {
          if (isLoading) return <div>Loading market data</div>;

          const { outputItems } = info.row.original;
          if (outputItems != null) {
            const averageCost = outputItems.reduce(
              (acc, item) => acc + market.getApproxValue(item.itemHrid) * item.count,
              0
            );
            return <div>{averageCost}</div>;
          } else {
            return <div>N/A</div>;
          }
        }
      }),
      columnHelper.accessor(
        (row) => {
          if (error) return 'Error getting market data';

          if (actionFunctionHrid === '/action_functions/production') {
            const { outputItems, inputItems, hrid } = row;
            if (outputItems != null && inputItems != null && market != null) {
              const averageOutputCost = outputItems.reduce(
                (acc, item) => acc + market.getApproxValue(item.itemHrid) * item.count,
                0
              );

              const artisanTeaBonus = drinkStats['/buff_types/artisan'] ?? 0;
              const averageInputCost = inputItems.reduce(
                (acc, item) =>
                  acc +
                  market.getApproxValue(item.itemHrid) *
                    item.count *
                    (1 - artisanTeaBonus),
                0
              );

              const effectiveTimePerAction =
                actionStats[hrid].time / (1 + actionStats[hrid].efficiency);
              const actionsPerHour = 3600 / effectiveTimePerAction;
              const profitPerHour =
                (averageOutputCost - averageInputCost) * actionsPerHour;
              return profitPerHour;
            }
          } else {
            const { dropTable, hrid } = row;
            if (dropTable != null && market != null) {
              const dropQuantitybonus = computeGatheringQuantityBonus({
                drinkStats,
                equipmentStats,
                communityBuffs
              });

              const profitPerAction = dropTable.reduce((acc, drop) => {
                const dropsPerAction =
                  ((1 + dropQuantitybonus) * (drop.minCount + drop.maxCount)) / 2;

                const moneyPerAction = market.getApproxValue(drop.itemHrid);
                console.log(drop.itemHrid, moneyPerAction);
                return acc + moneyPerAction * dropsPerAction;
              }, 0);

              const effectiveTimePerAction =
                actionStats[hrid].time / (1 + actionStats[hrid].efficiency);

              const actionsPerHour = 3600 / effectiveTimePerAction;
              const profitPerHour = profitPerAction * actionsPerHour;
              return profitPerHour;
            }
          }
          return 'N/A';
        },
        {
          id: 'profit',
          header: 'Profit/hr',
          cell: (info) => {
            const value = info.getValue();
            return typeof value === 'number' ? value.toFixed(2) : value;
          }
        }
      ),
      columnHelper.accessor((row) => row.dropTable, {
        header: 'Drops/hr',
        id: 'dropTable',
        cell: (info) => {
          const dropTable = info.row.original.dropTable ?? [];
          const rareDropTable = info.row.original.rareDropTable ?? [];
          const hrid = info.row.original.hrid;

          const efficiency = actionStats[hrid].efficiency;

          const secondsPerHour = 3600;
          const secondsPerAction = actionStats[hrid].time;

          const actionsPerHour = (secondsPerHour / secondsPerAction) * (1 + efficiency);
          const dropTableElem = (
            <div>
              {dropTable?.map((drop) => {
                const itemName = clientData.itemDetailMap[drop.itemHrid].name;
                const dropQuantitybonus = computeGatheringQuantityBonus({
                  drinkStats,
                  equipmentStats,
                  communityBuffs
                });

                const strippedItemHrid = drop.itemHrid.split('/').at(-1);
                const icon = (
                  <GameIcon svgSetName="items" iconName={strippedItemHrid ?? ''} />
                );

                const dropsPerAction =
                  ((1 + dropQuantitybonus) * (drop.minCount + drop.maxCount)) / 2;
                const dropsPerHour = dropsPerAction * actionsPerHour;
                return (
                  <div key={drop.itemHrid}>
                    {icon} {itemName} ({dropsPerHour.toFixed(3)})
                  </div>
                );
              })}
            </div>
          );

          // TODO: Consider doing something not so copy/paste
          const rareDropTableElem = (
            <div>
              {rareDropTable?.map((drop) => {
                const itemName = clientData.itemDetailMap[drop.itemHrid].name;
                const dropRate =
                  drop.dropRate * (1 + (equipmentStats['skillingRareFind'] ?? 0));

                const strippedItemHrid = drop.itemHrid.split('/').at(-1);
                const icon = (
                  <GameIcon svgSetName="items" iconName={strippedItemHrid ?? ''} />
                );
                const dropsPerAction = (drop.minCount + drop.maxCount) / 2;
                const dropsPerHour = dropsPerAction * actionsPerHour * dropRate;

                return (
                  <div key={drop.itemHrid}>
                    {icon} {itemName} ({dropsPerHour.toFixed(3)})
                  </div>
                );
              })}
            </div>
          );

          return (
            <>
              {dropTableElem}
              {rareDropTableElem}
            </>
          );
        }
      }),
      columnHelper.display({
        header: '# Actions to Target',
        id: 'actionsToTarget',
        cell: (info) => {
          const { hrid } = info.row.original;
          const xpTable = clientData.levelExperienceTable;
          const skillHrid = actionTypeToSkillHrid(actionTypeHrid);
          const targetLevel = targetLevelState[skillHrid];
          if (targetLevel == null) return;
          const xpDifference = xpTable[targetLevel] - currentXp;
          const xpPerAction = actionStats[hrid].xp;
          return Math.ceil(xpDifference / xpPerAction);
        }
      }),
      columnHelper.display({
        header: 'Time to Target (s)',
        id: 'timeToTarget',
        cell: (info) => {
          const xpTable = clientData.levelExperienceTable;
          const skillHrid = actionTypeToSkillHrid(actionTypeHrid);
          const targetLevel = targetLevelState[skillHrid];
          if (targetLevel == null) return;
          const xpDifference = xpTable[targetLevel] - currentXp;
          const { hrid } = info.row.original;
          const xpPerAction = actionStats[hrid].xp;
          const efficiency = actionStats[hrid].efficiency;
          const timePerAction = actionStats[hrid].time;

          const numberOfActions = xpDifference / xpPerAction;
          const effectiveTimePerAction = timePerAction / (1 + efficiency);
          const secondsToTarget = Math.ceil(numberOfActions * effectiveTimePerAction);
          return secondsToTarget;
        }
      }),
      columnHelper.display({
        header: `Time to finish ${numActions} actions (s)`,
        id: 'timeToFinishActions',
        cell: (info) => {
          const { hrid } = info.row.original;
          const efficiency = actionStats[hrid].efficiency;
          const timePerAction = actionStats[hrid].time;

          const effectiveTimePerAction = timePerAction / (1 + efficiency);
          const totalSeconds = effectiveTimePerAction * numActions;
          return totalSeconds.toFixed(2);
        }
      })
    ];
  }, [
    columnHelper,
    actionTypeHrid,
    drinkStats,
    equipmentStats,
    currentXp,
    targetLevelState,
    numActions,
    actionStats,
    communityBuffs,
    market,
    actionFunctionHrid,
    isLoading,
    error
  ]);

  const actionCategoryHrids = useMemo(
    () => Array.from(new Set(data.map((val) => val.category))),
    [data]
  );

  useEffect(() => {
    if (actionFunctionHrid === '/action_functions/production')
      setColumnVisibility((columnVisibility) => ({
        ...columnVisibility,
        inputItems: true,
        outputItems: true,
        inputCost: true,
        ouputCost: true
      }));
    else {
      setColumnVisibility((columnVisibility) => ({
        ...columnVisibility,
        inputItems: false,
        outputItems: false,
        inputCost: false,
        outputCost: false
      }));
    }
  }, [actionFunctionHrid]);

  useEffect(() => {
    // Resets the category dropdown when switching skills
    setActionCategoryHrid(undefined);
  }, [actionTypeHrid]);

  const table = useReactTable({
    data: dataFilteredByCategory,
    columns,
    state: { sorting, columnVisibility },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility
  });

  const columnVisibilityCheckboxes = table.getAllLeafColumns().map((col) => {
    const header = col.columnDef.header ?? '';
    return (
      <li key={col.id}>
        <label>
          <input
            type="checkbox"
            className="checkbox"
            checked={col.getIsVisible()}
            onChange={col.getToggleVisibilityHandler()}
          />
          {header.toString()}
        </label>
      </li>
    );
  });

  if (actionTypeHrid !== '/action_types/enhancing' && !isLoading) {
    return (
      <div>
        {error && (
          <div className="alert alert-warning mb-4">
            Market data could not be retrieved - enhancement costs are based on vendor
            prices (but can be overriden)
          </div>
        )}
        <div className="flex items-end gap-2 ">
          {actionFunctionHrid === '/action_functions/production' && (
            <div>
              <label className="label">
                <span className="label-text">Category</span>
              </label>
              <Select
                value={{
                  label: actionCategoryHrid
                    ? clientData.actionCategoryDetailMap[actionCategoryHrid].name
                    : '',
                  value: actionCategoryHrid
                }}
                options={actionCategoryHrids.map((category) => ({
                  label: clientData.actionCategoryDetailMap[category].name,
                  value: category
                }))}
                onChange={(selected) => {
                  setActionCategoryHrid(selected?.value);
                }}
                isClearable
              />
            </div>
          )}
          <div className="flex gap-2">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Current XP</span>
              </label>
              <input
                type="number"
                className="input-bordered input-primary input"
                inputMode="numeric"
                min={0}
                max={clientData.levelExperienceTable.at(-1)}
                value={currentXp}
                onChange={(e) => setCurrentXp(parseInt(e.target.value, 10))}
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Target Level</span>
              </label>
              <input
                type="number"
                className="input-bordered input-primary input"
                inputMode="numeric"
                min={characterLevels[actionTypeToSkillHrid(actionTypeHrid)] + 1}
                max={200}
                value={
                  targetLevelState[actionTypeToSkillHrid(actionTypeHrid)] ?? undefined
                }
                onChange={(e) => {
                  dispatch(
                    setTargetLevel({
                      nonCombatSkillHrid: actionTypeToSkillHrid(actionTypeHrid),
                      level: parseInt(e.target.value, 10)
                    })
                  );
                }}
              />
            </div>
          </div>
          <div>
            <div className="form-control">
              <label className="label">
                <span className="label-text"># Actions</span>
              </label>
              <input
                type="number"
                className="input-bordered input-primary input"
                inputMode="numeric"
                min={1}
                value={numActions}
                onChange={(e) => setNumActions(parseInt(e.target.value, 10))}
              />
            </div>
          </div>
          <div className="dropdown">
            <label tabIndex={0} className="btn-primary btn-outline btn mt-2">
              Column Select
            </label>
            <ul
              tabIndex={0}
              className="dropdown-content menu rounded-box z-50 bg-base-200 p-2 shadow"
            >
              <li className="mb-2">
                <label>
                  <input
                    type="checkbox"
                    className="checkbox"
                    checked={table.getIsAllColumnsVisible()}
                    onChange={table.getToggleAllColumnsVisibilityHandler()}
                  />
                  Toggle All
                </label>
              </li>
              {columnVisibilityCheckboxes}
            </ul>
          </div>
        </div>
        <table className="table-pin-rows table-zebra mt-1 table">
          <thead className="z-40">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id}>
                    {header.isPlaceholder ? null : (
                      <>
                        <div
                          className={`${
                            header.column.getCanSort() ? 'cursor-pointer select-none' : ''
                          } flex`}
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {{
                            asc: <ChevronUpIcon className="h-4 w-4" />,
                            desc: <ChevronDownIcon className="h-4 w-4" />
                          }[header.column.getIsSorted() as string] ?? null}
                        </div>
                      </>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="hover">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  } else return <div>wtf happened</div>;
}
