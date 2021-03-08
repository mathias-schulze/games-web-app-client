import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppBar, Toolbar, IconButton, Avatar, Link, Box, Typography } from '@material-ui/core';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import { Menu, PowerSettingsNew } from '@material-ui/icons'
import { getAuth, isSignedIn } from '../auth/authSlice'
import { firestore, firebaseAuth, COLLECTION_USERS } from '../firebase/Firebase';
import { setVerified, updateIdToken } from '../auth/authSlice'
import ServerConnection from '../api/ServerConnection'
import { store } from '../store/store'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    titleBox: {
      alignItems: "center",
    },
    title: {
      margin: theme.spacing(1),
    },
    icons: {
      flexGrow: 1,
      justifyContent: "flex-end",
    },
    logoutButton: {
      color: "inherit",
    }
  }),
);

function GamesAppBar() {

  const classes = useStyles();
  const signedIn = useSelector(isSignedIn);
  const dispatch = useDispatch();
  const userId = useSelector(getAuth)?.uid;
  const history = useHistory();

  useEffect(() => {
    if (userId != null) {
      const userDocRef = firestore.collection(COLLECTION_USERS).doc(userId);
      userDocRef.get().then(function(doc) {
        if (doc.exists) {
          dispatch(setVerified(doc.data()?.verified))
        }
      }).catch(function(error) {
        console.log("Error getting document:", error);
      });
    }
  }, [dispatch, userId]);

  return (
    <div>
      {signedIn &&
        <AppBar position="static" className={classes.root}>
          <Toolbar>
            <Link href="/" color="inherit" underline="none" 
                onClick={(e: React.SyntheticEvent) => {
                  e.preventDefault();
                  history.push("/");
                }}>
              <Box display="flex" className={classes.titleBox}>
                <Menu fontSize="large"/>
                <Typography variant="h6" className={classes.title}>Spiele</Typography>
              </Box>
            </Link>
            <Box display="flex" className={classes.icons}>
              <IconButton edge="end">
                <PlayerAvatar/>
              </IconButton>
              <ServerConnection/>
              <IconButton edge="end" className={classes.logoutButton} href="/signout">
                <PowerSettingsNew fontSize="large"/>
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>
      }
    </div>
  )
}

function PlayerAvatar() {
  
  const auth = useSelector(getAuth);

  useEffect(() => {
    const startRefreshIdToken = setInterval(() => refreshIdToken(), 1800000);
    return () => clearInterval(startRefreshIdToken);
  }, [])

  let initial = "?";
  let photoURL = null;

  if (auth != null) {
    photoURL = auth.photoURL;
    if (auth.name != null) {
      initial = auth.name.charAt(0);
    }
  }

  return (
    <div>
      {photoURL == null && <Avatar>{initial}</Avatar>}
      {photoURL != null && <Avatar src={photoURL}></Avatar>}
    </div>
  )
}

const refreshIdToken = async () => {
  
  const dispatch = store.dispatch;

  firebaseAuth().currentUser?.getIdToken(true).then(idToken => {
    const auth = store.getState().auth.auth;
    if (auth) {
      dispatch(updateIdToken(idToken));
    }
  })
}

export default GamesAppBar
