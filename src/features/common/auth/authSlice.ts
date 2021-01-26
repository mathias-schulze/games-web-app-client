import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store/store';
import { firestore, COLLECTION_USERS } from '../firebase/Firebase'

export type Auth = {
  uid: string | null,
  name: string | null,
}

interface AuthState {
  auth: Auth | null,
  signedIn: boolean,
  signInRedirectUrl: string,
  verified: boolean,
}

const initialState: AuthState = {
  auth: null,
  signedIn: false,
  signInRedirectUrl: '/',
  verified: false,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    signIn: (state, action: PayloadAction<Auth>) => {
      state.auth = action.payload;
      state.signedIn = (state.auth !== null);

      createUserIfNotExists(action.payload);
    },
    signOut: (state) => {
      state.auth = null;
      state.signedIn = false;
    },
    setSignRedirectUrl: (state, action: PayloadAction<string>) => {
      state.signInRedirectUrl = action.payload;
    },
    setVerified: (state, action: PayloadAction<boolean>) => {
      state.verified = action.payload;
    },
  },
});

export const { signIn, signOut, setSignRedirectUrl, setVerified } = authSlice.actions;

export const getAuth = (state: RootState) => state.auth.auth;
export const isSignedIn = (state: RootState) => state.auth.signedIn;
export const isVerified = (state: RootState) => state.auth.verified;
export const getSignInRedirectUrl = (state: RootState) => state.auth.signInRedirectUrl;

function createUserIfNotExists(auth: Auth) : void {

  const userId = auth.uid;
  if (userId) {
    const userDocRef = firestore.collection(COLLECTION_USERS).doc(userId);
    userDocRef.get().then(function(doc) {
      if (!doc.exists) {
        userDocRef.set({ name: auth.name, verified: false });
      }
    }).catch(function(error) {
      console.log("Error getting document:", error);
    });
  }
}

export default authSlice.reducer;
