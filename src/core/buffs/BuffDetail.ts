import { BuffTypeHrid } from 'src/core/hrid/BuffTypeHrid';

export interface BuffDetail {
  uniqueHrid: null; // TODO
  typeHrid: BuffTypeHrid;
  ratioBoost: number;
  ratioBoostLevelBonus: number;
  flatBoost: number;
  flatBoostLevelBonus: number;
  startTime: string;
  duration: number;
}
