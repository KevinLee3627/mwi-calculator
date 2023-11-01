import { BuffTypeHrid } from 'src/core/hrid/BuffTypeHrid';

export interface BuffTypeDetail {
  hrid: BuffTypeHrid;
  isCombat: boolean;
  name: string;
  description: string;
  debuffDescription: string;
  sortIndex: number;
}
