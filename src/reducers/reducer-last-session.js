export default function(state = [], action) {
	switch (action.type) {
		case "LOAD_LAST_SESSION": {
			return action.payload;
		}
		default: {
			return state;
		}
	}
}