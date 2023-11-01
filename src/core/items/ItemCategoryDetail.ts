import { ItemCategoryHrid } from 'src/core/hrid/ItemCategoryHrid';

export interface ItemCategoryDetail {
  hrid: ItemCategoryHrid;
  name: string;
  pluralName: string;
  sortIndex: number;
}
