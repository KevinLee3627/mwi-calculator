import { ItemLocationHrid } from 'src/new/core/hrid/ItemLocationHrid';
import { ItemLocationTypeHrid } from 'src/new/core/hrid/ItemLocationTypeHrid';

export interface ItemLocationDetail {
  hrid: ItemLocationHrid;
  name: string;
  type: ItemLocationTypeHrid;
  isMultiItem: boolean;
  conflictingOtherItemLocationHrids: ItemLocationHrid[];
}
