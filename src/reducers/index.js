import {combineReducers} from 'redux';
import { routerReducer } from 'react-router-redux';

import instruments from './reducer-instruments';
import orders from './reducer-orders';
import user from './reducer-user';
import addingOrders from './reducer-adding-orders';
import session from './reducer-session';

const allReducers = combineReducers({
	routing: routerReducer,
	instruments,
	orders,
	user,
	addingOrders,
	session
});

export default allReducers;