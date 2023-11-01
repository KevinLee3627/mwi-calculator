import { AbilityHrid } from 'src/new/core/hrid/AbilityHrid';
import { LevelRequirement } from 'src/new/core/items/LevelRequirement';

export interface AbilityBookDetail {
  abilityHrid: AbilityHrid | '';
  levelRequirements: null | LevelRequirement[];
  experienceGain: number;
}
