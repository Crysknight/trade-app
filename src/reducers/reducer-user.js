export default function(state = {}, action) {
  switch (action.type) {
  	case 'CHECK_USER_SUCCESS': {
  	  let payload = action.payload;
  	  return {
  	  	...action.payload,
  	  	error: false
  	  };
  	}
  	case 'CHECK_USER_FAILURE': {
  	  if (action.payload.response === 401) {
  	  	return {
  	  	  ...action.payload,
  	  	  error: 'wrong user'
  	  	};
  	  } else if (action.payload.response === 500) {
  	  	return {
  	  	  ...action.payload,
  	  	  error: 'internal server error'
  	  	}
  	  } else {
  	  	return {
  	  	  ...action.payload,
  	  	  error: 'unknown error'
  	  	}
  	  }
  	}
    case 'LOG_OUT': {
      return {};
    }
    case 'TRY_LOGIN_AGAIN': {
      return {
        ...state,
        error: 'trying again'
      };
    }
  	default: {
  	  return state;
  	}
  }
}