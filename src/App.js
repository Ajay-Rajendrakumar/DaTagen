
import './App.css';
import React, { Component } from 'react';
import { Router, Route, Switch,BrowserRouter } from "react-router-dom";
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import { createBrowserHistory } from 'history';
import Store from './store/store.js';
import Layout from './layouts/index';

import Login from './views/Authentication/Login.js';
import Dashboard from './views/dashBoard.js'
import Header from './layouts/header.js'
import { Chat } from './views/chat/Chat.js';

const history = createBrowserHistory({forceRefresh:true});

function App() {
  return (
    <Provider store={Store}>
        <Router history={history} >
          <main className="h-100">
          <BrowserRouter>
            <Switch>
           
            <Route exact={true} path="/" render={() => (
                <>
                    <div className="mainContainer" >
                      <Login  />
                    </div>
                </>
              )}
              />
              <Route exact={true} path="/dashboard" render={() => (
                <>
                    <div className="mainContainer" >
                      <Header page="PiXlr"/>
                      <Dashboard  />
                    </div>
                </>
              )}
              />
            
            </Switch>
            <ToastContainer />
            </BrowserRouter>
          </main>
        </Router>
      </Provider>
  );
}

export default App;
