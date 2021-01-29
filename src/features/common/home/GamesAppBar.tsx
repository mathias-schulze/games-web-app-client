import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { AppBar, Toolbar, IconButton, Typography, Avatar } from '@material-ui/core';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import { PowerSettingsNew } from '@material-ui/icons'
import { getAuth } from '../auth/authSlice'
import { firestore, COLLECTION_USERS } from '../firebase/Firebase';
import { setVerified } from '../auth/authSlice'
import ServerConnection from '../api/ServerConnection'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    title: {
      flexGrow: 1,
    },
    logoutButton: {
      color: "inherit",
    }
  }),
);

function GamesAppBar() {

  const classes = useStyles();
  const dispatch = useDispatch();
  const auth = useSelector(getAuth);

  useEffect(() => {
    const userId = auth?.uid;
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
  });

  return (
    <AppBar position="static" className={classes.root}>
      <Toolbar>
        <Typography variant="h6" className={classes.title}>
            Spiele
        </Typography>
        <PlayerAvatar/>
        <ServerConnection/>
        <IconButton edge="end" className={classes.logoutButton} href="/signout">
          <PowerSettingsNew fontSize="large"/>
        </IconButton>
      </Toolbar>
    </AppBar>
  )
}

function PlayerAvatar() {
  
  const auth = useSelector(getAuth);

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

export default GamesAppBar
