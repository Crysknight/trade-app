import {combineReducers} from 'redux';
import { routerReducer } from 'react-router-redux';

import instruments from './reducer-instruments';
import orders from './reducer-orders';
import user from './reducer-user';
import addingOrders from './reducer-adding-orders';
import session from './reducer-session';
import deals from './reducer-deals';

const allReducers = combineReducers({
	routing: routerReducer,
	instruments,
	orders,
	user,
	addingOrders,
	session,
	deals
});

export default allReducers;