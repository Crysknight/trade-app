import {combineReducers} from 'redux';
import { routerReducer } from 'react-router-redux';

import errors from './reducer-errors';
import processes from './reducer-processes';
import popUp from './reducer-pop-up';
import instruments from './reducer-instruments';
import orders from './reducer-orders';
import user from './reducer-user';
import session from './reducer-session';
import sessions from './reducer-sessions';
import deals from './reducer-deals';
import interval from './reducer-interval';
import adminInstruments from './reducer-admin-instruments';
import adminUsers from './reducer-admin-users';
import lastSession from './reducer-last-session';
import tickets from './reducer-tickets';

const allReducers = combineReducers({
	routing: routerReducer,
	errors,
	processes,
	popUp,
	instruments,
	orders,
	user,
	session,
	sessions,
	deals,
	interval,
	adminInstruments,
	adminUsers,
	lastSession,
	tickets
});

export default allReducers;