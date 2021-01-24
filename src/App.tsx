import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './App.css';
import { SignIn, SignOut, PrivateRoute } from './features/common/auth/Auth';
import { isSignedIn } from './features/common/auth/authSlice'
import { AppBar, Toolbar, IconButton, Typography, Link } from '@material-ui/core';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import { PowerSettingsNew } from '@material-ui/icons'
import Home from './features/common/home/Home';

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

function App() {

  const classes = useStyles();
  const signedIn = useSelector(isSignedIn)

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
              Spiele
          </Typography>
          {signedIn &&
            <IconButton edge="end" className={classes.logoutButton} href="/signout">
              <PowerSettingsNew/>
            </IconButton>
          }
        </Toolbar>
      </AppBar>
      <Switch>
        <Route path="/signin" component={SignIn}/>
        <Route path="/signout" component={SignOut}/>
        <PrivateRoute path="/" component={Home}/>
      </Switch>
    </div>
  );
}

export default App;
