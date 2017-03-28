export default function(state = [], action) {
	switch (action.type) {
		case "NEW_DEAL": {
			return [
				...state,
				action.payload
			];
		}
		case "LOG_OUT": {
			return [];
		}
		default: {
			return state;
		}
	}
}