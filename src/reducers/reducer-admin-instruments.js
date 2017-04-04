export default function(state = [], action) {
	switch (action.type) {
		case "UPLOAD_ADMIN_INSTRUMENTS": {
			return action.payload;
		}
		case "ADD_INSTRUMENT": {
			return [
				...state,
				action.payload
			];
		}
		case "INSTRUMENT_CHECKBOX": {
			console.log('reducer: unchoose instrument');
			let newState = [ ...state ];
			for (let i = 0; i < newState.length; i++) {
				if (newState[i].id === action.payload) {
					newState[i].chosen = !newState[i].chosen;
				}
			}
			return newState;
		}
		default: {
			return state;
		}
	}
}