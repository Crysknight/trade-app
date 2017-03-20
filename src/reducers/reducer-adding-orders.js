export default function(state = [], action) {
  switch (action.type) {
  	case 'ADDING_ORDER': {
  	  return [...state, action.payload];
  	}
  	case 'ADD_ORDER': {
  	  return state.filter((instrument) => instrument !== action.payload.instrument);
  	}
  	default: {
  	  return state;
  	}
  }
}