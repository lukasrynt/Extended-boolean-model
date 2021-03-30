import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './components/Home';
import Content from './components/Content';


function App() {
  return (
      <Router>
          <div className="window">
              <Switch>
                  <Route path="/" exact component={Home}/>
                  <Route className="link" path="/about/:id" exact component={Content} />
              </Switch>
              <footer>Created by: Lukáš Rynt, Martin Šír</footer>
          </div>
          <div className="circle1"/>
          <div className="circle2"/>
          <div className="circle3"/>
          <div className="circle4"/>
          <div className="circle5"/>
  </Router>
  );
};


export default App;
