import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Layout } from 'react-grid-layout';
import { ActionHrid } from 'src/core/hrid/ActionHrid';
import { ActionTypeHrid } from 'src/core/hrid/ActionTypeHrid';
import { RootState } from 'src/store/store';

export interface ActionQueueEntry {
  id: string;
  actionTypeHrid: ActionTypeHrid;
  actionHrid: ActionHrid;
  numActions: number;
}

export interface ActionQueueState {
  actions: Record<string, ActionQueueEntry>;
  layout: Layout[];
}

export const actionQueueInitialState: ActionQueueState = {
  actions: {},
  layout: []
};

interface CreateActionQueueEntryPayload {
  actionTypeHrid: ActionTypeHrid;
  actionHrid: ActionHrid;
  numActions: number;
}

interface DeleteActionQueueEntryPayload {
  id: string;
}

interface UpdateActionTypePayload {
  id: string;
  actionTypeHrid: ActionTypeHrid;
}

interface UpdateActionHridPayload {
  id: string;
  actionHrid: ActionHrid;
}

interface UpdateNumActionsPayload {
  id: string;
  value: number;
}

interface ReorderActionQueuePayload {
  newLayout: Layout[];
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
      const newId = self.crypto.randomUUID();
      state.actions[newId] = { ...payload, id: newId };
    },
    updateActionType: (state, action: PayloadAction<UpdateActionTypePayload>) => {
      const { payload } = action;
      state.actions[payload.id].actionTypeHrid = payload.actionTypeHrid;
    },
    updateActionHrid: (state, action: PayloadAction<UpdateActionHridPayload>) => {
      const { payload } = action;
      state.actions[payload.id].actionHrid = payload.actionHrid;
    },
    updateNumActions: (state, action: PayloadAction<UpdateNumActionsPayload>) => {
      const { payload } = action;
      state.actions[payload.id].numActions = payload.value;
    },
    deleteActionQueueEntry: (
      state,
      action: PayloadAction<DeleteActionQueueEntryPayload>
    ) => {
      const { payload } = action;
      const idIndex = state.layout.findIndex((entry) => entry.i === payload.id);
      if (idIndex > 0) {
        delete state.layout[idIndex];
      }
      delete state.actions[payload.id];
    },
    reorderActionQueue: (state, action: PayloadAction<ReorderActionQueuePayload>) => {
      const { payload } = action;
      state.layout = payload.newLayout;
      return state;
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
