export default function(state = { session_id: 0 }, action) {
  switch (action.type) {
  	case "SESSION_TRUE": {
  		return action.payload;
  	}
  	case "END_SESSION": {
  		return action.payload;
  	}
  	default: {
  		return state;
  	}
  }
};