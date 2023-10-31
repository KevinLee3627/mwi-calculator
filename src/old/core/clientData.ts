import { ActionCategoryDetail } from 'src/old/core/actions/ActionCategoryDetail';
import { ActionDetail } from 'src/old/core/actions/ActionDetail';
import { ActionTypeDetail } from 'src/old/core/actions/ActionTypeDetail';
import { BuffTypeDetail } from 'src/old/core/buffs/BuffTypeDetail';
import { CommunityBuffTypeDetail } from 'src/old/core/buffs/CommunityBuffTypeDetail';
import clientDataJson from 'src/old/core/clientData.json';
import { AbilityHrid } from 'src/old/core/hrid/AbilityHrid';
import { ActionCategoryHrid } from 'src/old/core/hrid/ActionCategoryHrid';
import { ActionHrid } from 'src/old/core/hrid/ActionHrid';
import { ActionTypeHrid } from 'src/old/core/hrid/ActionTypeHrid';
import { BuffTypeHrid } from 'src/old/core/hrid/BuffTypeHrid';
import { CommunityBuffTypeHrid } from 'src/old/core/hrid/CommunityBuffTypeHrid';
import { EquipmentTypeHrid } from 'src/old/core/hrid/EquipmentTypeHrid';
import { ItemCategoryHrid } from 'src/old/core/hrid/ItemCategoryHrid';
import { ItemHrid } from 'src/old/core/hrid/ItemHrid';
import { ItemLocationHrid } from 'src/old/core/hrid/ItemLocationHrid';
import { SkillHrid } from 'src/old/core/hrid/SkillHrid';
import { EquipmentTypeDetail } from 'src/old/core/items/EquipmentTypeDetail';
import { ItemCategoryDetail } from 'src/old/core/items/ItemCategoryDetail';
import { ItemDetail } from 'src/old/core/items/ItemDetail';
import { ItemLocationDetail } from 'src/old/core/items/ItemLocationDetail';
import { SkillDetail } from 'src/old/core/skills/SkillDetail';

interface ClientData {
  type: 'init_client_data';
  gameVersion: string;
  versionTimestamp: string;
  currentTimestamp: string;
  levelExperienceTable: number[];
  skillDetailMap: Record<SkillHrid, SkillDetail>;
  abilityDetailMap: Record<AbilityHrid, unknown>; // TODO?
  itemDetailMap: Record<ItemHrid, ItemDetail>;
  itemCategoryDetailMap: Record<ItemCategoryHrid, ItemCategoryDetail>;
  itemLocationDetailMap: Record<ItemLocationHrid, ItemLocationDetail>;
  equipmentTypeDetailMap: Record<EquipmentTypeHrid, EquipmentTypeDetail>;
  enhancementLevelSuccessRateTable: number[];
  enhancementLevelTotalBonusMultiplierTable: number[];
  actionDetailMap: Record<ActionHrid, ActionDetail>;
  actionTypeDetailMap: Record<ActionTypeHrid, ActionTypeDetail>;
  actionCategoryDetailMap: Record<ActionCategoryHrid, ActionCategoryDetail>;
  buffTypeDetailMap: Record<BuffTypeHrid, BuffTypeDetail>;
  communityBuffTypeDetailMap: Record<CommunityBuffTypeHrid, CommunityBuffTypeDetail>;
}

export const clientData: ClientData = clientDataJson as unknown as ClientData;
