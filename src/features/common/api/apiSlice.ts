import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store/store';

interface ApiState {
  connected: boolean,
  waiting: boolean,
}

const initialState: ApiState = {
  connected: false,
  waiting: false,
};

export const apiSlice = createSlice({
  name: 'api',
  initialState,
  reducers: {
    setConnected: (state, action: PayloadAction<boolean>) => {
      state.connected = action.payload;
    },
    setWaiting: (state, action: PayloadAction<boolean>) => {
      state.waiting = action.payload;
    },
  },
});

export const { setConnected, setWaiting } = apiSlice.actions;

export const isConnected = (state: RootState) => state.api.connected;
export const isWaiting = (state: RootState) => state.api.waiting;

export default apiSlice.reducer;
