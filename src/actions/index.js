import axios from 'axios';
import cookie from 'react-cookie';
import { browserHistory } from 'react-router';

function escapeHtml(string) {
  return String(string).replace(/[&<>"'`=\/]/g, function fromEntityMap (s) {
    return `\\${s}`;
  });
}

function breachHtml(string) {
  return String(string).replace(/\\/g, '');
}

export const tryLoginAgain = () => {
  return {
    type: 'TRY_LOGIN_AGAIN'
  };
};

export const instrumentCheckbox = (instrument_id) => {
  return {
    type: "INSTRUMENT_CHECKBOX",
    payload: instrument_id
  };
};

//puFuncArgs, puMessage, puButtonText, puClassName, puButtonClassName, puFadeTime - Options
export const showPopUp = (options) => dispatch => {
  dispatch({ type: "SHOW_POP_UP", payload: options});
  setTimeout(() => dispatch({ type: "HIDE_POP_UP" }), (options.puFadeTime ? options.puFadeTime : 10000));
};

export const hidePopUp = () => {
  return {
    type: "HIDE_POP_UP"
  }
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
      } else {
        return;
      }
      sessionId = reqSession.session_id;

      /* Получаем инструменты */

      let reqInstruments = response.data.getinstruments.instruments;
      for (let i = 0; i < reqInstruments.length; i++) {
        reqInstruments[i].id = +reqInstruments[i].id;
        reqInstruments[i].name = breachHtml(reqInstruments[i].name);
        reqInstruments[i].price = +reqInstruments[i].price;
        reqInstruments[i].interest = +reqInstruments[i].interest;
        reqInstruments[i].status = +reqInstruments[i].status;
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
      if (!response) {
        return;
      }
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
      } else if (!+reqSession.session_id) {
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

      /* Получаем инструменты и реагируем на их обновление */

      let reqInstruments = response.data.getinstruments.instruments.map(instrument => {
        instrument.id = +instrument.id;
        instrument.name = breachHtml(instrument.name);
        instrument.interest = +instrument.interest;
        instrument.price = +instrument.price;
        instrument.status = +instrument.status;
        return instrument;
      });
      if (instruments.length === 0) {
        dispatch({ type: "UPLOAD_INSTRUMENTS", payload: reqInstruments });
        return;
      }
      let priceChanged;
      let interestChanged;
      for (let i = 0; i < reqInstruments.length; i++) {
        if (instruments[i].interest !== reqInstruments[i].interest) {
          interestChanged = true;
          if (reqInstruments[i].interest > 1) {
            dispatch({ type: "CREATE_PROCESS", payload: {
              name: `instrument_new_deal_${reqInstruments[i].id}`
            }});
            setTimeout(() => dispatch({ type: "DELETE_PROCESS", payload: `instrument_new_deal_${reqInstruments[i].id}`}), 3000);
          }
        }
        if (instruments[i].price !== reqInstruments[i].price) {
          priceChanged = true;
          dispatch({ type: "CREATE_PROCESS", payload: {
            name: `price_changed_${reqInstruments[i].id}`
          }});
          setTimeout(() => dispatch({ type: "DELETE_PROCESS", payload: `price_changed_${reqInstruments[i].id}`}), 5000);
        }
      }
      if (priceChanged || interestChanged) {
        dispatch({ type: "UPLOAD_INSTRUMENTS", payload: reqInstruments });
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
  dispatch({ type: "CREATE_PROCESS", payload: {
    name: `adding_order_${order.instrument_id}`
  }});
  axios.post('core/addorder', order)
    .then(response => {
      dispatch({ type: "ADD_ORDER", payload: { id: +response.data.id, instrument: order.instrument_id, ...order }});
      dispatch({ type: "DELETE_PROCESS", payload: `adding_order_${order.instrument_id}` });
      let deals = response.data.checkorder.deals;
      if (deals.length !== 0) {
        for (let i = 0; i < deals.length; i++) {
          let id = +deals[i].id;
          let instrument = deals[i].instrument_id;
          let type;
          let volume;
          let orderId;
          let orderRemain;
          if (order.type === 'buy') {
            orderId = +deals[i].buyer_order_id;
            type = "buy";
            volume = +deals[i].buyed;
            orderRemain = +deals[i].buyer_remainder;
          } else if (order.type === 'sale') {
            orderId = +deals[i].seller_order_id;
            type = "sale";
            volume = +deals[i].buyed;
            orderRemain = +deals[i].seller_remainder;
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
          dispatch({ type: "UPDATE_ORDER", payload: { orderRemain, id: orderId }});
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
      let instruments = response.data.rows;
      for (let i = 0; i < instruments.length; i++) {
        instruments[i].id = +instruments[i].id;
        instruments[i].name = breachHtml(instruments[i].name);
        instruments[i].price = +instruments[i].price;
        instruments[i].chosen = true;
      }
      dispatch({ type: "UPLOAD_ADMIN_INSTRUMENTS", payload: instruments });
    })
    .catch(error => {
      console.log(error);
    });
};

export const addInstrument = (user, instrument_name, instrument_price) => dispatch => {
  console.log(escapeHtml(instrument_name));
  axios.post('../core/addinstrument', { token: user.token, instrument_name: escapeHtml(instrument_name), instrument_price })
    .then(response => {
      dispatch({ type: "ADD_INSTRUMENT", payload: {
        id: +response.data.id,
        name: instrument_name,
        price: +instrument_price,
        interest: 0,
        chosen: true
      }});
    })
    .catch(error => {
      console.log(error);
    });
};

export const updateInstrument = (token, instrument_index, instrument_id, instrument_name, instrument_price) => dispatch => {
  dispatch({ type: "CREATE_PROCESS", payload: {
    name: `updating_instrument_${instrument_id}`
  }});
  axios.post('../core/updateinstrumentstatus', { token, instrument_id, instrument_status: 0 })
    .then(response => {
      return axios.post('../core/addinstrument', { token, instrument_name, instrument_price });
    })
    .then(response => {
      dispatch({ type: "UPDATE_ADMIN_INSTRUMENT", payload: {
        index: instrument_index,
        id: +response.data.id,
        name: instrument_name,
        price: instrument_price
      }});
      dispatch({ type: "DELETE_PROCESS", payload: `updating_instrument_${instrument_id}`});
      dispatch({ type: "CREATE_PROCESS", payload: {
        name: `successfully_updated_index_${instrument_index}`
      }});
      setTimeout(() => dispatch({ type: "DELETE_PROCESS", payload: `successfully_updated_index_${instrument_index}`}), 2000);
    })
    .catch(error => {
      console.log(error);
    });
};

export const deleteInstrument = (token, instrument_id) => dispatch => {
  axios.post('../core/updateinstrumentstatus', { token, instrument_id, instrument_state: 0 })
    .then(response => {
      dispatch({ type: "DELETE_ADMIN_INSTRUMENT", payload: instrument_id });
    })
    .catch(error => {
      console.log(error);
    });
};

export const addSession = (token, date_start, date_end, instrument_ids) => dispatch => {
  dispatch({ type: "CREATE_PROCESS", payload: {
    name: 'registering_session'
  }});
  axios.post('../core/sessionadd', { token, date_start, date_end, instrument_ids })
    .then(response => {
      dispatch({ type: "DELETE_PROCESS", payload: 'registering_session' });
      browserHistory.push('/trade-app/');
    })
    .catch(error => {
      console.log(error);
    });
};