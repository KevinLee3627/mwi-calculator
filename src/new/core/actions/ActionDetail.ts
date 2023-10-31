import { MonsterSpawnInfo } from 'src/new/core/combat/MonsterSpawnInfo';
import { ActionCategoryHrid } from 'src/new/core/hrid/ActionCategoryHrid';
import { ActionFunctionHrid } from 'src/new/core/hrid/ActionFunctionHrid';
import { ActionHrid } from 'src/new/core/hrid/ActionHrid';
import { ActionTypeHrid } from 'src/new/core/hrid/ActionTypeHrid';
import { ItemHrid } from 'src/new/core/hrid/ItemHrid';
import { InputItem } from 'src/new/core/items/InputItem';
import { LevelRequirement } from 'src/new/core/items/LevelRequirement';
import { DropTableEntry } from 'src/new/core/skills/DropTableEntry';
import { ExperienceGain } from 'src/new/core/skills/ExperienceGain';

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
  inputItems: InputItem[] | null;
  outputItems: InputItem[] | null; // TODO - Rename?
  monsterSpawnInfo: MonsterSpawnInfo;
  sortIndex: number;
}
