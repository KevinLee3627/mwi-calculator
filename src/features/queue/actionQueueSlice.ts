import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ActionHrid } from 'src/core/hrid/ActionHrid';
import { ActionTypeHrid } from 'src/core/hrid/ActionTypeHrid';
import { RootState } from 'src/store/store';

export interface ActionQueueEntry {
  actionTypeHrid: ActionTypeHrid;
  actionHrid: ActionHrid;
  numActions: number;
}

export type ActionQueueState = ActionQueueEntry[];

export const actionQueueInitialState: ActionQueueState = [];

interface CreateActionQueueEntryPayload {
  actionTypeHrid: ActionTypeHrid;
  actionHrid: ActionHrid;
  numActions: number;
}

interface DeleteActionQueueEntryPayload {
  index: number;
}

interface UpdateActionTypePayload {
  index: number;
  actionTypeHrid: ActionTypeHrid;
}

interface UpdateActionHridPayload {
  index: number;
  actionHrid: ActionHrid;
}

interface UpdateNumActionsPayload {
  index: number;
  value: number;
}

interface ReorderActionQueuePayload {
  newState: ActionQueueState;
}

export const actionQueueSlice = createSlice({
  name: 'actionQueue',
  initialState: actionQueueInitialState,
  reducers: {
    createActionQueueEntry: (
      state,
      action: PayloadAction<CreateActionQueueEntryPayload>
    ) => {
      const { payload } = action;
      state.push(payload);
    },
    updateActionType: (state, action: PayloadAction<UpdateActionTypePayload>) => {
      const { payload } = action;
      state[payload.index].actionTypeHrid = payload.actionTypeHrid;
    },
    updateActionHrid: (state, action: PayloadAction<UpdateActionHridPayload>) => {
      const { payload } = action;
      state[payload.index].actionHrid = payload.actionHrid;
    },
    updateNumActions: (state, action: PayloadAction<UpdateNumActionsPayload>) => {
      const { payload } = action;
      state[payload.index].numActions = payload.value;
    },
    deleteActionQueueEntry: (
      state,
      action: PayloadAction<DeleteActionQueueEntryPayload>
    ) => {
      const { payload } = action;
      state.splice(payload.index, 1);
    },
    reorderActionQueue: (state, action: PayloadAction<ReorderActionQueuePayload>) => {
      const { payload } = action;
      console.log('reorder received inredux');
      console.log(payload.newState);
      return payload.newState;
    }
  }
});

export const {
  createActionQueueEntry,
  updateActionType,
  updateActionHrid,
  updateNumActions,
  deleteActionQueueEntry,
  reorderActionQueue
} = actionQueueSlice.actions;

export const selectActionQueueState = (state: RootState) => state.actionQueue;
