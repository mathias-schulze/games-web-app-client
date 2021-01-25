import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store/store';
import { firestore, COLLECTION_USERS } from '../firebase/Firebase'

export type Auth = {
  uid: string | null,
  name: string | null,
}

type User = {
  uid: string | null,
  name: string | null,
  verified: boolean,
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
      console.log("sign in " + state.auth?.name)
      state.auth = action.payload;
      state.signedIn = (state.auth !== null);
      state.verified = isUserVerified(action.payload);
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
export const getSignInRedirectUrl = (state: RootState) => state.auth.signInRedirectUrl;

function isUserVerified(auth: Auth): boolean {

  let user:User = getOrCreateUser(auth);
  return user.verified;
}

function getOrCreateUser(auth: Auth) :User {

  let user:User = { uid: null, name: null, verified: false };

  const userId = auth.uid;
  if (userId) {
    const userDocRef = firestore.collection(COLLECTION_USERS).doc(userId);
    userDocRef.get().then(function(doc) {
      if (!doc.exists) {
        userDocRef.set({ name: auth.name, verified: false });
      }
      user = { uid: userId, name: doc.data()?.name, verified: doc.data()?.verified }
    }).catch(function(error) {
      console.log("Error getting document:", error);
    });
  }

  return user;
}

export default authSlice.reducer;
