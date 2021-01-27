import React from 'react'
import { useSelector } from 'react-redux';
import { AppBar, Toolbar, IconButton, Typography, Avatar } from '@material-ui/core';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import { PowerSettingsNew } from '@material-ui/icons'
import { getAuth } from '../auth/authSlice'

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
  
  return (
    <AppBar position="static" className={classes.root}>
      <Toolbar>
        <Typography variant="h6" className={classes.title}>
            Spiele
        </Typography>
        <PlayerAvatar/>
        <IconButton edge="end" className={classes.logoutButton} href="/signout">
            <PowerSettingsNew/>
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
