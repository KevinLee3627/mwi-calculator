import { EllipsisVerticalIcon, TrashIcon } from '@heroicons/react/24/solid';
import { useMemo } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import { Select } from 'src/components/Select';
import { clientData } from 'src/core/clientData';
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
import { useAppDispatch } from 'src/hooks/useAppDispatch';
import { useAppSelector } from 'src/hooks/useAppSelector';

export function ActionQueue() {
  const dispatch = useAppDispatch();
  const actionQueue = useAppSelector(selectActionQueueState);

  const ResponsiveGridLayout = useMemo(() => WidthProvider(Responsive), []);
  const actionTypeOptions = useMemo(() => {
    return Object.values(clientData.actionTypeDetailMap).map((detail) => ({
      label: detail.name,
      value: detail
    }));
  }, []);
  const layout = actionQueue.map((entry, idx) => ({
    i: idx.toString(),
    x: 0,
    y: idx,
    w: 1,
    h: 1
  }));

  const elems = actionQueue.map((queueEntry, entryIndex) => {
    return (
      <div
        key={entryIndex.toString()}
        // https://github.com/react-grid-layout/react-grid-layout/issues/382
        // We need to use both data-grid here AND the layout prop in <GridLayout> for
        // the elements to re-render properly on state(redux) update.
        // data-grid={{ i: entryIndex.toString(), x: 0, y: entryIndex, w: 1, h: 1 }}
        className="flex w-24 items-center gap-2"
      >
        {/* eslint-disable-next-line tailwindcss/no-custom-classname */}
        <EllipsisVerticalIcon className="queue-drag-handle h-6 w-6" />
        <Select
          options={actionTypeOptions}
          value={{
            label: clientData.actionTypeDetailMap[queueEntry.actionTypeHrid].name,
            value: clientData.actionTypeDetailMap[queueEntry.actionTypeHrid]
          }}
          onChange={(e) => {
            const actionTypeHrid = e?.value.hrid;
            if (!actionTypeHrid) return;

            dispatch(updateActionType({ index: entryIndex, actionTypeHrid }));
          }}
        />
        <Select
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

            dispatch(updateActionHrid({ index: entryIndex, actionHrid }));
          }}
        />
        <input
          type="number"
          className="input-bordered input-primary input"
          placeholder="# Of Actions"
          value={queueEntry.numActions}
          onChange={(e) => {
            const value = parseInt(e.target.value, 10);
            dispatch(updateNumActions({ index: entryIndex, value }));
          }}
        />
        <button
          // Delete Loadout
          className="btn-error btn-outline btn"
          onClick={(e) => {
            dispatch(deleteActionQueueEntry({ index: entryIndex }));
            e.preventDefault();
          }}
        >
          <TrashIcon className="h-4 w-4" />
        </button>
      </div>
    );
  });

  console.log('new queue:', actionQueue);
  console.log('new layout:', layout);
  console.log(
    'new elems:',
    elems.map((elem) => elem.props.children[1].props.value.label)
  );

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
          // onDragStop={(newLayout, oldItem, newItem) => {
          //   console.log(`oldItem`, oldItem);
          //   console.log(`newItem`, newItem);
          //   const newState = newLayout.map((item) => {
          //     return actionQueue[item.y];
          //   });
          //   dispatch(reorderActionQueue({ newState }));
          // }}
          onLayoutChange={(newLayout) => {
            console.log(`onlayoutchange`, newLayout);
            const newState = newLayout.map((item) => {
              return actionQueue[item.y];
            });
            console.log('onlayoutchange newstate:', newState);
            dispatch(reorderActionQueue({ newState }));
          }}
          // https://github.com/react-grid-layout/react-grid-layout/issues/858#issuecomment-428539577
          // This makes performance ~6x slower than normal, according to documentation
          useCSSTransforms={false}
        >
          {elems}
        </ResponsiveGridLayout>
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
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
}
