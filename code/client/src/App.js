import React from "react";
import Signup from "./Pages/Signup/Signup";
import Signin from "./Pages/Signin/Signin";
import Landing from "./Pages/Landing/Landing";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

const App = () => {
  return (
    <Router>
      <Switch>
        <Route path="/signin">
          <Signin />
        </Route>
        <Route path="/signup">
          <Signup />
        </Route>
      </Switch>
    </Router>
  );
};

export default App;
