import clientDataJson from 'src/new/clientData.json';
import { ActionCategoryDetail } from 'src/new/core/actions/ActionCategoryDetail';
import { ActionDetail } from 'src/new/core/actions/ActionDetail';
import { ActionTypeDetail } from 'src/new/core/actions/ActionTypeDetail';
import { BuffTypeDetail } from 'src/new/core/buffs/BuffTypeDetail';
import { CommunityBuffTypeDetail } from 'src/new/core/buffs/CommunityBuffTypeDetail';
import { AbilityHrid } from 'src/new/core/hrid/AbilityHrid';
import { ActionCategoryHrid } from 'src/new/core/hrid/ActionCategoryHrid';
import { ActionHrid } from 'src/new/core/hrid/ActionHrid';
import { ActionTypeHrid } from 'src/new/core/hrid/ActionTypeHrid';
import { BuffTypeHrid } from 'src/new/core/hrid/BuffTypeHrid';
import { CommunityBuffTypeHrid } from 'src/new/core/hrid/CommunityBuffTypeHrid';
import { EquipmentTypeHrid } from 'src/new/core/hrid/EquipmentTypeHrid';
import { ItemCategoryHrid } from 'src/new/core/hrid/ItemCategoryHrid';
import { ItemHrid } from 'src/new/core/hrid/ItemHrid';
import { ItemLocationHrid } from 'src/new/core/hrid/ItemLocationHrid';
import { SkillHrid } from 'src/new/core/hrid/SkillHrid';
import { EquipmentTypeDetail } from 'src/new/core/items/EquipmentTypeDetail';
import { ItemCategoryDetail } from 'src/new/core/items/ItemCategoryDetail';
import { ItemDetail } from 'src/new/core/items/ItemDetail';
import { ItemLocationDetail } from 'src/new/core/items/ItemLocationDetail';
import { SkillDetail } from 'src/new/core/skills/SkillDetail';

interface ClientData {
  type: 'init_client_data';
  gameVersion: string;
  versionTimestamp: string;
  currentTimestamp: string;
  levelExperienceTable: number[];
  skillDetailMap: Record<SkillHrid, SkillDetail>;
  abilityDetailMap: Record<AbilityHrid, unknown>; // TODO?
  abilitySlotsLevelRequirementList: number[];
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
  houseRoomDetailMap: Record<
}

export const clientData: ClientData = clientDataJson as unknown as ClientData;
