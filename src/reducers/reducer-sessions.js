export default function(state = { sessionsPerPage: 3 }, action) {
	switch (action.type) {
		case "GOT_SESSIONS_COUNT": {
			let newState = JSON.stringify(state);
			newState = JSON.parse(newState);
			newState.sessionsCount = action.payload;
			newState.pagesCount = Math.ceil(action.payload / newState.sessionsPerPage);
			return newState;
		}
		default: {
			return state;
		}
	}
}