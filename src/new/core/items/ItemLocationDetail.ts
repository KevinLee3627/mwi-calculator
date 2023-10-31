import { ItemLocationHrid } from 'src/old/core/hrid/ItemLocationHrid';
import { ItemLocationTypeHrid } from 'src/old/core/hrid/ItemLocationTypeHrid';

export interface ItemLocationDetail {
  hrid: ItemLocationHrid;
  name: string;
  type: ItemLocationTypeHrid;
  isMultiItem: boolean;
  conflictingOtherItemLocationHrids: ItemLocationHrid[];
}
