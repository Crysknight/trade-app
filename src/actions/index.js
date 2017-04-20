import axios from 'axios';
import cookie from 'react-cookie';
import { browserHistory } from 'react-router';

// function escapeHtml(string) {
//   return String(string).replace(/[&<>"'`=\/]/g, function fromEntityMap (s) {
//     return `\\${s}`;
//   });
// }

// function breachHtml(string) {
//   return String(string).replace(/\\/g, '');
// }

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

export const createError = (error) => {
  return {
    type: "CREATE_ERROR",
    payload: {
      name: error.name,
      info: error.info
    }
  }
};

export const deleteError = (name) => {
  return {
    type: "DELETE_ERROR",
    payload: name
  }
};

export const turnOffInterval = () => {
  return {
    type: "INTERVAL_TURN_OFF"
  }
};

/* Async block */

export const init = (user, routing) => dispatch => {
  let sessionId;
  axios.post('/trade-app/core/checkupdate', { token: user.token })
    .then(response => {

      /* Включаем функцию ежесекундного запроса на сервер */
      dispatch({ type: "INTERVAL_TURN_ON" });

      /* Проверяем наличие активной сессии */
      let reqSession = response.data.checksession;
      if (+reqSession.session_id) {
        dispatch({ type: "SESSION_TRUE", payload: reqSession })
      } else {
        return;
      }
      sessionId = reqSession.session_id;

      /* Перенаправляем с панели добавления сессии, если есть активная сессия */

      if (routing) {
        if (routing.locationBeforeTransitions.pathname === '/trade-app/admin/addsession') {
          browserHistory.push('/trade-app/admin');
        }
      }

      /* Получаем инструменты */

      let reqInstruments = response.data.getinstruments.instruments;
      for (let i = 0; i < reqInstruments.length; i++) {
        reqInstruments[i].id = +reqInstruments[i].id;
        reqInstruments[i].name = reqInstruments[i].name;
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
      return axios.post('/trade-app/core/checkorders', { session_id: sessionId, token: user.token });
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
    if (user.roleName === 'isadmin') {
      axios.post('/trade-app/core/hasplannedsession', { token: user.token })
        .then(response => {
          if (response.data.hasplannedsession) {
            dispatch({ type: "PLANNED_SESSION_TRUE" });
          }
        })
        .catch(error => {
          console.log('error from hasplannedsession: ', error);
        });
    }
}

export const cancelOrders = (token, orders) => dispatch => {
  axios.post('/trade-app/core/deleteordersarray', { token, ids: orders })
    .then(response => {
      dispatch({ type: "CANCEL_ORDERS", payload: orders });
    })
    .catch(error => {
      console.log('order failure', error.response.status);
      dispatch({ type: 'ORDER_FAILURE', payload: error.response.status });
      dispatch({ type: "INTERVAL_TURN_OFF" });
    });
};

export const checkUpdate = (user, deals, session, instruments, adminUsers, oldOrders) => dispatch => {
  axios.post('/trade-app/core/checkupdate', { token: user.token })
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

      /* Получаем инструменты и реагируем на их обновление */

      let reqInstruments = response.data.getinstruments.instruments.map(instrument => {
        instrument.id = +instrument.id;
        instrument.name = instrument.name;
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
      let changedInstrument;
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
          changedInstrument = +reqInstruments[i].id;
          dispatch({ type: "CREATE_PROCESS", payload: {
            name: `price_changed_${reqInstruments[i].id}`
          }});
          setTimeout(() => dispatch({ type: "DELETE_PROCESS", payload: `price_changed_${reqInstruments[i].id}`}), 5000);
        }
      }
      if (priceChanged || interestChanged) {
        dispatch({ type: "UPLOAD_INSTRUMENTS", payload: reqInstruments });
      }
      if (priceChanged) {
        dispatch({ type: "INSTRUMENT_PRICE_CHANGED", payload: changedInstrument });
      }

      /* Получаем все сделки пользователя и сравниваем с имеющимися, добавляя новые */
      /* Или подгружаем заказы для админа */

      if (user.roleName === 'isuser') {
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
      } else if (user.roleName === 'isadmin') {
        axios.post('/trade-app/core/getallorders', { token: user.token, session_id: session.session_id })
          .then(response => {
            let orders = response.data.orders.orders;
            orders = orders.map(order => {
              order.id = +order.id;
              order.quantity = +order.quantity;
              order.user_id = +order.user_id;
              order.instrument = +order.instrument_id; // Сюда добавить реальный инструмент
              for (let i = 0; i < adminUsers.length; i++) {
                if (adminUsers[i].id === order.user_id) {
                  order.user = adminUsers[i];
                }
              }
              return order;
            });
            if (orders && JSON.stringify(orders) !== JSON.stringify(oldOrders)) {
              dispatch({ type: "UPLOAD_ORDERS", payload: orders });
            }
          })
          .catch(error => {
            console.log('error from getallorders: ', error);
          });
      }
    })
    .catch(error => {
      dispatch({ type: 'ORDER_FAILURE', payload: error.response.status });
      if (error.response.status === 401) {
        dispatch({ type: "CREATE_PROCESS", payload: {
          name: 'login_from_other_location'
        }});
        setTimeout(() => dispatch({ type: "DELETE_PROCESS", payload: 'login_from_other_location'}), 4000);
        cookie.remove('eMail', { path: "/" });
        cookie.remove('roleName', { path: "/" });
        cookie.remove('token', { path: "/" });
        cookie.remove('id', { path: "/" });
        dispatch({ type: 'LOG_OUT' });
        browserHistory.push('/trade-app/login');
      }
      dispatch({ type: "INTERVAL_TURN_OFF" });
    });
};

export const addOrder = order => dispatch => {
  dispatch({ type: "ADDING_ORDER", payload: order.instrument_id });
  dispatch({ type: "CREATE_PROCESS", payload: {
    name: `adding_order_${order.instrument_id}`
  }});
  axios.post('/trade-app/core/addorder', order)
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
  }, 350);
  // axios.post('/trade-app/core/logout', token)
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
  axios.post('/trade-app/core/login', user)
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
  axios.post('/trade-app/core/getinstruments', { token: user.token, session_id: 0 })
    .then(response => {
      let instruments = response.data.rows;
      for (let i = 0; i < instruments.length; i++) {
        instruments[i].id = +instruments[i].id;
        instruments[i].name = instruments[i].name;
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
  axios.post('/trade-app/core/addinstrument', { token: user.token, instrument_name: instrument_name, instrument_price })
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
  axios.post('/trade-app/core/updateinstrumentstatus', { token, instrument_id, instrument_status: 0 })
    .then(response => {
      return axios.post('/trade-app/core/addinstrument', { token, instrument_name, instrument_price });
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
      setTimeout(() => dispatch({ type: "DELETE_PROCESS", payload: `successfully_updated_index_${instrument_index}`}), 1000);
    })
    .catch(error => {
      console.log(error);
    });
};

export const deleteInstrument = (token, instrument_id) => dispatch => {
  axios.post('/trade-app/core/updateinstrumentstatus', { token, instrument_id, instrument_state: 0 })
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
  axios.post('/trade-app/core/sessionadd', { token, date_start, date_end, instrument_ids })
    .then(response => {
      dispatch({ type: "DELETE_PROCESS", payload: 'registering_session' });
      browserHistory.push('/trade-app/');
    })
    .catch(error => {
      console.log(error);
    });
};

export const getUsers = (token) => dispatch => {
  axios.post('/trade-app/core/getusers', { token })
    .then(response => {
      let users = response.data.getusers.users.map(user => {
        user.id = +user.id;
        user.role_id = +user.role_id;
        return user;
      });
      dispatch({ type: "UPLOAD_ADMIN_USERS", payload: users });
    })
    .catch(error => {
      console.log('error from getUsers: ', error);
    });
};

export const updateUser = (token, userToUpdate) => dispatch => {
  let request = {
    token,
    user_id: userToUpdate.user_id,
    user_name: userToUpdate.user_name,
    role_id: userToUpdate.role_id,
    fio: userToUpdate.fio,
    phone: userToUpdate.phone,
    organization: userToUpdate.organization,
    comment: userToUpdate.comment
  };
  if (userToUpdate.user_pass) {
    request.user_pass = userToUpdate.user_pass;
  }
  dispatch({ type: "CREATE_PROCESS", payload: {
    name: `updating_user_${request.user_id}`
  }});
  axios.post('/trade-app/core/updateuser', request)
    .then(response => {
      return axios.post('/trade-app/core/getusers', { token });
    })
    .then(response => {      
      let users = response.data.getusers.users.map(user => {
        user.id = +user.id;
        user.role_id = +user.role_id;
        return user;
      });
      dispatch({ type: "UPLOAD_ADMIN_USERS", payload: users });
      dispatch({ type: "DELETE_PROCESS", payload: `updating_user_${request.user_id}`});
      dispatch({ type: "CREATE_PROCESS", payload: {
        name: `updated_user_${request.user_id}`
      }});
      setTimeout(() => dispatch({ type: "DELETE_PROCESS", payload: `updated_user_${request.user_id}`}), 1000);
    })
    .catch(error => {
      console.log('error from updateUser: ', error);
    });
};

export const deleteUser = (token, user_id) => dispatch => {
  axios.post('/trade-app/core/deleteuser', { token, user_id })
    .then(response => {
      return axios.post('/trade-app/core/getusers', { token });
    })
    .then(response => {
      let users = response.data.getusers.users.map(user => {
        user.id = +user.id;
        user.role_id = +user.role_id;
        return user;
      });
      dispatch({ type: "UPLOAD_ADMIN_USERS", payload: users });
    })
    .catch(error => {
      console.log('error from deleteUser: ', error);
    });
};

export const addUser = (token, userToAdd) => dispatch => {
  let request = {
    token,
    user_name: userToAdd.user_name,
    role_id: 2,
    fio: userToAdd.fio,
    user_pass: userToAdd.user_pass,
    phone: userToAdd.phone,
    organization: userToAdd.organization,
    comment: userToAdd.comment
  };
  axios.post('/trade-app/core/adduser', request)
    .then(response => {
      return axios.post('/trade-app/core/getusers', { token });
    })
    .then(response => {
      let users = response.data.getusers.users.map(user => {
        user.id = +user.id;
        user.role_id = +user.role_id;
        return user;
      });
      dispatch({ type: "UPLOAD_ADMIN_USERS", payload: users });
    })
    .catch(error => {
      console.log('error from updateUser: ', error);
    });
}

export const loadLastSession = (token) => dispatch => {
  axios.post('/trade-app/core/getlastsession', { token })
    .then(response => {
      let reqSession = response.data.lastsession.session;
      let session = {};
      let interestedInstruments = reqSession.interested_instruments.map(instrument => +instrument.id);
      let dealedInstruments = reqSession.dealed_instruments.map(instrument => +instrument.id);
      session.id = +reqSession.id;
      session.start = reqSession.start;
      session.end = reqSession.end;
      session.instruments = reqSession.instrument_ids.map(instrument => {
        instrument.id = +instrument.id;
        instrument.name = instrument.name;
        instrument.price = +instrument.price;
        instrument.interest = 0;
        instrument.status = +instrument.status;
        for (let i = 0; i < interestedInstruments.length; i++) {
          if (instrument.id === interestedInstruments[i]) {
            instrument.interest = 1;
          }
        }
        for (let i = 0; i < dealedInstruments.length; i++) {
          if (instrument.id === dealedInstruments[i]) {
            instrument.interest = 2;
          }
        }
        return instrument;
      });
      dispatch({ type: "LOAD_LAST_SESSION", payload: session });
    })
    .catch(error => {
      console.log('error in loadLastSession: ', error);
    });
};

export const getDealsByDate = (user, date_start, date_end) => dispatch => {
  axios.post('/trade-app/core/getdealsbydate', { token: user.token, date_start, date_end })
    .then(response => {
      let tickets = response.data.deals;
      tickets = tickets.map(ticket => {
        if (user.roleName === 'isuser') {
          let processedTicket = {};
          processedTicket.id = +ticket.id;
          processedTicket.instrument_name = ticket.instrument_id.name;
          processedTicket.instrument_price = +ticket.instrument_id.price;
          if (user.id === +ticket.seller) {
            processedTicket.side = 'Продажа';
            processedTicket.volume = +ticket.saled;
          } else if (user.id === +ticket.buyer) {
            processedTicket.side = 'Покупка';
            processedTicket.volume = +ticket.buyed;
          } else {
            return false;
          }
          return processedTicket;
        } else if (user.roleName === 'isadmin') {
          let processedTicket = {};
          processedTicket.id = +ticket.id;
          processedTicket.instrument_name = ticket.instrument_id.name;
          processedTicket.instrument_price = +ticket.instrument_id.price;
          processedTicket.buyer = +ticket.buyer;
          processedTicket.seller = +ticket.seller;
          processedTicket.volume = +ticket.buyed;
          return processedTicket;
        }
      });
      tickets = tickets.filter(ticket => ticket);
      dispatch({ type: "GET_TICKETS", payload: tickets });
    })
    .catch(error => {
      console.log('error from getDealsByDate: ', error);
    });
};

export const liveUpdateInstrument = (user, instrument, message) => dispatch => {
  axios.post('/trade-app/core/updateinstrument', {
    token: user.token,
    instrument_id: instrument.instrument_id,
    instrument_name: instrument.instrument_name,
    instrument_price: instrument.instrument_price,
    interest: instrument.interest
  })
    .then(response => {
      if (message === 'updating price') {
        axios.post('/trade-app/core/cancelordersbyinstrument', { token: user.token, instrument_id: instrument.instrument_id })
          .then(response => {

          })
          .catch(error => {
            console.log('error from cancelordersbyinstrument: ', error);
          });
      }
    })
    .catch(error => {
      console.log('error from liveUpdateInstrument: ', error);
    });
};

export const cancelPlannedSession = user => dispatch => {
  axios.post('/trade-app/core/deleteplannedsession', { token: user.token })
    .then(response => {
      dispatch({ type: "PLANNED_SESSION_FALSE" });
    })
    .catch(error => {
      console.log('error from cancelPlannedSession: ', error);
    });
};

export const updateSession = (user, session_id, date_end) => dispatch => {
  axios.post('/trade-app/core/updatesession', { token: user.token, session_id, date_end })
    .then(response => {

    })
    .catch(error => {
      console.log('error from updateSession: ', error);
    });
};