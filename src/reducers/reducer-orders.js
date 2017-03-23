export default function(state = [], action) {

  switch (action.type) {
  	case 'ADD_ORDER': {
  	  return [
  	    ...state,
  	    {
  	      ...action.payload
  	    }
  	  ];
  	}
  	case 'CANCEL_ROW': {
  	  return state.filter((order) => {
  	  	return order.instrument !== action.payload;
  	  });
  	}
  	case 'CANCEL_ALL': {
  	  return [];
  	}
    case 'ORDER_FAILURE': {
      return [
        ...state,
        {
          _failure: true
        }
      ];
    }
  	default: {
  	  return state;
  	}
  }
}