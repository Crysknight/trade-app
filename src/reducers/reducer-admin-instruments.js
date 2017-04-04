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
		default: {
			return state;
		}
	}
}