import { GameIcon } from 'src/components/GameIcon';
import { ItemHrid } from 'src/core/hrid/ItemHrid';

interface ItemIconProps {
  itemHrid: ItemHrid;
}
export function ItemIcon({ itemHrid }: ItemIconProps) {
  const iconName = itemHrid.split('/').at(-1) as ItemHrid;
  return <GameIcon svgSetName="items" iconName={iconName} />;
}
