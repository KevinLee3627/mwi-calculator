export function ActionQueue() {
  return (
    <dialog id="actionQueueModal" className="modal modal-bottom sm:modal-middle">
      <form method="dialog" className="modal-box sm:min-w-max">
        <h2 className="text-lg font-bold">Action Queue</h2>
        <span>Calculate how long your queue will take.</span>
        <div>yes</div>
      </form>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
}
