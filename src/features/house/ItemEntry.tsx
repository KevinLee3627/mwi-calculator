import { Dispatch, SetStateAction } from 'react';
import { ItemIcon } from 'src/components/ItemIcon';
import { clientData } from 'src/core/clientData';
import { ItemHrid } from 'src/core/hrid/ItemHrid';
import { formatNumber } from 'src/util/formatNumber';

interface ItemEntryProps {
  itemHrid: ItemHrid;
  count: number;
  priceOverrides: Partial<Record<ItemHrid, number>>;
  setPriceOverrides: Dispatch<SetStateAction<Partial<Record<ItemHrid, number>>>>;
  defaultPrice: number;
}

export function ItemEntry({
  itemHrid,
  count,
  priceOverrides,
  setPriceOverrides,
  defaultPrice
}: ItemEntryProps) {
  const name = clientData.itemDetailMap[itemHrid].name;
  return (
    <tr>
      <td>
        <ItemIcon itemHrid={itemHrid} />
        <span className="ml-2">{name}</span>
      </td>
      <td>{formatNumber(count)}</td>
      <td>
        <input
          className="input-primary input input-sm"
          value={priceOverrides[itemHrid] ?? defaultPrice}
          onChange={(e) => {
            setPriceOverrides((state) => {
              return { ...state, [itemHrid]: e.target.value };
            });
          }}
        />
      </td>
    </tr>
  );
}
