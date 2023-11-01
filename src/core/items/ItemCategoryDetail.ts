import { ItemCategoryHrid } from 'src/new/core/hrid/ItemCategoryHrid';

export interface ItemCategoryDetail {
  hrid: ItemCategoryHrid;
  name: string;
  pluralName: string;
  sortIndex: number;
}
