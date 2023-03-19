import { configureStore } from '@reduxjs/toolkit';
import user from '@store/userSlice';
import app from '@store/appSlice';

const middleware = [];
if (process.env.NODE_ENV === `development`) {
  const { logger } = require(`redux-logger`);

  middleware.push(logger);
}

export const store = configureStore({
  reducer: {
    user,
    app,
  },
  middleware,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
