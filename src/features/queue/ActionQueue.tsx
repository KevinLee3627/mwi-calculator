import { EllipsisVerticalIcon, TrashIcon } from '@heroicons/react/24/solid';
import { useMemo } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import { GameIcon } from 'src/components/GameIcon';
import { Select } from 'src/components/Select';
import { NonCombatActionTypeHrid } from 'src/core/actions/NonCombatActionTypeHrid';
import { clientData } from 'src/core/clientData';
import { computeEquipmentStats } from 'src/features/character/equipment/computeEquipmentStats';
import { selectCharacterLevel } from 'src/features/character/levels/characterLevelSlice';
import { selectActiveLoadout } from 'src/features/character/loadouts/loadoutSlice';
import { selectCommunityBuffState } from 'src/features/communityBuff/communityBuffSlice';
import {
  createActionQueueEntry,
  deleteActionQueueEntry,
  reorderActionQueue,
  selectActionQueueState,
  updateActionHrid,
  updateActionType,
  updateNumActions
} from 'src/features/queue/actionQueueSlice';
import { actionTypeToActionMapping } from 'src/features/skill/actionTypeStatMapping';
import { computeSkillEfficiency } from 'src/features/skill/computeSkillEfficiency';
import { computeSkillTime } from 'src/features/skill/computeSkillTime';
import { computeDrinkStats } from 'src/features/skill/drinks/computeDrinkStats';
import { selectSkillDrinks } from 'src/features/skill/drinks/drinksSlice';
import { useAppDispatch } from 'src/hooks/useAppDispatch';
import { useAppSelector } from 'src/hooks/useAppSelector';
import { actionTypeToSkillHrid } from 'src/util/hridConverters';
import { secondsToTimeString } from 'src/util/secondsToTimeString';

export function ActionQueue() {
  const dispatch = useAppDispatch();
  const queueState = useAppSelector(selectActionQueueState);
  const loadout = useAppSelector(selectActiveLoadout);
  const drinks = useAppSelector(selectSkillDrinks);
  const characterLevels = useAppSelector(selectCharacterLevel);
  const communityBuffs = useAppSelector(selectCommunityBuffState);
  const equipmentStats = computeEquipmentStats(
    loadout.equipment,
    loadout.enhancementLevels
  );

  const ResponsiveGridLayout = useMemo(() => WidthProvider(Responsive), []);
  const actionTypeOptions = useMemo(() => {
    return Object.values(clientData.actionTypeDetailMap)
      .filter((detail) => detail.hrid !== '/action_types/combat')
      .map((detail) => ({
        label: detail.name,
        value: detail
      }));
  }, []);
  const layout = queueState.layout.map((entry) => ({
    i: entry.i,
    x: 0,
    y: entry.y,
    w: 1,
    h: 1
  }));

  const elems = Object.values(queueState.actions).map((queueEntry) => {
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
          formatOptionLabel={(option) => {
            const hrid = option.value.hrid as NonCombatActionTypeHrid;
            const strippedHrid = actionTypeToSkillHrid(hrid).split('/').at(-1) ?? '';
            return <GameIcon svgSetName="skills" iconName={strippedHrid} />;
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
          options={actionTypeToActionMapping[queueEntry.actionTypeHrid].map((action) => ({
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
        {/* <div className="mr-2 flex basis-2/12 justify-end">{totalSeconds.toFixed(2)}s</div> */}
        <button
          // Delete Loadout
          className="btn-error btn-outline btn"
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
    return Object.values(queueState.actions).reduce((acc, queueEntry) => {
      const actionDetail = clientData.actionDetailMap[queueEntry.actionHrid];

      const drinkStats = computeDrinkStats(drinks, queueEntry.actionTypeHrid);
      const efficiency = computeSkillEfficiency({
        actionTypeHrid: queueEntry.actionTypeHrid,
        equipmentStats,
        drinkStats,
        characterLevels,
        levelRequirement: actionDetail.levelRequirement.level,
        communityBuffs
      });

      const timePerAction = computeSkillTime({
        actionTypeHrid: queueEntry.actionTypeHrid,
        equipmentStats,
        baseTime: actionDetail.baseTimeCost
      });
      const effectiveTimePerAction = timePerAction / (1 + efficiency);
      const totalSeconds = effectiveTimePerAction * queueEntry.numActions;
      return acc + totalSeconds;
    }, 0);
  }, [queueState.actions, characterLevels, communityBuffs, drinks, equipmentStats]);

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
              <div className="stat-value">{secondsToTimeString(totalTime)}</div>
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
