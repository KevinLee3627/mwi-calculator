import { ItemLocationHrid } from 'src/core/hrid/ItemLocationHrid';
import { ItemLocationTypeHrid } from 'src/core/hrid/ItemLocationTypeHrid';

export interface ItemLocationDetail {
  hrid: ItemLocationHrid;
  name: string;
  type: ItemLocationTypeHrid;
  isMultiItem: boolean;
  conflictingOtherItemLocationHrids: ItemLocationHrid[];
}
