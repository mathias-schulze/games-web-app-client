import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store/store';

interface ApiState {
  connected: boolean,
}

const initialState: ApiState = {
  connected: false,
};

export const apiSlice = createSlice({
  name: 'api',
  initialState,
  reducers: {
    setConnected: (state, action: PayloadAction<boolean>) => {
      state.connected = action.payload;
    },
  },
});

export const { setConnected } = apiSlice.actions;

export const isConnected = (state: RootState) => state.api.connected;

export default apiSlice.reducer;
