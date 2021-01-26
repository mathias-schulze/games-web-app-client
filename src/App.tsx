import React from 'react';
import { Route, Switch } from 'react-router-dom';
import './App.css';
import { SignIn, SignOut, PrivateRoute } from './features/common/auth/Auth';
import Home from './features/common/home/Home';

function App() {

  return (
    <div>
      <Switch>
        <Route path="/signin" component={SignIn}/>
        <Route path="/signout" component={SignOut}/>
        <PrivateRoute path="/" component={Home}/>
      </Switch>
    </div>
  );
}

export default App;
