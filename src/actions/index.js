import axios from 'axios';
import cookie from 'react-cookie';
import { browserHistory } from 'react-router';

export const tryLoginAgain = () => {
  return {
    type: 'TRY_LOGIN_AGAIN'
  };
};

/* Async block */

export const cancelOrders = (token, orders) => dispatch => {
  axios.post('core/deleteordersarray', { token, ids: orders })
    .then(response => {
      dispatch({ type: "CANCEL_ORDERS", payload: orders });
    })
    .catch(error => {
      console.log('order failure', error.response.status);
      dispatch({ type: 'ORDER_FAILURE', payload: error.response.status });
    });
};

export const checkUpdate = (user, deals, interval) => dispatch => {
  axios.post('core/checkdeals', { token: user.token })
    .then(response => {
      let newDeals = response.data.deals;
      if (newDeals.length !== 0) {
        for (let i = 0; i < newDeals.length; i++) {
          if (!deals[i]) {
            let id = +newDeals[i].id;
            let type;
            let instrument = +newDeals[i].instrument_id;
            let volume;
            let orderId;
            if (+newDeals[i].seller === user.id) {
              type = 'sale';
              volume = +newDeals[i].saled;
              orderId = +newDeals[i].seller_order_id;
            } else if (+newDeals[i].buyer === user.id) {
              type = 'buy';
              volume = +newDeals[i].buyed;
              orderId = +newDeals[i].buyer_order_id;
            }
            if (id && type && instrument && volume) {
              dispatch({ type: "NEW_DEAL", payload: {
                id,
                type,
                instrument,
                volume
              }});
              dispatch({ type: "UPDATE_ORDER", payload: { volume, id: orderId }});
            }
          }
        }
      }
    })
    .catch(error => {
      console.log(error);
      dispatch({ type: 'ORDER_FAILURE', payload: error.response.status });
      clearInterval(interval);
    });
};

export const addOrder = order => dispatch => {
  dispatch({ type: "ADDING_ORDER", payload: order.instrument_id });
  axios.post('core/addorder', order)
    .then(response => {
      dispatch({ type: "ADD_ORDER", payload: { id: +response.data.id, instrument: order.instrument_id, ...order }});
      let deals = response.data.checkorder.deals;
      if (deals.length !== 0) {
        for (let i = 0; i < deals.length; i++) {
          let id = +deals[i].id;
          let instrument = deals[i].instrument_id;
          let type;
          let volume;
          let orderId;
          if (order.type === 'buy') {
            orderId = +deals[i].buyer_order_id;
            type = "buy";
            volume = +deals[i].buyed;

          } else if (order.type === 'sale') {
            orderId = +deals[i].seller_order_id;
            type = "sale";
            volume = +deals[i].saled;

          } else {
            dispatch({ type: 'ORDER_FAILURE', payload: 'order type invalid' });
            throw new Error('order type invalid');
          }
          dispatch({ type: "NEW_DEAL", payload: {
            id,
            instrument,
            type,
            volume
          }});
          dispatch({ type: "UPDATE_ORDER", payload: { volume, id: orderId }});
        }
      }
    })
    .catch(error => {
      console.log('order failure', error.response.status);
      dispatch({ type: 'ORDER_FAILURE', payload: error.response.status });
    });
};

export const checkOrders = (token, sessionId) => dispatch => {
  axios.post('core/checkorders', { session_id: sessionId, token })
    .then(response => {
      let orders = response.data.result;
      if (orders.length !== 0) {
        for (let i = 0; i < orders.length; i++) {
          dispatch({ type: "ADD_ORDER", payload: {
            id: +orders[i].id,
            instrument: +orders[i].instrument_id,
            token,
            type: orders[i].type,
            quantity: +orders[i].quantity,
            session_id: sessionId
          }});
        }
      }
    })
    .catch(error => {
      console.log(error);
      dispatch({ type: 'ORDER_FAILURE', payload: error.response.status });
    });
};

export const logOut = token => dispatch => {
  axios.post('core/logout', token)
    .then(response => {
      cookie.remove('eMail', { path: "/" });
      cookie.remove('roleName', { path: "/" });
      cookie.remove('token', { path: "/" });
      cookie.remove('id', { path: "/" });
      dispatch({ type: 'LOG_OUT' });
      browserHistory.push('/trade-app/login');
    }) 
    .catch(error => {
      console.log(error);
      cookie.remove('eMail', { path: "/" });
      cookie.remove('roleName', { path: "/" });
      cookie.remove('token', { path: "/" });
      cookie.remove('id', { path: "/" });
      dispatch({ type: 'LOG_OUT' });
      browserHistory.push('/trade-app/login');
    });
};

export const checkUser = user => dispatch => {
  axios.post('core/login', user)
    .then(response => {
      cookie.save('eMail', user.eMail, { path: '/', maxAge: 1800 });
      cookie.save('roleName', response.data.role_name, { path: '/', maxAge: 1800 });
      cookie.save('token', response.data.token, { path: '/', maxAge: 1800 });
      cookie.save('id', +response.data.id, { path: '/', maxAge: 1800 });
      dispatch({ type: 'CHECK_USER_SUCCESS', payload: {
        eMail: user.eMail,
        roleName: response.data.role_name,
        token: response.data.token,
        id: +response.data.id
      }});
    })
    .catch(error => {
      dispatch({ type: 'CHECK_USER_FAILURE', payload: {
        response: error.response.status
      }});
    });

};