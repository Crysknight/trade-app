export default function(state = [], action) {
	switch (action.type) {
		case "NEW_DEAL": {
			for (let i = 0; i < state.length; i++) {
				if (state[i].id === action.payload.id) {
					return state;
				}
			}
			return [
				...state,
				action.payload
			];
		}
		case "LOG_OUT": {
			return [];
		}
		case "END_SESSION": {
			return [];
		}
		default: {
			return state;
		}
	}
}

// S1p7F6v9

// 88.87.200.141
