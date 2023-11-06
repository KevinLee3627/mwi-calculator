import { SvgHref } from 'src/core/icons/SvgHref';
import { SvgSetName } from 'src/core/icons/SvgSetName';

// NOTE: When downloading new items svg, download using curl instead of network tab
// for some reason, downloading image from network tab only gets first 1MB instead of
// the full svg
export const svgHrefs: Record<SvgSetName, SvgHref> = {
  buffs: '/buffs_sprite.cd54d85e.svg',
  chat_icons: '/chat_icons_sprite.5f91ac63.svg',
  items: '/items_sprite.018a3c6e.svg',
  logos: '/logos_sprite.834e6b9d.svg',
  skills: '/skills_sprite.3704eb13.svg',
  upgrades: '/upgrades_sprite.289c6337.svg',
  abilities: '/abilities_sprite.eeabae4c.svg',
  actions: '/actions_sprite.7444dae9.svg'
};
