import { ActionDetail } from 'src/core/actions/ActionDetail';
import { clientData } from 'src/core/clientData';
import { ActionTypeHrid } from 'src/core/hrid/ActionTypeHrid';

export const actionTypeHridToActions = Object.values(clientData.actionDetailMap).reduce<
  Record<ActionTypeHrid, ActionDetail[]>
>(
  (acc, val) => {
    acc[val.type].push(val);
    return acc;
  },
  {
    '/action_types/brewing': [],
    '/action_types/cheesesmithing': [],
    '/action_types/combat': [],
    '/action_types/cooking': [],
    '/action_types/crafting': [],
    '/action_types/enhancing': [],
    '/action_types/foraging': [],
    '/action_types/milking': [],
    '/action_types/tailoring': [],
    '/action_types/woodcutting': []
  }
);
