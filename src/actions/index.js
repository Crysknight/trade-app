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

export const tryLoginAgain = () => {
  return {
    type: 'TRY_LOGIN_AGAIN'
  };
}

/* Async block */

export const checkUpdate = (token, deals) => dispatch => {
  console.log(token, deals);
  axios.post('core/checkdeals', token)
    .then(function(response) {
      console.log(token, deals);
    })
    .catch(function(error) {
      console.log('Some error occured');
    });
}

export const addOrder = order => dispatch => {
  dispatch({ type: 'ADDING_ORDER', payload: order.instrument_id });
  axios.post('core/addorder', order)
    .then(function(response) {
      console.log('order successful');
      dispatch({ type: 'ADD_ORDER', payload: { id: response.data.id, instrument: order.instrument_id, ...order }});
      axios.post('core/checkorder', {
        ...order,
        order_id: response.data.id
      })
        .then(function(response) {
          if (response.data.buyer !== 0 && response.data.seller !== 0) {
            if (order.type === 'buy') {
              dispatch({ type: "NEW_DEAL", payload: {
                type: 'buy',
                instrument: response.data.instrument_id,
                ownOrder: response.data.buyer,
                contractorOrder: response.data.seller
              }});
            } else {
              dispatch({ type: "NEW_DEAL", payload: {
                type: 'sale',
                instrument: response.data.instrument_id,
                ownOrder: response.data.seller,
                contractorOrder: response.data.buyer
              }});
            }
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    })
    .catch(function(error) {
      console.log('order failure', error.response.status);
      dispatch({ type: 'ORDER_FAILURE', payload: error.response.status });
    });
  // dispatch({ type: 'ADDING_ORDER', payload: order.instrument });
  // setTimeout(() => {
  //   let response = {
  //     data: {
  //       id: Date.now()
  //     }
  //   };
  //   dispatch({ type: 'ADD_ORDER', payload: { id: response.data.id, ...order }});
  // }, 200);
};

export const logOut = token => dispatch => {
  axios.post('core/logout', token)
    .then(function(response) {
      dispatch({ type: 'LOG_OUT' });
    }) 
    .catch(function(error) {
      console.log(error);
      dispatch({ type: 'LOG_OUT' });
    });
  // return {
  //   type: 'LOG_OUT'
  // }
};

export const checkUser = user => dispatch => {
  
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
    .then(function(response) {
      dispatch({ type: 'CHECK_USER_SUCCESS', payload: {
        eMail: user.eMail,
        roleName: response.data.role_name,
        token: response.data.token
      }});
    })
    .catch(function(error) {
      dispatch({ type: 'CHECK_USER_FAILURE', payload: {
        response: error.response.status
      }});
    });

};