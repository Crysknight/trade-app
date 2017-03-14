export const cancelRow = (instrument) => {
  return {
    type: 'CANCEL_ROW',
    payload: instrument
  };
};

export const cancelAll = () => {
  return {
  	type: 'CANCEL_ALL'
  };
};

export const addOrder = (order) => {
  return {
  	type: 'ADD_ORDER',
  	payload: order
  }
};