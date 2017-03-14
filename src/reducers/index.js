import {combineReducers} from 'redux';
import reducerInstruments from './reducer-instruments';
import reducerOrders from './reducer-orders';

const allReducers = combineReducers({
	instruments: reducerInstruments,
	orders: reducerOrders
});

export default allReducers;