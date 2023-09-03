import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable
} from '@tanstack/react-table';
import { useMemo, useState } from 'react';
import { ActionDetail } from 'src/core/actions/ActionDetail';
import { clientData } from 'src/core/clientData';

export function SkillTable() {
  const defaultData = useMemo(
    () =>
      Object.values(clientData.actionDetailMap).filter(
        (value) => value.type === '/action_types/milking'
      ),
    []
  );

  const [data] = useState<ActionDetail[]>(defaultData);

  const columnHelper = useMemo(() => createColumnHelper<ActionDetail>(), []);

  const columns = useMemo(
    () => [
      columnHelper.accessor('name', { header: 'Action' }),
      columnHelper.accessor((row) => row.levelRequirement.level, {
        header: 'Level Req.',
        id: 'levelRequirement'
      }),
      columnHelper.accessor((row) => row.experienceGain.value, { header: 'XP' })
    ],
    [columnHelper]
  );

  const [sorting, setSorting] = useState<SortingState>([
    { id: 'levelRequirement', desc: false }
  ]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: { sorting },
    onSortingChange: setSorting
  });

  return (
    <div>
      <table className="table">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id}>
                  {header.isPlaceholder ? null : (
                    <div
                      className={
                        header.column.getCanSort() ? 'cursor-pointer select-none' : ''
                      }
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {{ asc: 'up', desc: 'down' }[
                        header.column.getIsSorted() as string
                      ] ?? null}
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
      </table>
    </div>
  );
}
