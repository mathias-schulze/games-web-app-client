import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import appReducer from '../home/appSlice';
import authReducer from '../auth/authSlice';
import apiReducer from '../api/apiSlice';
import heroRealmsReducer from '../../games/hero_realms/heroRealmsSlice';

export const store = configureStore({
  reducer: {
    app: appReducer,
    auth: authReducer,
    api: apiReducer,
    heroRealms: heroRealmsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
