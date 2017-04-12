export default function(state = { session_id: 0 }, action) {
  switch (action.type) {
  	case "SESSION_TRUE": {
  		return action.payload;
  	}
  	case "END_SESSION": {
  		return action.payload;
  	}
  	case "PLANNED_SESSION_TRUE": {
  		return {
  			session_id: 0,
  			planned_session: true
  		};
  	}
  	case "PLANNED_SESSION_FALSE": {
  		return {
  			session_id: 0
  		};
  	}
  	default: {
  		return state;
  	}
  }
};