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

/*{
	id: 1,
	instrument: 1,
	quantity: 25,
	type: 'bid',
    status: 'placed'
  }*/

}