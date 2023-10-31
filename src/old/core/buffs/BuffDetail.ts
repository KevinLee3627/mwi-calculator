import { BuffTypeHrid } from 'src/old/core/hrid/BuffTypeHrid';
import { BuffUniquesHrid } from 'src/old/core/hrid/BuffUniquesHrid';

export interface BuffDetail {
  uniqueHrid: BuffUniquesHrid;
  typeHrid: BuffTypeHrid;
  ratioBoost: number;
  ratioBoostLevelBonus: number;
  flatBoost: number;
  flatBoostLevelBonus: number;
  startTime: string;
  duration: number;
}
