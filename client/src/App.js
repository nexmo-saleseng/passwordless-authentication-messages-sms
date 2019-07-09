import React from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Login from './components/login'
import Home from './components/home'
import VideoCall from './components/videocall'

function AppRouter() {
  return (
    <Router>
      <div>
        <Switch>
            <Route path="/videocall/" component={VideoCall} />  
            <Route path="/login/" component={Login} />
            <Route component={Home} exact/>
        </Switch>
      </div>
    </Router>
  );
}

export default AppRouter;