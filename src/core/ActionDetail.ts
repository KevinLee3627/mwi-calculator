import { DropTableEntry } from 'src/core/DropTableEntry';
import { ExperienceGain } from 'src/core/ExperienceGain';
import { ActionCategoryHrid } from 'src/core/hrid/ActionCategoryHrid';
import { ActionFunctionHrid } from 'src/core/hrid/ActionFunctionHrid';
import { ActionHrid } from 'src/core/hrid/ActionHrid';
import { ActionTypeHrid } from 'src/core/hrid/ActionTypeHrid';
import { ItemHrid } from 'src/core/hrid/ItemHrid';
import { InputItem } from 'src/core/InputItem';
import { LevelRequirement } from 'src/core/items/LevelRequirement';
import { MonsterSpawnInfo } from 'src/core/MonsterSpawnInfo';

export interface ActionDetail {
  hrid: ActionHrid;
  function: ActionFunctionHrid;
  type: ActionTypeHrid;
  category: ActionCategoryHrid;
  name: string;
  levelRequirement: LevelRequirement;
  baseTimeCost: number;
  experienceGain: ExperienceGain;
  dropTable: null | DropTableEntry[];
  rareDropTable: null | DropTableEntry[];
  upgradeItemHrid: '' | ItemHrid;
  inputItems: InputItem[];
  outputItems: InputItem[]; // TODO - Rename?
  monsterSpawnInfo: MonsterSpawnInfo;
  sortIndex: number;
}
