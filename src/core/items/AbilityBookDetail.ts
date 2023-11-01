import { AbilityHrid } from 'src/core/hrid/AbilityHrid';
import { LevelRequirement } from 'src/core/items/LevelRequirement';

export interface AbilityBookDetail {
  abilityHrid: AbilityHrid | '';
  levelRequirements: null | LevelRequirement[];
  experienceGain: number;
}
