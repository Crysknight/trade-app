export default function(state = [], action) {
	switch (action.type) {
		case "GOT_ADMIN_USERS": {
			return action.payload;
		}
		default: {
			return state;
		}
	}
}