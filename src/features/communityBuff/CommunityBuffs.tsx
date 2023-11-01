import { GameIcon } from 'src/components/GameIcon';
import { clientData } from 'src/core/clientData';
import {
  selectCommunityBuffs,
  setBuffLevel
} from 'src/features/communityBuff/communityBuffSlice';
import { useAppDispatch } from 'src/hooks/useAppDispatch';
import { useAppSelector } from 'src/hooks/useAppSelector';

export function CommunityBuffs() {
  const dispatch = useAppDispatch();
  const communityBuffs = useAppSelector(selectCommunityBuffs);

  const buffs = Object.values(clientData.communityBuffTypeDetailMap).map((buffDetail) => (
    <div key={buffDetail.hrid}>
      <label className="label">
        <span className="label-text">
          <GameIcon
            svgSetName="buffs"
            iconName={buffDetail.buff.typeHrid.split('/').at(-1) ?? ''}
          />
          {buffDetail.name}
        </span>
      </label>
      <input
        type="number"
        className="input-primary input"
        min={0}
        max={20}
        value={communityBuffs[buffDetail.hrid]}
        onChange={(e) => {
          const value = parseInt(e.target.value, 10);

          dispatch(setBuffLevel({ buffHrid: buffDetail.hrid, level: value }));
        }}
      />
    </div>
  ));
  return (
    <dialog id="communityBuffsModal" className="modal modal-bottom sm:modal-middle">
      <form method="dialog" className="modal-box sm:min-w-max">
        <h2 className="text-lg font-bold">Community Buffs</h2>
        <span>
          Enter buff <strong>levels</strong> below
        </span>
        <div>{buffs}</div>
      </form>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
}
