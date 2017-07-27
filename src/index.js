import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
// import { Router, Route, browserHistory } from 'react-router'
import { BrowserRouter, Route } from 'react-router-dom'

import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';

import reducers from './reducers';
import App from './components/App';
import PostTool from './components/PostTool'
import StatisticApp from './components/statistic/StatisticApp'

import { TARGET_URL } from './config'

import createSocketIoMiddleware from 'redux-socket.io'
import io from 'socket.io-client'
injectTapEventPlugin();


// const store = createStore(reducers, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

// let socket = io('http://localhost:3000')
let socket = io(TARGET_URL)
let socketIoMiddleware = createSocketIoMiddleware(socket, "server/")

const store = applyMiddleware(socketIoMiddleware, thunk)(createStore)(reducers, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())


render (
  <Provider store={store}>
    <BrowserRouter>
      <MuiThemeProvider >
      <div>
        <Route exact path="/post" component={PostTool} />
        <Route exact path="/statistic" component={StatisticApp} />
        <Route path="/:targetPattern" component={App} />       
        {/*<Route path="/liveboard" component={LiveboardContainer} />*/}
      </div>
      </MuiThemeProvider>
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
)


