import {combineReducers} from 'redux';
import { routerReducer } from 'react-router-redux';

import instruments from './reducer-instruments';
import orders from './reducer-orders';
import user from './reducer-user';
import addingOrders from './reducer-adding-orders';

const allReducers = combineReducers({
	routing: routerReducer,
	instruments,
	orders,
	user,
	addingOrders
});

export default allReducers;