import { EllipsisVerticalIcon, TrashIcon } from '@heroicons/react/24/solid';
import { useMemo } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import { GameIcon } from 'src/components/GameIcon';
import { Select } from 'src/components/Select';
import { SkillIcon } from 'src/components/SkillIcon';
import { NonCombatActionTypeHrid } from 'src/core/actions/NonCombatActionTypeHrid';
import { clientData } from 'src/core/clientData';
import { computeActionEfficiency } from 'src/features/calculations/computeActionEfficiency';
import { computeActionTime } from 'src/features/calculations/computeActionTime';
import { computeCommunityBuffStats } from 'src/features/calculations/computeCommunityBuffStats';
import { computeDrinkStats } from 'src/features/calculations/computeDrinkStats';
import { computeEquipmentStats } from 'src/features/calculations/computeEquipmentStats';
import {
  createActionQueueEntry,
  deleteActionQueueEntry,
  reorderActionQueue,
  updateActionHrid,
  updateActionType,
  updateNumActions
} from 'src/features/queue/actionQueueSlice';
import { useAppDispatch } from 'src/hooks/useAppDispatch';
import { useStats } from 'src/hooks/useStats';
import { actionTypeHridToActions } from 'src/util/actionTypeHridToActions';
import { formatNumber } from 'src/util/formatNumber';
import { nonCombatActionTypeHridToSkillHrid } from 'src/util/nonCombatActionTypeHridToNonCombatSkillHrid';
import { skillHridToSpeedBonus } from 'src/util/skillHridToSpeedBonusMapping';

export function ActionQueue() {
  const dispatch = useAppDispatch();

  const { activeLoadout, drinks, characterLevels, communityBuffs, actionQueue, house } =
    useStats();
  const equipmentStats = computeEquipmentStats(activeLoadout);

  const ResponsiveGridLayout = useMemo(() => WidthProvider(Responsive), []);
  const actionTypeOptions = useMemo(() => {
    return Object.values(clientData.actionTypeDetailMap)
      .filter((detail) => detail.hrid !== '/action_types/combat')
      .map((detail) => ({
        label: detail.name,
        value: detail
      }))
      .sort((a, b) => a.value.sortIndex - b.value.sortIndex);
  }, []);
  const layout = actionQueue.layout.map((entry) => ({
    i: entry.i,
    x: 0,
    y: entry.y,
    w: 1,
    h: 1
  }));

  const elems = Object.values(actionQueue.actions).map((queueEntry) => {
    return (
      <div
        key={queueEntry.id}
        // https://github.com/react-grid-layout/react-grid-layout/issues/382
        // We need to use both data-grid here AND the layout prop in <GridLayout> for
        // the elements to re-render properly on state(redux) update.
        // data-grid={{ i: entryIndex.toString(), x: 0, y: entryIndex, w: 1, h: 1 }}
        className="flex w-24 items-center gap-2"
      >
        {/* eslint-disable-next-line tailwindcss/no-custom-classname */}
        <EllipsisVerticalIcon className="queue-drag-handle h-6 w-6" />
        <Select
          className="flex-none"
          options={actionTypeOptions}
          formatOptionLabel={(data) => {
            const skillHrid =
              nonCombatActionTypeHridToSkillHrid[
                data.value.hrid as NonCombatActionTypeHrid
              ];
            return <SkillIcon skillHrid={skillHrid} />;
          }}
          value={{
            label: clientData.actionTypeDetailMap[queueEntry.actionTypeHrid].name,
            value: clientData.actionTypeDetailMap[queueEntry.actionTypeHrid]
          }}
          onChange={(e) => {
            const actionTypeHrid = e?.value.hrid;
            if (!actionTypeHrid || actionTypeHrid === '/action_types/combat') return;

            dispatch(updateActionType({ id: queueEntry.id, actionTypeHrid }));
          }}
        />
        <Select
          className="basis-6/12"
          options={actionTypeHridToActions[queueEntry.actionTypeHrid].map((action) => ({
            label: action.name,
            value: action
          }))}
          value={{
            label: clientData.actionDetailMap[queueEntry.actionHrid].name,
            value: clientData.actionDetailMap[queueEntry.actionHrid]
          }}
          onChange={(e) => {
            const actionHrid = e?.value.hrid;
            if (!actionHrid) return;

            dispatch(updateActionHrid({ id: queueEntry.id, actionHrid }));
          }}
        />
        <div className="">
          <input
            type="number"
            className="input-bordered input-primary input "
            placeholder="# Of Actions"
            value={queueEntry.numActions}
            onChange={(e) => {
              const value = parseInt(e.target.value, 10);
              dispatch(updateNumActions({ id: queueEntry.id, value }));
            }}
          />
        </div>
        <button
          // Delete Loadout
          // eslint-disable-next-line tailwindcss/classnames-order
          className="btn-outline btn-error btn"
          onClick={(e) => {
            dispatch(deleteActionQueueEntry({ id: queueEntry.id }));
            e.preventDefault();
          }}
        >
          <TrashIcon className="h-4 w-4" />
        </button>
      </div>
    );
  });

  const totalTime = useMemo(() => {
    return Object.values(actionQueue.actions).reduce((acc, queueEntry) => {
      const actionDetail = clientData.actionDetailMap[queueEntry.actionHrid];
      const skillHrid = nonCombatActionTypeHridToSkillHrid[queueEntry.actionTypeHrid];

      const communityBuffStats = computeCommunityBuffStats(communityBuffs);
      const drinkStats = computeDrinkStats(drinks, skillHrid);
      const efficiency = computeActionEfficiency({
        equipmentStats,
        drinkStats,
        characterLevel: characterLevels[skillHrid],
        communityBuffStats,
        actionLevel: actionDetail.levelRequirement.level,
        house,
        skillHrid
      });

      const toolBonus = equipmentStats[skillHridToSpeedBonus[skillHrid]] ?? 0;
      const timePerAction = computeActionTime({
        toolBonus,
        baseTimeCost: actionDetail.baseTimeCost
      });
      const effectiveTimePerAction = timePerAction / (1 + efficiency);
      const totalSeconds = effectiveTimePerAction * queueEntry.numActions;
      return acc + totalSeconds;
    }, 0);
  }, [
    actionQueue.actions,
    characterLevels,
    communityBuffs,
    drinks,
    equipmentStats,
    house
  ]);

  return (
    <dialog id="actionQueueModal" className="modal">
      <div className="modal-box !h-4/6 !max-h-full sm:!w-5/12 sm:!max-w-5xl">
        <h2 className="text-lg font-bold">Action Queue</h2>
        <span>Calculate how long your queue will take.</span>
        <ResponsiveGridLayout
          // eslint-disable-next-line tailwindcss/no-custom-classname
          className="layout z-0"
          style={{
            // https://github.com/react-grid-layout/react-grid-layout/issues/171#issuecomment-336719786
            position: 'relative'
          }}
          layouts={{ lg: layout, sm: layout, xs: layout, xxs: layout }}
          // lg and xxs are required for some reason? Throws an error if not included.
          cols={{ lg: 1, sm: 1, xs: 1, xxs: 1 }}
          // TODO: Can we not hardcode this?
          rowHeight={64}
          draggableHandle=".queue-drag-handle"
          onDragStop={(newLayout) => {
            dispatch(reorderActionQueue({ newLayout: newLayout }));
          }}
          // https://github.com/react-grid-layout/react-grid-layout/issues/858#issuecomment-428539577
          // This makes performance ~6x slower than normal, according to documentation
          useCSSTransforms={false}
        >
          {elems}
        </ResponsiveGridLayout>
        <div className="flex items-center justify-between">
          <div className="stats">
            <div className="stat">
              <div className="stat-title">Total Time</div>
              <div className="stat-value">{formatNumber(totalTime)}</div>
            </div>
          </div>
          <button
            className="btn-primary btn"
            onClick={() => {
              dispatch(
                createActionQueueEntry({
                  actionTypeHrid: '/action_types/milking',
                  actionHrid: '/actions/milking/cow',
                  numActions: 0
                })
              );
            }}
          >
            Add Action
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
}
