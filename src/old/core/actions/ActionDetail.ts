import { MonsterSpawnInfo } from 'src/old/core/combat/MonsterSpawnInfo';
import { ActionCategoryHrid } from 'src/old/core/hrid/ActionCategoryHrid';
import { ActionFunctionHrid } from 'src/old/core/hrid/ActionFunctionHrid';
import { ActionHrid } from 'src/old/core/hrid/ActionHrid';
import { ActionTypeHrid } from 'src/old/core/hrid/ActionTypeHrid';
import { ItemHrid } from 'src/old/core/hrid/ItemHrid';
import { InputItem } from 'src/old/core/items/InputItem';
import { LevelRequirement } from 'src/old/core/items/LevelRequirement';
import { DropTableEntry } from 'src/old/core/skills/DropTableEntry';
import { ExperienceGain } from 'src/old/core/skills/ExperienceGain';

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
