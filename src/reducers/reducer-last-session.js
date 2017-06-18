export default function(state = [], action) {
	switch (action.type) {
		case "GOT_SESSION": {
			return action.payload;
		}
		default: {
			return state;
		}
	}
}