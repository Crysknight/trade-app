import axios from 'axios';

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

/* Async block */

export const checkUser = (user) => dispatch => {
  axios.post('http://praktik.fff/post.php', user)
    .then(function (response) {
      console.log(response);
   	  dispatch({ type: 'CHECK_USER', payload: user});
    })
    .catch(function (error) {
      dispatch({ type: 'CHECK_FAILED'});
    });
  //dispatch({ type: 'CHECK_USER', payload: user});
};