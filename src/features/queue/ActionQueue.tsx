import { EllipsisVerticalIcon } from '@heroicons/react/24/solid';
import { useMemo } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import { range } from 'src/util/range';

export function ActionQueue() {
  const ResponsiveGridLayout = useMemo(() => WidthProvider(Responsive), []);

  const x = range(0, 10).map((num) => {
    return (
      <div key={num} className="m-2 border border-primary">
        <div className="h-4 w-4 bg-emerald-400"></div>
        <span>action {num}</span>
      </div>
    );
  });

  const layout = [
    { i: 'a', x: 0, y: 0, w: 1, h: 1 },
    { i: 'b', x: 0, y: 1, w: 1, h: 1 },
    { i: 'c', x: 0, y: 2, w: 1, h: 1 }
  ];
  return (
    <dialog id="actionQueueModal" className="modal modal-bottom sm:modal-middle">
      <form method="dialog" className="modal-box sm:min-w-max">
        <h2 className="text-lg font-bold">Action Queue</h2>
        <span>Calculate how long your queue will take.</span>
        <ResponsiveGridLayout
          // eslint-disable-next-line tailwindcss/no-custom-classname
          className="layout"
          style={{
            // https://github.com/react-grid-layout/react-grid-layout/issues/171#issuecomment-336719786
            position: 'relative'
          }}
          layouts={{ default: layout }}
          // lg and xxs are required for some reason? Throws an error if not included.
          cols={{ default: 1, lg: 1, xxs: 1 }}
          rowHeight={32}
          draggableHandle=".queue-drag-handle"
        >
          {/* eslint-disable-next-line prettier/prettier */}
          <div key="a" className="flex items-center border">
            {/* eslint-disable-next-line tailwindcss/no-custom-classname */}
            <EllipsisVerticalIcon className="queue-drag-handle h-8" />
            <span>a</span>
          </div>
          <div key="b" className="border">
            b
          </div>
          <div key="c" className="border">
            c
          </div>
        </ResponsiveGridLayout>
      </form>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
}
