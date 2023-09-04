export function Sidebar() {
  return (
    <div className="drawer-side">
      <label htmlFor="drawer-sidebar" className="drawer-overlay"></label>
      <aside className=" bg-base-100 ">
        <div className="hidden pl-6 pt-4 font-extrabold lg:block">mwi-calculator</div>
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
              Set Loadout
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
              Set Levels
            </span>
          </li>
          <li>
            <h2 className="menu-title">Gathering</h2>
            <ul>
              <li>
                <span>Milking</span>
              </li>
              <li>
                <span>Foraging</span>
              </li>
              <li>
                <span>Woodcutting</span>
              </li>
            </ul>
          </li>
          <li>
            <h2 className="menu-title">Production</h2>
            <ul>
              <li>
                <span>Cheesesmithing</span>
              </li>
              <li>
                <span>Crafting</span>
              </li>
              <li>
                <span>Tailoring</span>
              </li>
              <li>
                <span>Cooking</span>
              </li>
              <li>
                <span>Brewing</span>
              </li>
            </ul>
          </li>
          <li>
            <h2 className="menu-title">Miscellanous</h2>
            <ul>
              <li>
                <span>Enhancing</span>
              </li>
            </ul>
          </li>
        </ul>
      </aside>
    </div>
  );
}
