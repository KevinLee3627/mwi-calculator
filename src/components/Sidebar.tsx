import { svgHrefs } from 'src/util/svgHrefs';

export function Sidebar() {
  return (
    <div className="drawer-side">
      <label htmlFor="drawer-sidebar" className="drawer-overlay"></label>
      <aside className=" bg-base-100 ">
        <div className="hidden pl-6 pt-4 font-extrabold lg:block">
          <svg className="mr-1 inline h-4 w-4">
            <use href={`${svgHrefs.chat_icons}#book`}></use>
          </svg>
          mwi-calculator
        </div>
        <ul className="menu sticky text-base-content">
          <li>
            <span
              onClick={() => {
                const modal = document.getElementById(
                  'characterEquipmentModal'
                ) as HTMLDialogElement;
                modal.showModal();
              }}
            >
              Equipment
            </span>
          </li>
          <li>
            <span
              onClick={() => {
                const modal = document.getElementById(
                  'characterLevelModal'
                ) as HTMLDialogElement;
                modal.showModal();
              }}
            >
              Levels
            </span>
          </li>
          <li>
            <h2 className="menu-title">Gathering</h2>
            <ul>
              <li>
                <span>
                  <svg className="h-4 w-4">
                    <use href={`${svgHrefs.skills}#milking`}></use>
                  </svg>
                  Milking
                </span>
              </li>
              <li>
                <span>
                  <svg className="h-4 w-4">
                    <use href={`${svgHrefs.skills}#foraging`}></use>
                  </svg>
                  Foraging
                </span>
              </li>
              <li>
                <span>
                  <svg className="h-4 w-4">
                    <use href={`${svgHrefs.skills}#woodcutting`}></use>
                  </svg>
                  Woodcutting
                </span>
              </li>
            </ul>
          </li>
          <li>
            <h2 className="menu-title">Production</h2>
            <ul>
              <li>
                <span>
                  <svg className="h-4 w-4">
                    <use href={`${svgHrefs.skills}#cheesesmithing`}></use>
                  </svg>
                  Cheesesmithing
                </span>
              </li>
              <li>
                <span>
                  <svg className="h-4 w-4">
                    <use href={`${svgHrefs.skills}#crafting`}></use>
                  </svg>
                  Crafting
                </span>
              </li>
              <li>
                <span>
                  <svg className="h-4 w-4">
                    <use href={`${svgHrefs.skills}#tailoring`}></use>
                  </svg>
                  Tailoring
                </span>
              </li>
              <li>
                <span>
                  <svg className="h-4 w-4">
                    <use href={`${svgHrefs.skills}#cooking`}></use>
                  </svg>
                  Cooking
                </span>
              </li>
              <li>
                <span>
                  <svg className="h-4 w-4">
                    <use href={`${svgHrefs.skills}#brewing`}></use>
                  </svg>
                  Brewing
                </span>
              </li>
            </ul>
          </li>
          <li>
            <h2 className="menu-title">Miscellanous</h2>
            <ul>
              <li>
                <span>
                  <svg className="h-4 w-4">
                    <use href={`${svgHrefs.skills}#enhancing`}></use>
                  </svg>
                  Enhancing
                </span>
              </li>
            </ul>
          </li>
        </ul>
      </aside>
    </div>
  );
}
