import React from 'react';
import ReactDOM from 'react-dom';

import {createStore} from 'redux';
import {Provider} from 'react-redux';


import App from './containers/App';
import './index.css';
import allReducers from './reducers';

const store = createStore(allReducers);
window.store = store;

ReactDOM.render(
	<Provider store={store}>
  		<App />
  	</Provider>,
  document.getElementById('root')
);
