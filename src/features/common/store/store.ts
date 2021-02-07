import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import appReducer from '../home/appSlice';
import authReducer from '../auth/authSlice';
import apiReducer from '../api/apiSlice';

export const store = configureStore({
  reducer: {
    app: appReducer,
    auth: authReducer,
    api: apiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
