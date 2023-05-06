import { Course } from '@_types/school';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '@store';
import _ from 'lodash';

export type SchoolState = {};

const initialState: SchoolState = {};

export const schoolSlice = createSlice({
  initialState,
  name: 'registrations',
  reducers: {},
});

export const {} = schoolSlice.actions;

// selectors
export const selectSchool = (state: RootState) => state.school;

export default schoolSlice.reducer;
