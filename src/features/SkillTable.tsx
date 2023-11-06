import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/solid';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  Table,
  useReactTable
} from '@tanstack/react-table';
import { useMemo, useState } from 'react';
import { ActionDetail } from 'src/core/actions/ActionDetail';
import { ActionHrid } from 'src/core/hrid/ActionHrid';
import { NonCombatSkillHrid } from 'src/core/skills/NonCombatSkillHrid';
import { computeActionEfficiency } from 'src/features/calculations/computeActionEfficiency';
import { computeActionTime } from 'src/features/calculations/computeActionTime';
import { computeActionXp } from 'src/features/calculations/computeActionXp';
import { computeCommunityBuffStats } from 'src/features/calculations/computeCommunityBuffStats';
import { computeDrinkStats } from 'src/features/calculations/computeDrinkStats';
import { computeEquipmentStats } from 'src/features/calculations/computeEquipmentStats';
import { setSkillXp } from 'src/features/currentXpSlice';
import { Market } from 'src/features/market/Market';
import { useGetMarketDataQuery } from 'src/features/market/marketApi';
import { setTargetLevel } from 'src/features/targetLevelSlice';
import { useAppDispatch } from 'src/hooks/useAppDispatch';
import { useStats } from 'src/hooks/useStats';
import { formatNumber } from 'src/util/formatNumber';
import { skillHridToSpeedBonus } from 'src/util/skillHridToSpeedBonusMapping';

interface SkillTableProps {
  data: ActionDetail[];
  skillHrid: NonCombatSkillHrid;
}

interface ActionStat {
  xp: number;
  efficiency: number;
  time: number;
  actionHrid: ActionHrid;
  xpPerHour: number;
}

export function SkillTable({ data, skillHrid }: SkillTableProps) {
  const dispatch = useAppDispatch();
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'levelRequirement', desc: false }
  ]);
  const [columnVisibility, setColumnVisibility] = useState({});

  const {
    data: marketData,
    error,
    isLoading
  } = useGetMarketDataQuery('', {
    pollingInterval: 1000 * 60
  });

  const market = useMemo(() => new Market(marketData?.market), [marketData]);

  const {
    activeLoadout,
    drinks,
    communityBuffs,
    house,
    targetLevels,
    currentXp,
    characterLevels
  } = useStats();

  const equipmentStats = computeEquipmentStats(activeLoadout);
  const drinkStats = computeDrinkStats(drinks, skillHrid);
  const communityBuffStats = computeCommunityBuffStats(communityBuffs);

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
      acc[action.hrid] = {
        actionHrid: action.hrid,
        xp,
        efficiency,
        time,
        xpPerHour
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
    data
  ]);

  const columnHelper = createColumnHelper<ActionDetail>();
  const columns = useMemo(() => {
    return [
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
      }),
      columnHelper.display({
        id: 'price',
        header: 'Price',
        cell: (info) => {
          const { dropTable } = info.row.original;
          if (dropTable == null) return 'N/A';
          const dropHrid = dropTable[0].itemHrid;
          const price = market.getItemPrice(dropHrid);
          return <input className="input-primary input input-sm" defaultValue={price} />;
        }
      }),
      columnHelper.display({
        id: 'actionsToTarget',
        header: '# Actions to Target',
        cell: (info) => {
          return info.row.original.baseTimeCost;
        }
      })
    ];
  }, [columnHelper, actionStats, drinkStats, market]);

  const table = useReactTable({
    data,
    columns,
    state: { sorting, columnVisibility },
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel()
  });

  return (
    <div>
      <div className="flex items-end gap-4">
        <div className="form-control">
          <label className="label">
            <span className="label-text">Current XP</span>
          </label>
          <input
            type="number"
            min={0}
            className="input-primary input"
            value={currentXp[skillHrid]}
            onChange={(e) => {
              const value = parseInt(e.target.value, 10);
              dispatch(setSkillXp({ skillHrid, xp: value }));
            }}
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Target Level</span>
          </label>
          <input
            type="number"
            min={0}
            max={200}
            className="input-primary input"
            value={targetLevels[skillHrid]}
            onChange={(e) => {
              const value = parseInt(e.target.value, 10);
              dispatch(setTargetLevel({ skillHrid, level: value }));
            }}
          />
        </div>
        <ColumnVisibilityDropdown table={table} />
      </div>
      <table className="table-zebra table">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} colSpan={header.colSpan}>
                  {header.isPlaceholder ? null : (
                    <div
                      {...{
                        className: header.column.getCanSort()
                          ? 'flex cursor-pointer select-none'
                          : '',
                        onClick: header.column.getToggleSortingHandler()
                      }}
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {{
                        asc: <ChevronUpIcon className="h-4 w-4" />,
                        desc: <ChevronDownIcon className="h-4 w-4" />
                      }[header.column.getIsSorted() as string] ?? null}
                    </div>
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
        <tfoot>
          {table.getFooterGroups().map((footerGroup) => (
            <tr key={footerGroup.id}>
              {footerGroup.headers.map((header) => (
                <th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.footer, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </tfoot>
      </table>
    </div>
  );
}

interface ColumnVisibilityDropdownProps {
  table: Table<ActionDetail>;
}
function ColumnVisibilityDropdown({ table }: ColumnVisibilityDropdownProps) {
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

  return (
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
  );
}
