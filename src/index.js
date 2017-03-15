import React from 'react';
import ReactDOM from 'react-dom';

import { applyMiddleware, createStore } from 'redux';
import { Provider } from 'react-redux';
import { Router, Route, browserHistory, IndexRoute } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';

import App from './containers/App';
import Login from './containers/Login';
import MasterPage from './components/MasterPage';
import './css/index.css';
import allReducers from './reducers';

const store = createStore(allReducers, composeWithDevTools(applyMiddleware(thunk)));
const history = syncHistoryWithStore(browserHistory, store);

function requireAuth(nextState, replace) {
  if (JSON.stringify(store.getState().user) === '{}') {
  	replace('/trade-app/login');
  } 
}

ReactDOM.render(
	<Provider store={store}>
	  <Router history={history}>
	    <Route path="/trade-app" component={MasterPage}>
	      <IndexRoute component={App} onEnter={requireAuth} />
	      <Route path="/trade-app/login" component={Login} />
	    </Route>
  	  </Router>
  	</Provider>,
  document.getElementById('root')
);
