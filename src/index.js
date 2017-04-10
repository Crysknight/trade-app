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
import Tickets from './containers/tickets';

import AdminMenu from './components/admin-menu';
import './css/index.css';
import allReducers from './reducers';

const store = createStore(allReducers, composeWithDevTools(applyMiddleware(thunk)));
const history = syncHistoryWithStore(browserHistory, store);

function requireAuth(nextState, replace) {
  if (JSON.stringify(store.getState().user) === '{}' || store.getState().user.error) {
  	replace({
  	  pathname: '/trade-app/login'
  	});
  } 
}

function checkAdmin(nextState, replace) {
  if (store.getState().user.roleName !== 'isadmin') {
    replace({
      pathname: '/trade-app/'
    });
  }
}

function AuthInit() {
  if (JSON.stringify(store.getState().user) === '{}') {
    let eMail = cookie.load('eMail');
    let roleName = cookie.load('roleName');
    let token = cookie.load('token');
    let id = cookie.load('id');
    if (eMail && roleName && token) {
      store.dispatch({type: 'CHECK_USER_SUCCESS', payload: {
        eMail,
        roleName,
        token,
        id: +id
      }});
    }
  }
}

ReactDOM.render(
	<Provider store={store}>
	  <Router history={history}>
	    <Route path="/trade-app/" onEnter={AuthInit} component={MasterPage}>
	      <IndexRoute component={App} onEnter={requireAuth} />
	      <Route path="login" component={Login} />
        <Route path="admin" onEnter={checkAdmin} component={AdminPanel}>
          <IndexRoute component={AdminMenu} />
          <Route path="sessions" component={Sessions} />
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
