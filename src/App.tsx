import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  NavLink
} from "react-router-dom";


// TODO use react styles
//import './App.css';
import Details from './pages/Details';
import Assets from './pages/Assets';
import Home from './pages/Home';
import { AppStateProvider } from './AppState';

function App() {
  return (
    <AppStateProvider>
      <Router>
        <header>
          <nav>
            <ul className="menu">
              <li className="menu__list-item"><NavLink to="/home" activeClassName="active">Home</NavLink></li>
              <li className="menu__list-item"><NavLink to="/assets" activeClassName="active">Assets</NavLink></li>
              <li className="menu__list-item"><NavLink to="/details" activeClassName="active">Details</NavLink></li>
            </ul>
          </nav>

          <Switch>
            <Route path="/details/:symbol">
              <Details />
            </Route>
            <Route path="/details">
              <Redirect to="/details/ACME" />
            </Route>
            <Route path="/assets">
              <Assets />
            </Route>
            <Route path="/home">
              <Home />
            </Route>
            <Route paht="/">
              <Redirect to="/home" />
            </Route>
          </Switch>
        </header>
      </Router>
    </AppStateProvider>
  );
}

export default App;
