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

export const addOrder = (order) /*=> dispatch*/ => {

  // axios.post('core/addorder', order)
  //   .then(function (response) {
  //     dispatch({ type: 'ADD_ORDER', payload: order });
  //   })
  //   .catch(function (error) {
  //     console.dir(error.response.status);
  //     dispatch({ type: 'ORDER_FAILURE', payload: error });
  //   });
  return {
  	type: 'ADD_ORDER',
  	payload: order
  }
};

export const logOut = (token) => dispatch => {
  axios.post('core/logout', token)
    .then(function (response) {
      dispatch({ type: 'LOG_OUT' });
    }) 
    .catch(function (error) {
      console.log(error);
      dispatch({ type: 'LOG_OUT' });
    });
  // return {
  //   type: 'LOG_OUT'
  // }
};

/* Async block */

export const checkUser = (user) => dispatch => {
  
  // //Mock response, because fuck cors!
  // setTimeout(() => {
  //   if (user.eMail === 'admin@mail.ru' && user.password === 'admin') {
  //     let response = {
  //       data: {
  //         role_name: 'isadmin',
  //         token: '4f5bd8223d51368e026'
  //       }
  //     };
  //     dispatch({ type: 'CHECK_USER_SUCCESS', payload: {
  //       eMail: user.eMail,
  //       roleName: response.data.role_name,
  //       token: response.data.token
  //     }});
  //   } else if (user.eMail === '500@mail.ru') {
  //     let response = {
  //       status: 500
  //     };
  //     dispatch({ type: 'CHECK_USER_FAILURE', payload: {
  //       response: response.status
  //     }});
  //   } else {
  //     let response = {
  //       status: 401
  //     };
  //     dispatch({ type: 'CHECK_USER_FAILURE', payload: {
  //       response: response.status
  //     }});
  //   }
  // }, 1500);

  axios.post('core/login', user)
    .then(function (response) {
      dispatch({ type: 'CHECK_USER_SUCCESS', payload: {
        eMail: user.eMail,
        roleName: response.data.role_name,
        token: response.data.token
      }});
    })
    .catch(function (error) {
      dispatch({ type: 'CHECK_USER_FAILURE', payload: {
        response: error.response.status
      }});
    });
};