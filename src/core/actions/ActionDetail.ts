import { MonsterSpawnInfo } from 'src/core/combat/MonsterSpawnInfo';
import { ActionCategoryHrid } from 'src/core/hrid/ActionCategoryHrid';
import { ActionFunctionHrid } from 'src/core/hrid/ActionFunctionHrid';
import { ActionHrid } from 'src/core/hrid/ActionHrid';
import { ActionTypeHrid } from 'src/core/hrid/ActionTypeHrid';
import { ItemHrid } from 'src/core/hrid/ItemHrid';
import { InputItem } from 'src/core/items/InputItem';
import { LevelRequirement } from 'src/core/items/LevelRequirement';
import { DropTableEntry } from 'src/core/skills/DropTableEntry';
import { ExperienceGain } from 'src/core/skills/ExperienceGain';

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
