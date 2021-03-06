import React from 'react';
import { Route, Switch } from 'react-router-dom';
import './App.css';
import moment from 'moment'
import 'moment/locale/de'
import { SignIn, SignOut, PrivateRoute } from './features/common/auth/Auth';
import GamesAppBar from './features/common/home/GamesAppBar'
import Home from './features/common/home/Home';
import Game from './features/common/game/Game';
import Notifier from './features/common/home/Notifier';

moment.locale('de')

function App() {

  return (
    <div>
      <GamesAppBar/>
      <Notifier/>
      <Switch>
        <Route path="/signin" component={SignIn}/>
        <Route path="/signout" component={SignOut}/>
        <PrivateRoute path="/game/:id" component={Game}/>
        <PrivateRoute path="/" component={Home}/>
      </Switch>
    </div>
  );
}

export default App;
