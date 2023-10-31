import { ItemCategoryHrid } from 'src/old/core/hrid/ItemCategoryHrid';

export interface ItemCategoryDetail {
  hrid: ItemCategoryHrid;
  name: string;
  pluralName: string;
  sortIndex: number;
}
