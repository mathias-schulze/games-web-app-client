import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Redirect, RouteProps, useLocation, useHistory } from 'react-router-dom';
import { Dialog, DialogTitle } from '@material-ui/core';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import { signIn, signOut, isSignedIn, setSignRedirectUrl, getSignInRedirectUrl } from './authSlice'
import { firebaseAuth } from '../firebase/Firebase';

// Configure FirebaseUI.
const uiConfig = {
  signInFlow: 'popup',
  signInSuccessUrl: '/',
  signInOptions: [
    firebaseAuth.EmailAuthProvider.PROVIDER_ID,
    firebaseAuth.GoogleAuthProvider.PROVIDER_ID,
    firebaseAuth.GithubAuthProvider.PROVIDER_ID
  ],
  callbacks: {
    signInSuccessWithAuthResult: () => false
  },
};

export interface IPrivateRouteProps extends RouteProps {
  path: string
}

export const PrivateRoute: React.FC<IPrivateRouteProps> = (props) => {

  const signedIn = useSelector(isSignedIn)
  const location = useLocation();
  const dispatch = useDispatch();

  dispatch(setSignRedirectUrl(location.pathname))
  
  return signedIn ? (
    <Route {...props} component={props.component} render={undefined} />
  ) : (
    <Redirect to="/signin"/>
  )
}

export function SignIn() {

  const dispatch = useDispatch();
  const history = useHistory();
  const signRedirectUrl = useSelector(getSignInRedirectUrl);

  // Listen to the Firebase Auth state and set the local state.
  useEffect(() => {
    const unregisterAuthObserver = firebaseAuth().onAuthStateChanged(user => {
      if (user) {
        dispatch(signIn({
          uid: user.uid,
          name: (user.displayName != null ? user.displayName : user.email),
          photoURL: user.photoURL
        }))
        history.push(signRedirectUrl);
      }
    });
    return () => unregisterAuthObserver(); // Make sure we un-register Firebase observers when the component unmounts.
  });

  return (
    <Dialog open={true}>
      <DialogTitle>Anmeldung</DialogTitle>
      <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebaseAuth()} />
    </Dialog>
  );
}

export function SignOut() {

  const dispatch = useDispatch();

  useEffect(() => {
    firebaseAuth().signOut();
    dispatch(signOut());
  });

  return (
    <Redirect to="/"/>
  );
}