import React from "react";
import { Switch, Route, useHistory, Router, Link, BrowserRouter } from "react-router-dom";

// import useLocalStorage from "./hooks/useLocalStorage";


import "./App.css";
import Index from "./components/Index/Index";
import Reset from "./components/Reset/Reset";
import LogIn from "./components/LogIn/Login";
import Dashboard from "./components/Dashboard/Dashboard";

require("dotenv").config();

const App = () => {
  // const [user, setUser] = useLocalStorage("user", "");
  // const history = useHistory();

  /* FOR PURPOSES OF PASSPORT TESTING
  if (!user) {
    history.push("/login");
  }
  */

  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          <Route exact path="/">
            <Index />
          </Route>
          <Route path="/login">
            <LogIn />
          </Route>
          <Route path="/reset">
            <Reset />
          </Route>
          <Route path="/dashboard">
            <Dashboard />
          </Route>
       </Switch>

      </BrowserRouter>
     
    </div>
  );
};

export default App;
