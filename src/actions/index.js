import axios from 'axios';

export const tryLoginAgain = () => {
  return {
    type: 'TRY_LOGIN_AGAIN'
  };
}

/* Async block */
/* Added a comment */

export const cancelOrders = (token, orders) => dispatch => {
  axios.post('core/deleteordersarray', { token, ids: orders })
    .then(function(response) {
      dispatch({ type: "CANCEL_ORDERS", payload: orders });
    })
    .catch(function(error) {
      console.log('order failure', error.response.status);
      dispatch({ type: 'ORDER_FAILURE', payload: error.response.status });
    });
};

export const checkUpdate = (token, deals, orders) => dispatch => {
  axios.post('core/checkdeals', { token })
    .then(function(response) {
      let newDeals = response.data.deals;
      let orderIds = orders.map(order => order.id);
      console.log('orderIds', orderIds);
      for (let i = 0; i < newDeals.length; i++) {
        let id;
        let type;
        for (let j = 0; j < orderIds.length; j++) {
          if (newDeals[i].buyer_order_id === orderIds[j]) {
            id = newDeals[i].buyer_order_id;
            type = 'buy';
            return;
          } else if (newDeals[i].seller_order_id === orderIds[j]) {
            id = newDeals[i].seller_order_id;
            type = 'sale';
            return;
          }
        }
        let instrument = newDeals[i].instrument_id;
        let volume = newDeals[i].buyed;
        if (!deals[i]) {
          dispatch({ type: "NEW_DEAL", payload: {
            id,
            type,
            instrument,
            volume
          }});
        }
      }
      console.log(deals, newDeals);
    })
    .catch(function(error) {
      console.log('Some error occured');
    });
}

export const addOrder = order => dispatch => {
  dispatch({ type: "ADDING_ORDER", payload: order.instrument_id });
  axios.post('core/addorder', order)
    .then(function(response) {
      dispatch({ type: "ADD_ORDER", payload: { id: +response.data.id, instrument: order.instrument_id, ...order }});
      axios.post('core/checkorder', {
        ...order,
        order_id: response.data.id
      })
        .then(function(response) {
          let deals = response.data.deals;
          if (deals.length !== 0) {
            if (order.type === 'buy') {
              for (let i = 0; i < deals.length; i++) {
                let volume = +deals[i].buyed;
                let id = +deals[i].buyer_order_id;
                let deal = {
                  id,
                  instrument: deals[i].instrument_id,
                  type: 'buy',
                  volume
                }
                dispatch({ type: "NEW_DEAL", payload: deal });
                dispatch({ type: "UPDATE_ORDER", payload: { volume, id }});
              }
            } else {
              for (let i = 0; i < deals.length; i++) {
                let volume = +deals[i].saled;
                let id = +deals[i].seller_order_id;
                let deal = {
                  id,
                  instrument: deals[i].instrument_id,
                  type: 'sale',
                  volume
                }
                dispatch({ type: "NEW_DEAL", payload: deal });
                dispatch({ type: "UPDATE_ORDER", payload: { volume, id }});
              }
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