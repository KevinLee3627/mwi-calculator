import { ActionCategoryDetail } from 'src/core/actions/ActionCategoryDetail';
import { ActionDetail } from 'src/core/actions/ActionDetail';
import { ActionTypeDetail } from 'src/core/actions/ActionTypeDetail';
import { BuffTypeDetail } from 'src/core/buffs/BuffTypeDetail';
import { CommunityBuffTypeDetail } from 'src/core/buffs/CommunityBuffTypeDetail';
import clientDataJson from 'src/core/clientData.json';
import { AbilityHrid } from 'src/core/hrid/AbilityHrid';
import { ActionCategoryHrid } from 'src/core/hrid/ActionCategoryHrid';
import { ActionHrid } from 'src/core/hrid/ActionHrid';
import { ActionTypeHrid } from 'src/core/hrid/ActionTypeHrid';
import { BuffTypeHrid } from 'src/core/hrid/BuffTypeHrid';
import { CommunityBuffTypeHrid } from 'src/core/hrid/CommunityBuffTypeHrid';
import { EquipmentTypeHrid } from 'src/core/hrid/EquipmentTypeHrid';
import { ItemCategoryHrid } from 'src/core/hrid/ItemCategoryHrid';
import { ItemHrid } from 'src/core/hrid/ItemHrid';
import { ItemLocationHrid } from 'src/core/hrid/ItemLocationHrid';
import { SkillHrid } from 'src/core/hrid/SkillHrid';
import { EquipmentTypeDetail } from 'src/core/items/EquipmentTypeDetail';
import { ItemCategoryDetail } from 'src/core/items/ItemCategoryDetail';
import { ItemDetail } from 'src/core/items/ItemDetail';
import { ItemLocationDetail } from 'src/core/items/ItemLocationDetail';
import { SkillDetail } from 'src/core/skills/SkillDetail';

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
