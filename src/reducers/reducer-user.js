export default function(state = {}, action) {
  switch (action.type) {
  	case 'CHECK_USER': {
  	  return action.payload;
  	}
  	default: {
  	  return state;
  	}
  }
}