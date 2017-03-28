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
  	case 'CANCEL_ORDERS': {
      return state.filter((order) => {
        let orderStays = true;
        for (let i = 0; i < action.payload.length; i++) {
          if (action.payload[i] === order.id) {
            orderStays = false;
          }
        }
        return orderStays;
      });
  	}
    case 'ORDER_FAILURE': {
      return [
        ...state,
        {
          _failure: true
        }
      ];
    }
    case 'UPDATE_ORDER': {
      let payload = action.payload;
      let newState = state.map((order) => {
        if (order.id === payload.id) {
          order.quantity -= payload.volume;
        }
        return order;
      });
      newState = newState.filter((order) => {
        return order.quantity !== 0;
      });
      return newState;
    }
  	default: {
  	  return state;
  	}
  }
}