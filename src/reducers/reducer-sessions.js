export default function(state = { sessionsPerPage: 10 }, action) {
	switch (action.type) {
		case "GOT_SESSIONS_COUNT": {
			let newState = JSON.stringify(state);
			newState = JSON.parse(newState);
			newState.sessionsCount = action.payload;
			newState.pagesCount = Math.ceil(action.payload / newState.sessionsPerPage);
			return newState;
		}
		case "GOT_SESSIONS": {
			let newState = JSON.stringify(state);
			newState = JSON.parse(newState);
			newState.sessions = action.payload.sessions;
			newState.page = action.payload.page;
			return newState;
		}
		default: {
			return state;
		}
	}
}