import { ItemIcon } from 'src/components/ItemIcon';
import { clientData } from 'src/core/clientData';
import { ItemHrid } from 'src/core/hrid/ItemHrid';
import { formatNumber } from 'src/util/formatNumber';

interface ItemEntryProps {
  itemHrid: ItemHrid;
  count: number;
}

export function ItemEntry({ itemHrid, count }: ItemEntryProps) {
  const name = clientData.itemDetailMap[itemHrid].name;
  return (
    <tr>
      <td>
        <ItemIcon itemHrid={itemHrid} />
        <span className="ml-2">{name}</span>
      </td>
      <td>{formatNumber(count)}</td>
    </tr>
  );
}
