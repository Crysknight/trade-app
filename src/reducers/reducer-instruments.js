export default function(state = [], action) {
	switch (action.type) {
		case "UPLOAD_INSTRUMENTS": {
			return action.payload;
		}
		default: {
			return state;
		}
	}
}