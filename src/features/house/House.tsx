import { GameIcon } from 'src/components/GameIcon';
import { clientData } from 'src/core/clientData';
import { setRoomLevel } from 'src/features/house/houseSlice';
import { useAppDispatch } from 'src/hooks/useAppDispatch';
import { useStats } from 'src/hooks/useStats';

export function House() {
  const dispatch = useAppDispatch();
  const { house } = useStats();

  const rooms = Object.values(clientData.houseRoomDetailMap).map((room) => {
    return (
      <div key={room.hrid}>
        <label className="label">
          <span className="label-text">
            <GameIcon
              svgSetName="skills"
              iconName={room.skillHrid.split('/').at(-1) ?? ''}
            />
            {room.name}
          </span>
        </label>
        <input
          type="number"
          className="input-primary input"
          min={0}
          max={20}
          value={house[room.hrid]}
          onChange={(e) => {
            const value = parseInt(e.target.value, 10);

            dispatch(setRoomLevel({ houseRoomHrid: room.hrid, level: value }));
          }}
        />
      </div>
    );
  });

  return (
    <dialog id="houseModal" className="modal modal-bottom sm:modal-middle">
      <form method="dialog" className="modal-box sm:min-w-max">
        <h2 className="text-lg font-bold">House</h2>
        <span>Enter room levels below</span>
        <div>{rooms}</div>
      </form>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
}
