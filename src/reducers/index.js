import {combineReducers} from 'redux';
import { routerReducer } from 'react-router-redux';

import instruments from './reducer-instruments';
import orders from './reducer-orders';
import user from './reducer-user';

const allReducers = combineReducers({
	routing: routerReducer,
	instruments,
	orders,
	user
});

export default allReducers;