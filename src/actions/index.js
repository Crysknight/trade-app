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

export const instrumentCheckbox = (id) => {
  return {
    type: "INSTRUMENT_CHECKBOX",
    payload: id
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
  axios.post('/api/check-update', { token: user.token })
    .then(response => {

      /* Включаем функцию ежесекундного запроса на сервер */
      dispatch({ type: "INTERVAL_TURN_ON" });

      /* Проверяем наличие активной сессии */
      let reqSession = response.data.session;
      if (reqSession.id && reqSession.status > 1) {
        dispatch({ type: "SESSION_TRUE", payload: reqSession });
      } else if (reqSession.id && reqSession.status === 1) {
        dispatch({ type: "SESSION_TRUE", payload: reqSession });
        if (routing) {
          if (routing.locationBeforeTransitions.pathname === '/admin/addsession') {
            browserHistory.push('/admin');
          }
        }
        return;
      } else {
        return;
      }
      sessionId = reqSession.id;

      /* Перенаправляем с панели добавления сессии, если есть активная сессия */

      if (routing) {
        if (routing.locationBeforeTransitions.pathname === '/admin/addsession') {
          browserHistory.push('/admin');
        }
      }

      /* Получаем инструменты */

      let reqInstruments = response.data.session.instruments;
      dispatch({ type: "UPLOAD_INSTRUMENTS", payload: reqInstruments });

      /* Сделки... */

      let deals = response.data.deals;
      for (let i = 0; i < deals.length; i++) {
        let { id, volume } = deals[i];
        let instrument = deals[i].instrument.id;
        let type;
        if (deals[i].seller.user === user.id) {
          type = 'sell';
        } else if (deals[i].buyer.user === user.id) {
          type = 'buy';
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
      if (user.role !== 'admin') {
        return axios.post('/api/get-orders', { token: user.token });
      }
    })
    .then(response => {
      if (!response) {
        return;
      }
      let orders = response.data;
      if (orders.length !== 0) {
        for (let i = 0; i < orders.length; i++) {
          dispatch({ type: "ADD_ORDER", payload: {
            id: orders[i].id,
            instrument: orders[i].instrument,
            token: user.token,
            orderType: orders[i].orderType,
            quantity: orders[i].quantity,
            session: sessionId
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
  axios.post('/api/delete-orders', { token, orders })
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
  axios.post('/api/check-update', { token: user.token })
    .then(response => {

      /* Проверяем наличие активной сессии */

      let reqSession = response.data.session;
      if (reqSession.id && (reqSession.status !== session.status || reqSession.end !== session.end)) {
        dispatch({ type: "SESSION_TRUE", payload: reqSession });
        if (reqSession.end !== session.end) {
          dispatch({ type: "CREATE_PROCESS", payload: { name: 'updated_session_time' } });
          setTimeout(() => dispatch({ type: "DELETE_PROCESS", payload: 'updated_session_time' }), 4000);
        }
      } else if (!reqSession.id && reqSession.id !== session.id) {
        dispatch({ type: "END_SESSION", payload: reqSession });
        return;
      } else if (!reqSession.id) {
        return;
      }

      /* Получаем инструменты и реагируем на их обновление */

      let reqInstruments = response.data.session.instruments;
      if (instruments.length === 0 && reqInstruments.length !== 0) {
        dispatch({ type: "UPLOAD_INSTRUMENTS", payload: reqInstruments });
        return;
      }
      let priceChanged;
      let changedInstrument;
      let interestChanged;
      for (let i = 0; i < reqInstruments.length; i++) {
        if (instruments[i].interested !== reqInstruments[i].interested) {
          interestChanged = true;
        }
        if (instruments[i].dealt !== reqInstruments[i].dealt) {
          interestChanged = true;
          dispatch({ type: "CREATE_PROCESS", payload: {
            name: `instrument_new_deal_${reqInstruments[i].id}`
          }});
          setTimeout(() => dispatch({ type: "DELETE_PROCESS", payload: `instrument_new_deal_${reqInstruments[i].id}`}), 3000);
        }
        if (instruments[i].price !== reqInstruments[i].price) {
          priceChanged = true;
          changedInstrument = reqInstruments[i].id;
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

      if (user.role === 'user') {
        let newDeals = response.data.deals;
        if (newDeals.length > 0) {
          for (let i = 0; i < newDeals.length; i++) {
            if (!deals[i]) {
              let { id, volume } = newDeals[i];
              let instrument = newDeals[i].instrument.id;
              let type;
              let orderId;
              if (newDeals[i].seller.user === user.id) {
                type = 'sell';
                orderId = newDeals[i].seller.order;
              } else if (newDeals[i].buyer.user === user.id) {
                type = 'buy';
                orderId = newDeals[i].buyer.order;
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
      } else if (user.role === 'admin') {
        axios.post('/api/get-orders', { token: user.token })
          .then(response => {
            let orders = response.data;
            orders = orders.map(order => {
              for (let i = 0; i < adminUsers.length; i++) {
                if (adminUsers[i].id === order.user) {
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
      console.log(error);
      dispatch({ type: 'ORDER_FAILURE', payload: error.response.status });
      if (error.response.status === 401) {
        dispatch({ type: "CREATE_PROCESS", payload: {
          name: 'login_from_other_location'
        }});
        setTimeout(() => dispatch({ type: "DELETE_PROCESS", payload: 'login_from_other_location'}), 4000);
        cookie.remove('login', { path: "/" });
        cookie.remove('role', { path: "/" });
        cookie.remove('token', { path: "/" });
        cookie.remove('id', { path: "/" });
        dispatch({ type: 'LOG_OUT' });
        browserHistory.push('/login');
      }
      dispatch({ type: "INTERVAL_TURN_OFF" });
    });
};

export const addOrder = order => dispatch => {

  let handleResponse = response => {
    dispatch({ type: "ADD_ORDER", payload: { id: response.data.order.id, ...order }});
    dispatch({ type: "DELETE_PROCESS", payload: `adding_order_${order.instrument}` });
    let deals = response.data.deals;
    let resOrder = response.data.order;
    if (deals.length !== 0) {
      for (let i = 0; i < deals.length; i++) {
        let { id, volume } = deals[i];
        let instrument = deals[i].instrument.id;
        dispatch({ type: "NEW_DEAL", payload: {
          id,
          instrument,
          type: order.orderType,
          volume
        }});
        dispatch({ type: "UPDATE_ORDER", payload: { volume, id: resOrder.id }});
      }
    }
  }

  dispatch({ type: "ADDING_ORDER", payload: order.instrument });
  dispatch({ type: "CREATE_PROCESS", payload: {
    name: `adding_order_${order.instrument}`
  }});
  axios.post('/api/add-order', order)
    .then(handleResponse)
    .catch(error => {
      if (error.response.status === 509) {
        axios.post('/api/add-order', order)
          .then(handleResponse)
          .catch(error => {
            console.log('order failure', error.response.status);
            dispatch({ type: 'ORDER_FAILURE', payload: error.response.status });
            dispatch({ type: "INTERVAL_TURN_OFF" });  
          })
      } else {
        console.log('order failure', error.response.status);
        dispatch({ type: 'ORDER_FAILURE', payload: error.response.status });
        dispatch({ type: "INTERVAL_TURN_OFF" });  
      }
    });
};

export const logOut = token => dispatch => {
  setTimeout(() => {
    cookie.remove('login', { path: "/" });
    cookie.remove('role', { path: "/" });
    cookie.remove('token', { path: "/" });
    cookie.remove('id', { path: "/" });
    dispatch({ type: 'LOG_OUT' });
    browserHistory.push('/login');
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
  axios.post('/api/login', user)
    .then(response => {
      cookie.save('login', response.data.login, { path: '/', maxAge: 1800 });
      cookie.save('role', response.data.role, { path: '/', maxAge: 1800 });
      cookie.save('token', response.data.token, { path: '/', maxAge: 1800 });
      cookie.save('id', response.data.id, { path: '/', maxAge: 1800 });
      dispatch({ type: 'CHECK_USER_SUCCESS', payload: {
        login: response.data.login,
        role: response.data.role,
        token: response.data.token,
        id: response.data.id
      }});
    })
    .catch(error => {
      dispatch({ type: 'CHECK_USER_FAILURE', payload: {
        response: error.response.status
      }});
    });
};

export const getAdminInstruments = user => dispatch => {
  axios.post('/api/get-instruments', { token: user.token })
    .then(response => {
      let instruments = response.data;
      for (let i = 0; i < instruments.length; i++) {
        instruments[i].chosen = true;
      }
      dispatch({ type: "GOT_ADMIN_INSTRUMENTS", payload: instruments });
    })
    .catch(error => {
      console.log(error);
    });
};

export const addInstrument = (user, name, isin, price) => dispatch => {
  axios.post('/api/add-instrument', { token: user.token, name, isin, price })
    .then(response => {
      dispatch({ type: "ADD_INSTRUMENT", payload: {
        id: response.data.id,
        name: response.data.name,
        isin: response.data.isin,
        price: response.data.price,
        status: true,
        interest: 0,
        chosen: true
      }});
    })
    .catch(error => {
      console.log(error);
    });
};

export const updateInstrument = (token, index, id, name, isin, price) => dispatch => {
  dispatch({ type: "CREATE_PROCESS", payload: {
    name: `updating_instrument_${id}`
  }});
  axios.post('/api/disable-instrument', { token, id, status: 0 })
    .then(response => {
      return axios.post('/api/add-instrument', { token, name, isin, price });
    })
    .then(response => {
      dispatch({ type: "UPDATE_ADMIN_INSTRUMENT", payload: {
        index,
        id: response.data.id,
        name,
        price
      }});
      dispatch({ type: "DELETE_PROCESS", payload: `updating_instrument_${id}`});
      dispatch({ type: "CREATE_PROCESS", payload: {
        name: `successfully_updated_index_${index}`
      }});
      setTimeout(() => dispatch({ type: "DELETE_PROCESS", payload: `successfully_updated_index_${index}`}), 1000);
    })
    .catch(error => {
      console.log(error);
    });
};

export const deleteInstrument = (token, id) => dispatch => {
  axios.post('/api/disable-instrument', { token, id, status: 0 })
    .then(response => {
      dispatch({ type: "DELETE_ADMIN_INSTRUMENT", payload: id });
    })
    .catch(error => {
      console.log(error);
    });
};

export const addSession = (token, start, end, instruments) => dispatch => {
  dispatch({ type: "CREATE_PROCESS", payload: {
    name: 'registering_session'
  }});
  axios.post('/api/create-session', { token, start, end, instruments })
    .then(response => {
      dispatch({ type: "DELETE_PROCESS", payload: 'registering_session' });
      browserHistory.push('/');
    })
    .catch(error => {
      console.log(error);
    });
};

export const getUsers = token => dispatch => {
  axios.post('/api/get-users', { token })
    .then(response => {
      dispatch({ type: "GOT_ADMIN_USERS", payload: response.data });
    })
    .catch(error => {
      console.log('error from getUsers: ', error);
    });
};

export const updateUser = (token, userToUpdate) => dispatch => {
  let request = {
    token,
    status: true,
    ...userToUpdate
  };
  if (!userToUpdate.pass) {
    delete request.pass;
  }
  dispatch({ type: "CREATE_PROCESS", payload: {
    name: `updating_user_${request.id}`
  }});
  axios.post('/api/update-user', request)
    .then(response => {
      return axios.post('/api/get-users', { token });
    })
    .then(response => {
      dispatch({ type: "GOT_ADMIN_USERS", payload: response.data });
      dispatch({ type: "DELETE_PROCESS", payload: `updating_user_${request.id}`});
      dispatch({ type: "CREATE_PROCESS", payload: {
        name: `updated_user_${request.id}`
      }});
      setTimeout(() => dispatch({ type: "DELETE_PROCESS", payload: `updated_user_${request.id}`}), 1000);
    })
    .catch(error => {
      if (error.response.status === 400 && error.response.data === 'Duplicate user login') {
        dispatch({ type: "CREATE_ERROR", payload: { name: `duplicate_user_login_${request.id}` } });
        setTimeout(() => dispatch({ type: "DELETE_ERROR", payload: `duplicate_user_login_${request.id}` }), 3000);
        dispatch({ type: "DELETE_PROCESS", payload: `updating_user_${request.id}`});
      }
      console.log('error from updateUser: ', error);
    });
};

export const deleteUser = (token, id) => dispatch => {
  axios.post('/api/disable-user', { token, id })
    .then(response => {
      return axios.post('/api/get-users', { token });
    })
    .then(response => {
      dispatch({ type: "GOT_ADMIN_USERS", payload: response.data });
    })
    .catch(error => {
      console.log('error from deleteUser: ', error);
    });
};

export const addUser = (token, userToAdd) => dispatch => {
  let request = {
    token,
    role: 'user',
    ...userToAdd
  };
  axios.post('/api/register', request)
    .then(response => {
      return axios.post('/api/get-users', { token });
    })
    .then(response => {
      dispatch({ type: "GOT_ADMIN_USERS", payload: response.data });
    })
    .catch(error => {
      console.log('error from updateUser: ', error);
    });
}

export const loadLastSession = (token) => dispatch => {
  axios.post('/api/get-last-session', { token })
    .then(response => {
      dispatch({ type: "GOT_SESSION", payload: response.data });
    })
    .catch(error => {
      console.log('error from loadLastSession', error);
    })
};

export const getDealsByDate = (user, start, end) => dispatch => {
  console.log(start, end);
  axios.post('/api/get-deals', { token: user.token, start, end })
    .then(response => {
      let tickets = response.data;
      tickets = tickets.map(ticket => {
        if (user.role === 'user') {
          if (user.id === ticket.seller.user) {
            ticket.side = 'Продажа';
          } else if (user.id === ticket.buyer.user) {
            ticket.side = 'Покупка';
          } else {
            return false;
          }
          return ticket;
        } else if (user.role === 'admin') {      
          return ticket;
        }
      });
      tickets = tickets.filter(ticket => ticket);
      dispatch({ type: "GET_TICKETS", payload: tickets });
    })
    .catch(error => {
      console.log('error from getDealsByDate: ', error);
    });
};

export const liveUpdateInstrument = (token, instrument, updateType, updateValue) => dispatch => {
  let request = {
    token,
    instrument,
    updateType,
    updateValue
  }
  axios.post('/api/update-instrument', request)
    .then(response => {

    })
    .catch(error => {
      console.log('error from liveUpdateInstrument: ', error);
    });
};

export const cancelPlannedSession = user => dispatch => {
  axios.post('/api/cancel-session', { token: user.token })
    .then(response => {
      dispatch({ type: "PLANNED_SESSION_FALSE" });
    })
    .catch(error => {
      console.log('error from cancelPlannedSession: ', error);
    });
};

export const updateSession = (token, id, date) => dispatch => {
  dispatch({ type: "CREATE_PROCESS", payload: { name: 'update_session_time' } });
  axios.post('/api/update-session', { token, id, date })
    .then(response => {
      setTimeout(() => dispatch({ type: "DELETE_PROCESS", payload: 'update_session_time' }), 2000);
    })
    .catch(error => {
      console.log('error from updateSession: ', error);
    });
};

export const getSessionsCount = (token) => dispatch => {
  axios.post('/api/get-sessions-count', { token })
    .then(response => {
      dispatch({ type: "GOT_SESSIONS_COUNT", payload: response.data });
    })
    .catch(error => {
      console.log('error from getSessions', error);
    })
};

export const getSessions = (token, page, sessionsCount, pagesCount, sessionsPerPage) => dispatch => {
  axios.post('/api/get-sessions', { 
    token,
    page,
    sessionsCount,
    pagesCount,
    sessionsPerPage
  })
    .then(response => {
      dispatch({ type: "GOT_SESSIONS", payload: { sessions: response.data, page } });
    })
    .catch(error => {
      console.log('error from getSessions', error);
    })
};

export const getSession = (token, id) => dispatch => {
  axios.post('/api/get-session', {
    token,
    id
  })
    .then(response => {
      dispatch({ type: "GOT_SESSION", payload: response.data });
    })
    .catch(error => {
      console.log('error from getSession', error);
    })
};