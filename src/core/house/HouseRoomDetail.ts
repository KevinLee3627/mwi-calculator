import { BuffDetail } from 'src/core/buffs/BuffDetail';
import { RoomUpgradeCost } from 'src/core/house/RoomUpgradeCost';
import { ActionTypeHrid } from 'src/core/hrid/ActionTypeHrid';
import { HouseRoomHrid } from 'src/core/hrid/HouseRoomHrid';
import { SkillHrid } from 'src/core/hrid/SkillHrid';

export interface HouseRoomDetail {
  hrid: HouseRoomHrid;
  name: string;
  skillHrid: SkillHrid;
  useableInActionTypeMap: Record<ActionTypeHrid, boolean>;
  actionBuffs: BuffDetail[];
  globalBuffs: BuffDetail[];
  upgradeCostsMap: Record<string, RoomUpgradeCost[]>;
  sortIndex: number;
}
