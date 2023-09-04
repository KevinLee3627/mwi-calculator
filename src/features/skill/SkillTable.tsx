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
import { ActionDetail } from 'src/core/actions/ActionDetail';
import { NonCombatActionTypeHrid } from 'src/core/actions/NonCombatActionTypeHrid';
import { clientData } from 'src/core/clientData';
import { ActionFunctionHrid } from 'src/core/hrid/ActionFunctionHrid';
import { computeEquipmentStats } from 'src/features/character/equipment/computeEquipmentStats';
import { CharacterLevelState } from 'src/features/character/levels/characterLevelSlice';
import { computeSkillEfficiency } from 'src/features/skill/computeSkillEfficiency';
import { computeSkillTime } from 'src/features/skill/computeSkillTime';
import { computeSkillXp } from 'src/features/skill/computeSkillXp';
import { computeDrinkStats } from 'src/features/skill/drinks/computeDrinkStats';
import { svgHrefs } from 'src/util/svgHrefs';

interface SkillTableProps {
  actionTypeHrid: NonCombatActionTypeHrid;
  actionFunctionHrid: ActionFunctionHrid;
  equipmentStats: ReturnType<typeof computeEquipmentStats>;
  drinkStats: ReturnType<typeof computeDrinkStats>;
  characterLevels: CharacterLevelState;
}
export function SkillTable({
  actionTypeHrid,
  actionFunctionHrid,
  equipmentStats,
  drinkStats,
  characterLevels
}: SkillTableProps) {
  const defaultData = useMemo(
    () =>
      Object.values(clientData.actionDetailMap).filter(
        (value) => value.type === actionTypeHrid
      ),
    [actionTypeHrid]
  );

  const [data, setData] = useState<ActionDetail[]>(defaultData);

  useEffect(() => {
    setData(
      Object.values(clientData.actionDetailMap).filter(
        (value) => value.type === actionTypeHrid
      )
    );
  }, [actionTypeHrid]);

  const [sorting, setSorting] = useState<SortingState>([
    { id: 'levelRequirement', desc: false }
  ]);
  const [columnVisibility, setColumnVisibility] = useState({});

  useEffect(() => {
    console.log(`Changed!`);
    if (actionFunctionHrid === '/action_functions/production')
      setColumnVisibility((columnVisibility) => ({
        ...columnVisibility,
        inputItems: true,
        outputItems: true
      }));
    else {
      setColumnVisibility((columnVisibility) => ({
        ...columnVisibility,
        inputItems: false,
        outputItems: false
      }));
    }
  }, [actionFunctionHrid]);

  const columnHelper = useMemo(() => createColumnHelper<ActionDetail>(), []);
  const columns = useMemo(
    () => [
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
        cell: (info) => {
          const baseXp = info.row.original.experienceGain.value;
          const skillXp = computeSkillXp({ equipmentStats, drinkStats, baseXp });
          return skillXp.toFixed(2);
        }
      }),
      columnHelper.accessor((row) => row.baseTimeCost, {
        header: 'Time (s)',
        cell: (info) => {
          const baseTime = info.row.original.baseTimeCost;
          const skillTime = computeSkillTime({
            actionTypeHrid,
            equipmentStats,
            baseTime
          });
          return skillTime.toFixed(2);
        }
      }),
      columnHelper.accessor((row) => row.levelRequirement.level, {
        header: 'Efficiency',
        id: 'efficiency',
        cell: (info) => {
          const levelRequirement = info.row.original.levelRequirement.level;
          const efficiency = computeSkillEfficiency({
            actionTypeHrid,
            equipmentStats,
            drinkStats,
            characterLevels,
            levelRequirement
          });
          return `${(efficiency * 100).toFixed(2)}%`;
        }
      }),
      columnHelper.accessor((row) => row.dropTable, {
        header: 'Drops',
        id: 'dropTable',
        cell: (info) => {
          const dropTable = info.row.original.dropTable ?? [];
          const rareDropTable = info.row.original.rareDropTable ?? [];

          const dropTableElem = (
            <div>
              {dropTable?.map((drop) => {
                const itemName = clientData.itemDetailMap[drop.itemHrid].name;
                const dropRate = (drop.dropRate * 100).toFixed(2);
                const teaDropQuantityBonus =
                  1 + (drinkStats['/buff_types/gathering'] ?? 0);
                const equipDropQuantitybonus =
                  1 + (equipmentStats['gatheringQuantity'] ?? 0);
                const dropQuantitybonus = teaDropQuantityBonus + equipDropQuantitybonus;
                const minDropQuantity = (drop.minCount * dropQuantitybonus).toFixed(2);
                const maxDropQuantity = (drop.maxCount * dropQuantitybonus).toFixed(2);

                const strippedItemHrid = drop.itemHrid.split('/').at(-1);
                const icon = (
                  <svg className="mr-1 inline h-4 w-4">
                    <use href={`${svgHrefs.items}#${strippedItemHrid}`}></use>
                  </svg>
                );
                return (
                  <div key={drop.itemHrid}>
                    <span>
                      {icon} {itemName} ({minDropQuantity}-{maxDropQuantity}) {dropRate}%
                    </span>
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
                const dropRate = (drop.dropRate * 100).toFixed(2);

                const strippedItemHrid = drop.itemHrid.split('/').at(-1);
                const icon = (
                  <svg className="mr-1 inline h-4 w-4">
                    <use href={`${svgHrefs.items}#${strippedItemHrid}`}></use>
                  </svg>
                );
                return (
                  <div key={drop.itemHrid}>
                    <span>
                      {icon} {itemName} ({drop.minCount}-{drop.maxCount}) {dropRate}%
                    </span>
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
      columnHelper.accessor((row) => row.inputItems, {
        header: 'Input',
        id: 'inputItems',
        cell: (info) => {
          const { inputItems, upgradeItemHrid } = info.row.original;
          if (inputItems == null) return null;

          const upgradeItemDetail =
            upgradeItemHrid === '' ? null : clientData.itemDetailMap[upgradeItemHrid];
          const strippedUpgradeItemHrid = upgradeItemHrid.split('/').at(-1);
          const upgradeItemElem = upgradeItemDetail ? (
            <div>
              <span>
                <svg className="mr-1 inline h-4 w-4">
                  <use href={`${svgHrefs.items}#${strippedUpgradeItemHrid}`}></use>
                </svg>
                {upgradeItemDetail.name} (1)
              </span>
            </div>
          ) : null;

          const itemElems = inputItems.map((item) => {
            const strippedItemHrid = item.itemHrid.split('/').at(-1);
            const itemDetail = clientData.itemDetailMap[item.itemHrid];

            const artisanTeaBonus = drinkStats['/buff_types/artisan'] ?? 0;
            const inputCost = item.count * (1 - artisanTeaBonus);
            return (
              <div key={item.itemHrid}>
                <span>
                  <svg className="mr-1 inline h-4 w-4">
                    <use href={`${svgHrefs.items}#${strippedItemHrid}`}></use>
                  </svg>
                  {itemDetail.name} ({inputCost.toFixed(2)})
                </span>
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
                <span>
                  <svg className="mr-1 inline h-4 w-4">
                    <use href={`${svgHrefs.items}#${strippedItemHrid}`}></use>
                  </svg>
                  {itemDetail.name} ({output.toFixed(2)})
                </span>
              </div>
            );
          });

          return itemElems;
        }
      })
    ],
    [columnHelper, actionTypeHrid, drinkStats, characterLevels, equipmentStats]
  );

  const table = useReactTable({
    data,
    columns,
    state: { sorting, columnVisibility },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility
  });

  return (
    <div>
      <table className="table-pin-rows table-zebra table">
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
                        {flexRender(header.column.columnDef.header, header.getContext())}
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
            <tr key={row.id}>
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
}
