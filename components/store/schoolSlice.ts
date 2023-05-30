import { Course } from '@_types/school';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '@store';
import _ from 'lodash';
import { KnowledgeBlockEntity } from '@_types/models/entities';

export type SchoolState = {
  knowledgeBlocks: KnowledgeBlockEntity[];
};

const initialState: SchoolState = {
  knowledgeBlocks: [],
};

export const schoolSlice = createSlice({
  initialState,
  name: 'school',
  reducers: {
    updateSchool: (state, action: PayloadAction<Partial<SchoolState>>) => {
      Object.assign(state, action.payload);
    },
  },
});

export const { updateSchool } = schoolSlice.actions;

// selectors
export const selectSchool = (state: RootState) => state.school;

export default schoolSlice.reducer;
