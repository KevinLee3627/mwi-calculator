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

interface SkillTableProps {
  data: ActionDetail[];
}

export function SkillTable({ data }: SkillTableProps) {
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
        // const artisanTeaPenalty = drinkStats['/buff_types/artisan'] ? 5 : 0;
        // return baseLevelReq + artisanTeaPenalty;
        return baseLevelReq;
      }
    }),
    columnHelper.accessor((row) => row.name, { id: 'name', header: 'Name' }),
    columnHelper.accessor((row) => row.experienceGain.value, { id: 'xp', header: 'XP' })
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
