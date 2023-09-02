export const Header = () => {
  return (
    <div className="navbar bg-base-100">
      <div className="navbar-start">
        <a className="btn-ghost btn text-xl font-extrabold normal-case">mwi-calculator</a>
      </div>
      <div className="navbar-end">
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
      </div>
    </div>
  );
};
