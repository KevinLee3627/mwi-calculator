import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/solid';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable
} from '@tanstack/react-table';
import { useState } from 'react';
import { ActionDetail } from 'src/core/actions/ActionDetail';
import { NonCombatActionTypeHrid } from 'src/core/actions/NonCombatActionTypeHrid';
import { computeActionXp } from 'src/features/calculations/computeActionXp';
import { computeDrinkStats } from 'src/features/calculations/computeDrinkStats';
import { computeEquipmentStats } from 'src/features/calculations/computeEquipmentStats';
import { useStats } from 'src/hooks/useStats';
import { formatNumber } from 'src/util/formatNumber';

interface SkillTableProps {
  data: ActionDetail[];
  actionTypeHrid: NonCombatActionTypeHrid;
}

export function SkillTable({ data, actionTypeHrid }: SkillTableProps) {
  const { activeLoadout, drinks, communityBuffs, house } = useStats();
  const equipmentStats = computeEquipmentStats(activeLoadout);
  const drinkStats = computeDrinkStats(drinks, actionTypeHrid);

  const [sorting, setSorting] = useState<SortingState>([
    { id: 'levelRequirement', desc: false }
  ]);

  const columnHelper = createColumnHelper<ActionDetail>();
  const columns = [
    columnHelper.accessor((row) => row.levelRequirement.level, {
      id: 'levelRequirement',
      header: 'Level Req.',
      cell: (info) => {
        const baseLevelReq = info.row.original.levelRequirement.level;
        const drinkStats = computeDrinkStats(drinks, actionTypeHrid);
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
    })
  ];

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel()
  });

  return (
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
  );
}
