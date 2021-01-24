import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store/store';

export type Auth = {
  uid: string | null,
  name: string | null,
}

interface AuthState {
  auth: Auth | null,
  signedIn: boolean,
  signInRedirectUrl: string,
}

const initialState: AuthState = {
  auth: null,
  signedIn: false,
  signInRedirectUrl: '/',
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    signIn: (state, action: PayloadAction<Auth>) => {
      console.log("sign in " + state.auth?.name)
      state.auth = action.payload;
      state.signedIn = (state.auth !== null);
    },
    signOut: (state) => {
      state.auth = null;
      state.signedIn = false;
    },
    setSignRedirectUrl: (state, action: PayloadAction<string>) => {
      state.signInRedirectUrl = action.payload;
    },
  },
});

export const { signIn, signOut, setSignRedirectUrl } = authSlice.actions;

export const getAuth = (state: RootState) => state.auth.auth;
export const isSignedIn = (state: RootState) => state.auth.signedIn;
export const getsignInRedirectUrl = (state: RootState) => state.auth.signInRedirectUrl;

export default authSlice.reducer;
