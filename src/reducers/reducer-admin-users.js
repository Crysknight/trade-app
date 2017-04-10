export default function(state = [], action) {
	switch (action.type) {
		case "UPLOAD_ADMIN_USERS": {
			return action.payload.filter(user => +user.role_id !== 1);
		}
		default: {
			return state;
		}
	}
}