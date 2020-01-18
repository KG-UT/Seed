import React from "react";

import { BrowserRouter, Route, Switch } from "react-router-dom";

import Login from "./LogIn/Login";
import Dashboard from "./Dashboard/Dashboard";

class App extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={Login} />
          <Route exact path="/dashboard" component={Dashboard} />
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;
