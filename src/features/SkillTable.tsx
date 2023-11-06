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
import { useState } from 'react';
import { ActionDetail } from 'src/core/actions/ActionDetail';
import { NonCombatSkillHrid } from 'src/core/skills/NonCombatSkillHrid';
import { computeActionTime } from 'src/features/calculations/computeActionTime';
import { computeActionXp } from 'src/features/calculations/computeActionXp';
import { computeDrinkStats } from 'src/features/calculations/computeDrinkStats';
import { computeEquipmentStats } from 'src/features/calculations/computeEquipmentStats';
import { setSkillXp } from 'src/features/currentXpSlice';
import { setTargetLevel } from 'src/features/targetLevelSlice';
import { useAppDispatch } from 'src/hooks/useAppDispatch';
import { useStats } from 'src/hooks/useStats';
import { formatNumber } from 'src/util/formatNumber';
import { skillHridToSpeedBonus } from 'src/util/skillHridToSpeedBonusMapping';

interface SkillTableProps {
  data: ActionDetail[];
  skillHrid: NonCombatSkillHrid;
}

export function SkillTable({ data, skillHrid }: SkillTableProps) {
  const dispatch = useAppDispatch();

  const { activeLoadout, drinks, communityBuffs, house, targetLevels, currentXp } =
    useStats();

  const equipmentStats = computeEquipmentStats(activeLoadout);
  const drinkStats = computeDrinkStats(drinks, skillHrid);

  const [sorting, setSorting] = useState<SortingState>([
    { id: 'levelRequirement', desc: false }
  ]);
  const [columnVisibility, setColumnVisibility] = useState({});

  const columnHelper = createColumnHelper<ActionDetail>();
  const columns = [
    columnHelper.accessor((row) => row.levelRequirement.level, {
      id: 'levelRequirement',
      header: 'Level Req.',
      cell: (info) => {
        const baseLevelReq = info.row.original.levelRequirement.level;
        const drinkStats = computeDrinkStats(drinks, skillHrid);
        const artisanTeaPenalty = drinkStats['/buff_types/artisan'] ? 5 : 0;
        return baseLevelReq + artisanTeaPenalty;
      }
    }),
    columnHelper.accessor((row) => row.name, { id: 'name', header: 'Name' }),
    columnHelper.accessor((row) => row.experienceGain.value, {
      id: 'xp',
      header: 'XP',
      cell: (info) => {
        const { experienceGain } = info.row.original;
        const xp = computeActionXp({
          equipmentStats,
          drinkStats,
          communityBuffs,
          houseStats: house,
          baseXp: experienceGain.value
        });
        return formatNumber(xp);
      }
    }),
    columnHelper.accessor((row) => row.baseTimeCost, {
      id: 'time',
      header: 'Time (s)',
      cell: (info) => {
        const { baseTimeCost } = info.row.original;
        const toolBonus = equipmentStats[skillHridToSpeedBonus[skillHrid]] ?? 0;
        const time = computeActionTime({ baseTimeCost, toolBonus });
        return formatNumber(time);
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
