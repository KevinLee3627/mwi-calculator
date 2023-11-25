import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/solid';
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  Table,
  useReactTable
} from '@tanstack/react-table';
import { useEffect, useMemo, useState } from 'react';
import { Select } from 'src/components/Select';
import { ActionDetail } from 'src/core/actions/ActionDetail';
import { clientData } from 'src/core/clientData';
import { ActionCategoryHrid } from 'src/core/hrid/ActionCategoryHrid';
import { NonCombatSkillHrid } from 'src/core/skills/NonCombatSkillHrid';
import { setSkillXp } from 'src/features/currentXpSlice';
import { useGatheringColumns } from 'src/features/gatheringColumns';
import { Market } from 'src/features/market/Market';
import { useGetMarketDataQuery } from 'src/features/market/marketApi';
import { setTargetAction } from 'src/features/targetActionsSlice';
import { setTargetLevel } from 'src/features/targetLevelSlice';
import { useAppDispatch } from 'src/hooks/useAppDispatch';
import { useStats } from 'src/hooks/useStats';
import { skillHridToActionCategoryHrids } from 'src/util/skillHridToActionCategoryHrids';
import { skillHridToActionFunctionHrid } from 'src/util/skillHridToActionFunctionHridMapping';

interface SkillTableProps {
  data: ActionDetail[];
  skillHrid: NonCombatSkillHrid;
}

export function SkillTable({ data, skillHrid }: SkillTableProps) {
  const dispatch = useAppDispatch();
  const [category, setCategory] = useState<ActionCategoryHrid | null>(null);

  useEffect(() => {
    setCategory(null);
  }, [skillHrid]);
  // Market stuff
  const {
    data: marketData,
    error,
    isLoading
  } = useGetMarketDataQuery('', {
    pollingInterval: 1000 * 60 * 30
  });

  const market = useMemo(() => {
    if (isLoading || error || marketData == null) return null;
    else return new Market(marketData.market);
  }, [marketData, isLoading, error]);

  const { targetLevels, targetActions, currentXp } = useStats();

  // Table stuff
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'levelRequirement', desc: false }
  ]);
  const [columnVisibility, setColumnVisibility] = useState({});

  const tableData = useMemo(() => {
    return category ? data.filter((action) => action.category === category) : data;
  }, [data, category]);

  const columns = useGatheringColumns({ skillHrid, data: tableData, market });

  const table = useReactTable({
    data: tableData,
    columns,
    state: { sorting, columnVisibility },
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel()
  });

  const actionFunctionHrid = skillHridToActionFunctionHrid[skillHrid];
  const categories = skillHridToActionCategoryHrids[skillHrid];
  return (
    <div>
      <div className="flex items-end gap-4">
        {actionFunctionHrid === '/action_functions/production' && (
          <div className="form-control">
            <label className="label">
              <span className="label-text">Category</span>
            </label>
            <Select
              options={categories.map((hrid) => ({
                label: clientData.actionCategoryDetailMap[hrid].name,
                value: hrid
              }))}
              value={{
                label: category ? clientData.actionCategoryDetailMap[category].name : '',
                value: category
              }}
              placeholder="test"
              onChange={(selected) => {
                if (selected == null || selected.value == null) setCategory(null);
                else setCategory(selected.value as ActionCategoryHrid);
              }}
              isClearable
            />
          </div>
        )}
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
        <div className="form-control">
          <label className="label">
            <span className="label-text"># of Actions</span>
          </label>
          <input
            type="number"
            min={0}
            max={200}
            className="input-primary input"
            value={targetActions[skillHrid]}
            onChange={(e) => {
              const value = parseInt(e.target.value, 10);
              dispatch(setTargetAction({ skillHrid, num: value }));
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
        className="dropdown-content menu z-50 rounded-box bg-base-200 p-2 shadow"
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
