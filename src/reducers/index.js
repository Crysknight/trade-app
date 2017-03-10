import {combineReducers} from 'redux';
import reducerInstruments from './reducer-instruments';

const allReducers = combineReducers({
	instruments: reducerInstruments
});

export default allReducers;