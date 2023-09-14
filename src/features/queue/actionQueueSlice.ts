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

interface DeleteActionQueueEntryPayload {}

interface ChangeSkillPayload {}

interface ChangeActionPayload {}

interface UpdateNumActionsPayload {
  index: number;
  value: number;
}

interface MoveEntryPayload {}

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
    updateNumActions: (state, action: PayloadAction<UpdateNumActionsPayload>) => {
      const { payload } = action;
      state[payload.index].numActions = payload.value;
    }
  }
});

export const { createActionQueueEntry, updateNumActions } = actionQueueSlice.actions;

export const selectActionQueueState = (state: RootState) => state.actionQueue;
