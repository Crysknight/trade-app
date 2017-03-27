export default function(state = [], action) {
	switch (action.type) {
		case "NEW_DEAL": {
			return [
				...state,
				action.payload
			];
		}
		default: {
			return state;
		}
	}
}