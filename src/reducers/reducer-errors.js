export default function(state = {}, action) {
	switch (action.type) {
		case "CREATE_ERROR": {
			let newState = JSON.stringify(state);
			newState = JSON.parse(newState);
			newState[action.payload.name] = {
				status: true
			};
			if (action.payload.info) {
				newState[action.payload.name] = {
					...newState[action.payload.name],
					info: action.payload.info
				};
			}
			return newState;
		}
		case "DELETE_ERROR": {
			let newState = JSON.stringify(state);
			newState = JSON.parse(newState);
			newState[action.payload].status = false;
			newState[action.payload].info = null;
			return newState;
		}
		default: {
			return state;
		}
	}
}