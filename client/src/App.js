import React from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Login from './components/login'
import Home from './components/home'

function AppRouter() {
  return (
    <Router>
      <div>
        <Switch>
            <Route path="/login/" component={Login} />
            <Route component={Home} />
        </Switch>
      </div>
    </Router>
  );
}

export default AppRouter;