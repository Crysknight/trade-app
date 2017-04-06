export default function(state = null, action) {
	switch (action.type) {
		case "SHOW_POP_UP": {
			return action.payload;
		}
		case "HIDE_POP_UP": {
			return null;
		}
		default: {
			return state;
		}
	}
}