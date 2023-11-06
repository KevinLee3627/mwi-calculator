import { HouseRoomHrid } from 'src/core/hrid/HouseRoomHrid';
import { SkillHrid } from 'src/core/hrid/SkillHrid';

export const skillHridToRoomHrid: Record<
  Exclude<SkillHrid, '/skills/total_level'>,
  HouseRoomHrid
> = {
  '/skills/attack': '/house_rooms/dojo',
  '/skills/brewing': '/house_rooms/brewery',
  '/skills/cheesesmithing': '/house_rooms/forge',
  '/skills/cooking': '/house_rooms/kitchen',
  '/skills/crafting': '/house_rooms/workshop',
  '/skills/defense': '/house_rooms/armory',
  '/skills/enhancing': '/house_rooms/laboratory',
  '/skills/foraging': '/house_rooms/garden',
  '/skills/intelligence': '/house_rooms/library',
  '/skills/magic': '/house_rooms/mystical_study',
  '/skills/milking': '/house_rooms/dairy_barn',
  '/skills/power': '/house_rooms/gym',
  '/skills/ranged': '/house_rooms/archery_range',
  '/skills/stamina': '/house_rooms/dining_room',
  '/skills/tailoring': '/house_rooms/sewing_parlor',
  '/skills/woodcutting': '/house_rooms/log_shed'
};
