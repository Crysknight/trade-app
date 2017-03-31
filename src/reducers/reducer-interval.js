export default function(state = false, action) {
	switch (action.type) {
		case "INTERVAL_TURN_ON": {
			return true;
		}
		case "INTERVAL_TURN_OFF": {
			return false;
		}
		default: {
			return state;
		}
	}
}