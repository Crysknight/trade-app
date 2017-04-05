export default function(state = [], action) {
	switch (action.type) {
		case "UPLOAD_ADMIN_INSTRUMENTS": {
			return action.payload.map((instrument, index) => {
				return {
					index: index + 1,
					...instrument
				};
			});
		}
		case "ADD_INSTRUMENT": {
			let lastIndex;
			let newState = state.map((instrument, index) => {
				lastIndex = index + 1;
				return instrument;
			})
			newState = [
				...newState,
				{
					index: lastIndex + 1,
					...action.payload
				}
			];
			return newState;
		}
		case "UPDATE_ADMIN_INSTRUMENT": {
			let payload = action.payload;
			let newState = [ ...state ];
			for (let i = 0; i < newState.length; i++) {
				if (newState[i].index === payload.index) {
					newState[i].id = payload.id;
					newState[i].name = payload.name;
					newState[i].price = payload.price;
				}
			}
		}
		case "INSTRUMENT_CHECKBOX": {
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