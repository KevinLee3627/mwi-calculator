import { GameIcon } from 'src/components/GameIcon';
import { clientData } from 'src/core/clientData';
import { CommunityBuffTypeHrid } from 'src/core/hrid/CommunityBuffTypeHrid';
import { useStats } from 'src/hooks/useStats';
import { openModal } from 'src/util/openModal';

export function CommunityBuffsDisplay() {
  const { communityBuffs } = useStats();
  return (
    <div
      className="form-control ml-4 hover:cursor-pointer"
      onClick={() => openModal('communityBuffsModal')}
    >
      <label className="label">
        <span className="label-text">Community Buffs</span>
      </label>
      <div className="flex h-12 rounded border border-primary">
        {Object.entries(communityBuffs).map((entry) => {
          const buffHrid = entry[0] as CommunityBuffTypeHrid;
          const buffLevel = entry[1];

          const buffDetail = clientData.communityBuffTypeDetailMap[buffHrid];
          return (
            <div key={buffDetail.hrid} className="grid h-12 w-12 place-items-center">
              <GameIcon
                svgSetName="buffs"
                iconName={buffDetail.buff.typeHrid.split('/').at(-1) ?? ''}
              />
              <p>{buffLevel ?? 0}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
