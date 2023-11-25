export function AboutModal() {
  return (
    <dialog id="aboutModal" className="modal modal-bottom sm:modal-middle">
      <form method="dialog" className="modal-box sm:min-w-max">
        <h2 className="text-lg font-bold">About</h2>
        <p>
          Created by <strong>Granttank</strong> - PM in-game or on Discord for any issues!
        </p>
        <p>
          Thank you to <strong>holychikenz</strong> for market API and{' '}
          <strong>tristo7</strong> for original enhancing code.
        </p>
      </form>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
}
