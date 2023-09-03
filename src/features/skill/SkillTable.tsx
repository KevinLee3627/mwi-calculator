import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/solid';
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
import { NonCombatActionTypeHrid } from 'src/core/actions/NonCombatActionTypeHrid';
import { clientData } from 'src/core/clientData';
import { NonCombatStats } from 'src/core/items/NonCombatStats';
import { NonCombatSkillHrid } from 'src/core/skills/NonCombatSkillHrid';
import { computeEquipmentStats } from 'src/features/character/equipment/computeEquipmentStats';
import { CharacterLevelState } from 'src/features/character/levels/characterLevelSlice';
import {
  actionTypeEfficiencyStatMapping,
  actionTypeSpeedStatMapping,
  actionTypeStatMapping
} from 'src/features/skill/actionTypeStatMapping';
import { computeDrinkStats } from 'src/features/skill/drinks/computeDrinkStats';
import { baseTimeToSeconds } from 'src/util/baseTimeToSeconds';

interface SkillTableProps {
  actionTypeHrid: NonCombatActionTypeHrid;
  equipmentStats: ReturnType<typeof computeEquipmentStats>;
  drinkStats: ReturnType<typeof computeDrinkStats>;
  characterLevels: CharacterLevelState;
}
export function SkillTable({
  actionTypeHrid,
  equipmentStats,
  drinkStats,
  characterLevels
}: SkillTableProps) {
  const relevantEquipmentStats = Object.fromEntries(
    Object.entries(equipmentStats).filter(
      ([statName, statValue]) =>
        statValue !== 0 &&
        actionTypeStatMapping[actionTypeHrid][statName as keyof NonCombatStats] != null
    )
  ) as Partial<Record<keyof NonCombatStats, number>>;

  const defaultData = useMemo(
    () =>
      Object.values(clientData.actionDetailMap).filter(
        (value) => value.type === actionTypeHrid
      ),
    [actionTypeHrid]
  );

  const [data] = useState<ActionDetail[]>(defaultData);

  const columnHelper = useMemo(() => createColumnHelper<ActionDetail>(), []);

  const columns = useMemo(
    () => [
      columnHelper.accessor((row) => row.levelRequirement.level, {
        header: 'Level Req.',
        id: 'levelRequirement'
      }),
      columnHelper.accessor('name', { header: 'Action' }),
      columnHelper.accessor((row) => row.experienceGain.value, {
        header: 'XP',
        cell: (info) => {
          const equipBonus = relevantEquipmentStats.skillingExperience ?? 0;
          const drinkBonus = drinkStats['/buff_types/wisdom'] ?? 0;
          const baseXp = info.row.original.experienceGain.value;
          return baseXp * (1 + equipBonus + drinkBonus);
        }
      }),
      columnHelper.accessor((row) => row.baseTimeCost, {
        header: 'Time (s)',
        cell: (info) => {
          const speedStatName = actionTypeSpeedStatMapping[actionTypeHrid];
          const equipBonus = relevantEquipmentStats[speedStatName];
          return equipBonus == null
            ? baseTimeToSeconds(info.row.original.baseTimeCost)
            : baseTimeToSeconds(info.row.original.baseTimeCost, equipBonus);
        }
      }),
      columnHelper.accessor((row) => row.levelRequirement.level, {
        header: 'Efficiency',
        id: 'efficiency',
        cell: (info) => {
          const effStatName = actionTypeEfficiencyStatMapping[actionTypeHrid];
          let equipBonus = 0;
          if (effStatName == null) equipBonus = 0;
          else equipBonus = relevantEquipmentStats[effStatName] ?? 0;

          const drinkBonus = drinkStats['/buff_types/efficiency'] ?? 0;

          const skillHrid = actionTypeHrid.replace(
            '/action_type',
            '/skill'
          ) as NonCombatSkillHrid;
          const levelRequirement = info.row.original.levelRequirement.level;
          const levelBonus =
            Math.max(characterLevels[skillHrid] - levelRequirement, 0) / 100;
          console.log(equipBonus, drinkBonus, levelBonus);
          return (equipBonus + drinkBonus + levelBonus) * 100;
        }
      })
    ],
    [columnHelper, relevantEquipmentStats, actionTypeHrid, drinkStats, characterLevels]
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
      <table className="table-zebra table">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id}>
                  {header.isPlaceholder ? null : (
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
