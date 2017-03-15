export default function(state = [{ id: 0 }], action) {

  switch (action.type) {
  	case 'ADD_ORDER': {
  	  return [
  	    ...state,
  	    {
  	      id: state[state.length - 1].id + 1,
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
  	  return [{ id: 0 }];
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