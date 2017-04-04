import axios from 'axios';
import cookie from 'react-cookie';
import { browserHistory } from 'react-router';

export const tryLoginAgain = () => {
  return {
    type: 'TRY_LOGIN_AGAIN'
  };
};

/* Async block */

export const init = (user) => dispatch => {
  let sessionId;
  axios.post('core/checkupdate', { token: user.token })
    .then(response => {

      dispatch({ type: "INTERVAL_TURN_ON" });
      /* Проверяем наличие активной сессии */

      let reqSession = response.data.checksession;
      if (+reqSession.session_id) {
        dispatch({ type: "SESSION_TRUE", payload: reqSession })
      }
      sessionId = reqSession.session_id;

      /* Получаем инструменты */

      let reqInstruments = response.data.getinstruments.instruments;
      for (let i = 0; i < reqInstruments.length; i++) {
        reqInstruments[i].id = +reqInstruments[i].id;
        reqInstruments[i].price = +reqInstruments[i].price;
        reqInstruments[i].interest = +reqInstruments[i].interest;
      }
      dispatch({ type: "UPLOAD_INSTRUMENTS", payload: reqInstruments });

      /* Сделки... */

      let deals = response.data.checkdeals.deals;
      for (let i = 0; i < deals.length; i++) {
        let id = +deals[i].id;
        let type;
        let instrument = +deals[i].instrument_id;
        let volume;
        if (+deals[i].seller === user.id) {
          type = 'sale';
          volume = +deals[i].saled;
        } else if (+deals[i].buyer === user.id) {
          type = 'buy';
          volume = +deals[i].buyed;
        }
        if (id && type && instrument && volume) {
          dispatch({ type: "NEW_DEAL", payload: {
            id,
            type,
            instrument,
            volume
          }});
        }
      }
      return axios.post('core/checkorders', { session_id: sessionId, token: user.token });
    })
    .then(response => {
      let orders = response.data.result;
      if (orders.length !== 0) {
        for (let i = 0; i < orders.length; i++) {
          dispatch({ type: "ADD_ORDER", payload: {
            id: +orders[i].id,
            instrument: +orders[i].instrument_id,
            token: user.token,
            type: orders[i].type,
            quantity: +orders[i].quantity,
            session_id: sessionId
          }});
        }
      }
    })
    .catch(error => {
      console.log(error);
      dispatch({ type: 'ORDER_FAILURE', payload: 'error' });
    });
}

export const cancelOrders = (token, orders) => dispatch => {
  axios.post('core/deleteordersarray', { token, ids: orders })
    .then(response => {
      dispatch({ type: "CANCEL_ORDERS", payload: orders });
    })
    .catch(error => {
      console.log('order failure', error.response.status);
      dispatch({ type: 'ORDER_FAILURE', payload: error.response.status });
      dispatch({ type: "INTERVAL_TURN_OFF" });
    });
};

export const checkUpdate = (user, deals, session, instruments) => dispatch => {
  axios.post('core/checkupdate', { token: user.token })
    .then(response => {

      /* Проверяем наличие активной сессии */

      let reqSession = response.data.checksession;
      if (+reqSession.session_id && reqSession.date_end !== session.date_end) {
        dispatch({ type: "SESSION_TRUE", payload: reqSession })
      } else if (!+reqSession.session_id && +reqSession.session_id !== session.session_id) {
        dispatch({ type: "END_SESSION", payload: reqSession })
        return;
      }

      /* Получаем все сделки пользователя и сравниваем с имеющимися, добавляя новые */

      let newDeals = response.data.checkdeals.deals;
      if (newDeals.length !== 0) {
        for (let i = 0; i < newDeals.length; i++) {
          if (!deals[i]) {
            let id = +newDeals[i].id;
            let type;
            let instrument = +newDeals[i].instrument_id;
            let volume;
            let orderId;
            let orderRemain;
            if (+newDeals[i].seller === user.id) {
              type = 'sale';
              volume = +newDeals[i].saled;
              orderId = +newDeals[i].seller_order_id;
              orderRemain = +newDeals[i].seller_remainder;
            } else if (+newDeals[i].buyer === user.id) {
              type = 'buy';
              volume = +newDeals[i].buyed;
              orderId = +newDeals[i].buyer_order_id;
              orderRemain = +newDeals[i].buyer_remainder;
            }
            if (id && type && instrument && volume) {
              dispatch({ type: "NEW_DEAL", payload: {
                id,
                type,
                instrument,
                volume
              }});
              dispatch({ type: "UPDATE_ORDER", payload: { orderRemain, id: orderId }});
            }
          }
        }
      }
    })
    .catch(error => {
      console.log(error);
      dispatch({ type: 'ORDER_FAILURE', payload: error.response.status });
      dispatch({ type: "INTERVAL_TURN_OFF" });
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
      dispatch({ type: "INTERVAL_TURN_OFF" });
    });
};

export const logOut = token => dispatch => {
  setTimeout(() => {
    cookie.remove('eMail', { path: "/" });
    cookie.remove('roleName', { path: "/" });
    cookie.remove('token', { path: "/" });
    cookie.remove('id', { path: "/" });
    dispatch({ type: 'LOG_OUT' });
    browserHistory.push('/trade-app/login');
  }, 700);
  // axios.post('core/logout', token)
  //   .then(response => {
  //     cookie.remove('eMail', { path: "/" });
  //     cookie.remove('roleName', { path: "/" });
  //     cookie.remove('token', { path: "/" });
  //     cookie.remove('id', { path: "/" });
  //     dispatch({ type: 'LOG_OUT' });
  //     browserHistory.push('/trade-app/login');
  //   }) 
  //   .catch(error => {
  //     console.log(error);
  //     cookie.remove('eMail', { path: "/" });
  //     cookie.remove('roleName', { path: "/" });
  //     cookie.remove('token', { path: "/" });
  //     cookie.remove('id', { path: "/" });
  //     dispatch({ type: 'LOG_OUT' });
  //     browserHistory.push('/trade-app/login');
  //   });
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

export const uploadAdminInstruments = user => dispatch => {
  axios.post('../core/getinstruments', { token: user.token, session_id: 0 })
    .then(response => {
      console.log(response);
      let instruments = response.data.rows;
      for (let i = 0; i < instruments.length; i++) {
        instruments[i].id = +instruments[i].id;
        instruments[i].price = +instruments[i].price;
      }
      dispatch({ type: "UPLOAD_ADMIN_INSTRUMENTS", payload: instruments });
    })
    .catch(error => {
      console.log(error);
    });
};

export const addInstrument = (user, instrument_name, instrument_price) => dispatch => {
  axios.post('../core/addinstrument', { token: user.token, instrument_name, instrument_price })
    .then(response => {
      dispatch({ type: "ADD_INSTRUMENT", payload: {
        id: +response.data.id,
        name: instrument_name,
        price: +instrument_price,
        interest: 0
      }});
    })
    .catch(error => {
      console.log(error);
    });
};