import { AbilityHrid } from 'src/old/core/hrid/AbilityHrid';
import { LevelRequirement } from 'src/old/core/items/LevelRequirement';

export interface AbilityBookDetail {
  abilityHrid: AbilityHrid | '';
  levelRequirements: null | LevelRequirement[];
  experienceGain: number;
}
