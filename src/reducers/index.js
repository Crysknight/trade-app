import {combineReducers} from 'redux';
import { routerReducer } from 'react-router-redux';

import errors from './reducer-errors';
import processes from './reducer-processes';
import instruments from './reducer-instruments';
import orders from './reducer-orders';
import user from './reducer-user';
import session from './reducer-session';
import deals from './reducer-deals';
import interval from './reducer-interval';
import adminInstruments from './reducer-admin-instruments';

const allReducers = combineReducers({
	routing: routerReducer,
	errors,
	processes,
	instruments,
	orders,
	user,
	session,
	deals,
	interval,
	adminInstruments
});

export default allReducers;