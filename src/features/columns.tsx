import { createColumnHelper } from '@tanstack/react-table';
import { useMemo } from 'react';
import { GameIcon } from 'src/components/GameIcon';
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
import { useGetMarketDataQuery } from 'src/features/market/marketApi';
import { useStats } from 'src/hooks/useStats';
import { formatNumber } from 'src/util/formatNumber';
import { skillHridToSpeedBonus } from 'src/util/skillHridToSpeedBonusMapping';

interface UseGatheringColumnsParams {
  data: ActionDetail[];
  skillHrid: NonCombatSkillHrid;
}

interface ActionStat {
  xp: number;
  efficiency: number;
  time: number;
  actionHrid: ActionHrid;
  xpPerHour: number;
  actionsPerHour: number;
  dropsPerAction: { itemHrid: ItemHrid; amt: number }[];
}

export function useGatheringColumns({ skillHrid, data }: UseGatheringColumnsParams) {
  const {
    data: marketData,
    error,
    isLoading
  } = useGetMarketDataQuery('', {
    pollingInterval: 1000 * 60
  });

  const market = useMemo(() => new Market(marketData?.market), [marketData]);

  const { activeLoadout, drinks, communityBuffs, house, characterLevels } = useStats();

  const { equipmentStats, drinkStats, communityBuffStats } = useMemo(() => {
    const equipmentStats = computeEquipmentStats(activeLoadout);
    const drinkStats = computeDrinkStats(drinks, skillHrid);
    const communityBuffStats = computeCommunityBuffStats(communityBuffs);

    return { equipmentStats, drinkStats, communityBuffStats };
  }, [activeLoadout, drinks, skillHrid, communityBuffs]);

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

      const fullDropTable = [
        ...(action.dropTable ?? []),
        ...(action.rareDropTable ?? [])
      ];

      const teaBonus = drinkStats['/buff_types/gathering'] ?? 0;
      const equipBonus = equipmentStats['gatheringQuantity'] ?? 0;
      const communityBonus =
        communityBuffStats['/community_buff_types/gathering_quantity'] ?? 0;
      const gatheringBonus = teaBonus + equipBonus + communityBonus;

      const dropsPerAction = fullDropTable.map((drop) => {
        const avgPerAction =
          ((1 + gatheringBonus) * (drop.dropRate * (drop.minCount + drop.maxCount))) / 2;
        return { itemHrid: drop.itemHrid, amt: avgPerAction };
      });

      acc[action.hrid] = {
        actionHrid: action.hrid,
        xp,
        efficiency,
        time,
        xpPerHour,
        actionsPerHour,
        dropsPerAction
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
        id: 'dropsPerHour',
        header: 'Drops/hr',
        cell: (info) => {
          const { hrid: actionHrid } = info.row.original;

          return (
            <div>
              {actionStats[actionHrid].dropsPerAction.map((drop) => {
                const itemName = clientData.itemDetailMap[drop.itemHrid].name;
                const dropsPerHour = drop.amt * actionStats[actionHrid].actionsPerHour;
                const strippedItemHrid = drop.itemHrid.split('/').at(-1);
                const icon = (
                  <GameIcon svgSetName="items" iconName={strippedItemHrid ?? ''} />
                );
                return (
                  <div key={drop.itemHrid} className="flex">
                    {icon}
                    {itemName} ({formatNumber(dropsPerHour)})
                  </div>
                );
              })}
            </div>
          );
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

  return columns;
}
