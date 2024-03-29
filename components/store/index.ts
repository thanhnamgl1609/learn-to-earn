import { configureStore, createAsyncThunk } from '@reduxjs/toolkit';
import user from '@store/userSlice';
import app from '@store/appSlice';
import manage from '@store/manageSlice';
import school from '@store/schoolSlice';

const middleware = [];
if (process.env.NODE_ENV === `development`) {
  const { logger } = require(`redux-logger`);

  middleware.push(logger);
}

export const store = configureStore({
  reducer: {
    user,
    app,
    manage,
    school,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(...middleware),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export const createAppAsyncThunk = createAsyncThunk.withTypes<{
  state: RootState;
  dispatch: AppDispatch;
  rejectValue: string;
  extra: { s: string; n: number };
}>();
