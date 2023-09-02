export const Header = () => {
  return (
    <div className="navbar bg-base-100">
      <div className="navbar-start">
        <a className="btn-ghost btn text-xl font-extrabold normal-case">mwi-calculator</a>
      </div>
      <div className="navbar-end flex gap-4">
        <button
          className="btn-primary btn"
          onClick={() => {
            const modal = document.getElementById(
              'characterEquipmentModal'
            ) as HTMLDialogElement;
            modal.showModal();
          }}
        >
          Set Loadout
        </button>
        <button
          className="btn-primary btn"
          onClick={() => {
            const modal = document.getElementById(
              'characterLevelModal'
            ) as HTMLDialogElement;
            modal.showModal();
          }}
        >
          Set Levels
        </button>
      </div>
    </div>
  );
};
