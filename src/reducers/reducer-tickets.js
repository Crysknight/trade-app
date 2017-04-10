export default function(state = [], action) {
	switch (action.type) {
		case "GET_TICKETS": {
			return action.payload;
		}
		case "LOG_OUT": {
			return [];
		}
		default: {
			return state;
		}
	}
}