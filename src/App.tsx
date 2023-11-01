import { Bars3Icon } from '@heroicons/react/24/solid';
import { Sidebar } from 'src/components/Sidebar';

const App = () => {
  return (
    <>
      <div className="drawer lg:drawer-open">
        <input type="checkbox" id="drawer-sidebar" className="drawer-toggle" />
        <div className="drawer-content flex flex-col items-center justify-center">
          <nav className="navbar w-full lg:hidden">
            <div className="flex flex-1 ">
              <span
                className="tooltip tooltip-bottom sticky top-0 before:text-xs before:content-[attr(data-tip)]"
                data-tip="Menu"
              >
                <label className="btn-ghost btn-square btn" htmlFor="drawer-sidebar">
                  <Bars3Icon className="h-8 w-8" />
                </label>
              </span>
              <div className="flex place-items-center gap-2">
                <span className="font-extrabold">mwi-calculator</span>
              </div>
            </div>
          </nav>
          <div className="flex-1">test</div>
        </div>
        <Sidebar />
      </div>
    </>
  );
};

export default App;
