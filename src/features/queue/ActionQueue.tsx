import { EllipsisVerticalIcon } from '@heroicons/react/24/solid';
import { useMemo } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import { Select } from 'src/components/Select';
import { clientData } from 'src/core/clientData';

export function ActionQueue() {
  const ResponsiveGridLayout = useMemo(() => WidthProvider(Responsive), []);
  const skillOptions = useMemo(() => {
    return Object.values(clientData.skillDetailMap).map((detail) => ({
      label: detail.name,
      value: detail
    }));
  }, []);

  const layout = [
    { i: 'a', x: 0, y: 0, w: 1, h: 1 },
    { i: 'b', x: 0, y: 1, w: 1, h: 1 },
    { i: 'c', x: 0, y: 2, w: 1, h: 1 }
  ];

  const elems = layout.map((entry) => {
    return (
      <div key={entry.i} className="flex w-24 gap-2">
        {/* eslint-disable-next-line tailwindcss/no-custom-classname */}
        <EllipsisVerticalIcon className="queue-drag-handle h-6 w-6" />
        <Select options={skillOptions} />
        <Select />
        <input
          type="number"
          className="input-bordered input-primary input"
          placeholder="# Of Actions"
        />
      </div>
    );
  });
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
          layouts={{ default: layout }}
          // lg and xxs are required for some reason? Throws an error if not included.
          cols={{ default: 1, lg: 1, sm: 1, xs: 1, xxs: 1 }}
          // TODO: Can we not hardcode this?
          rowHeight={64}
          draggableHandle=".queue-drag-handle"
          onDragStop={(layout) => {
            console.log(layout);
          }}
          // https://github.com/react-grid-layout/react-grid-layout/issues/858#issuecomment-428539577
          // This makes performance ~6x slower than normal, according to documentation
          useCSSTransforms={false}
        >
          {elems}
        </ResponsiveGridLayout>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
}
