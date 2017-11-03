import React from 'react';
import ReactDOM from 'react-dom';

import { applyMiddleware, createStore } from 'redux';
import { Provider } from 'react-redux';
import { Router, Route, browserHistory, IndexRoute } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import cookie from 'react-cookie';

import MasterPage from './containers/MasterPage';
import App from './containers/App';
import Login from './containers/Login';
import AdminPanel from './containers/AdminPanel';
import Sessions from './containers/Sessions';
import AddSession from './containers/AddSession';
import Users from './containers/Users';
import LastSession from './containers/LastSession';
import Tickets from './containers/Tickets';
import SessionPage from './containers/SessionPage';
import Session from './containers/Session';

import AdminMenu from './components/admin-menu';
import './css/index.css';
import allReducers from './reducers';

const store = createStore(allReducers, composeWithDevTools(applyMiddleware(thunk)));
const history = syncHistoryWithStore(browserHistory, store);

function requireAuth(nextState, replace) {
  if (JSON.stringify(store.getState().user) === '{}' || store.getState().user.error) {
  	replace({
  	  pathname: '/login'
  	});
  } 
}

function checkAdmin(nextState, replace) {
  if (store.getState().user.role !== 'admin') {
    replace({
      pathname: '/'
    });
  }
}

function AuthInit() {
  if (JSON.stringify(store.getState().user) === '{}') {
    let login = cookie.load('login');
    let role = cookie.load('role');
    let token = cookie.load('token');
    let id = cookie.load('id');
    if (login && role && token) {
      store.dispatch({type: 'CHECK_USER_SUCCESS', payload: {
        login,
        role,
        token,
        id
      }});
    }
  }
}

ReactDOM.render(
	<Provider store={store}>
	  <Router history={history} createElement={ (component, props) =>
      {
        const { location } = props
        const key = `${location.pathname}${location.search}`
        props = { ...props, key }
        return React.createElement(component, props)
      } }>
	    <Route path="/" onEnter={AuthInit} component={MasterPage}>
	      <IndexRoute component={App} onEnter={requireAuth} />
	      <Route path="login" component={Login} />
        <Route path="admin" onEnter={checkAdmin} component={AdminPanel}>
          <IndexRoute component={AdminMenu} />
          <Route path="sessions" component={Sessions}>
            <Route path=":page" component={SessionPage} />
          </Route>
          <Route path="session/:id" component={Session} />
          <Route path="addsession" component={AddSession} />
          <Route path="users" component={Users} />
        </Route>
        <Route path="last-session" onEnter={requireAuth} component={LastSession} />
        <Route path="tickets" onEnter={requireAuth} component={Tickets} />
	    </Route>
	  </Router>
	</Provider>,
  document.getElementById('root')
);
