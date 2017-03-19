import cookie from 'react-cookie';

export default function(state = {}, action) {
  switch (action.type) {
  	case 'CHECK_USER_SUCCESS': {
  	  let payload = action.payload;
  	  let enterDate = new Date();
  	  let expireDate = enterDate.getTime() + 1800000;
  	  expireDate = new Date(expireDate);

  	  cookie.save('eMail', payload.eMail, { path: '/', expires: expireDate });
  	  cookie.save('roleName', payload.roleName, { path: '/', expires: expireDate });
  	  cookie.save('token', payload.token, { path: '/', expires: expireDate });
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
      cookie.remove('eMail', { path: '/' });
      cookie.remove('roleName', { path: '/' });
      cookie.remove('token', { path: '/' });
      return {};
    }
  	default: {
  	  return state;
  	}
  }
}