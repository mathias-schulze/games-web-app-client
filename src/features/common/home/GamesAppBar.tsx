import React from 'react'
import { AppBar, Toolbar, IconButton, Typography } from '@material-ui/core';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import { PowerSettingsNew } from '@material-ui/icons'

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
        <IconButton edge="end" className={classes.logoutButton} href="/signout">
            <PowerSettingsNew/>
        </IconButton>
      </Toolbar>
    </AppBar>
  )
}

export default GamesAppBar
