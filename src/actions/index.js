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
  setTimeout(() => {
    if (user.eMail === 'admin@mail.ru' && user.password === 'admin') {
      //Mock response, because fuck cors
      let response = {
        data: {
          role_name: 'isadmin',
          token: '4f5bd8223d51368e026'
        }
      };
      dispatch({ type: 'CHECK_USER_SUCCESS', payload: {
        eMail: user.eMail,
        roleName: response.data.role_name,
        token: response.data.token
      }});
    } else if (user.eMail === '500@mail.ru') {
      let response = {
        status: 500
      };
      dispatch({ type: 'CHECK_USER_FAILURE', payload: {
        response: response.status
      }});
    } else {
      let response = {
        status: 401
      };
      dispatch({ type: 'CHECK_USER_FAILURE', payload: {
        response: response.status
      }});
    }
  }, 1500);

  // axios.post('http://localhost/post.php', user)
  //   .then(function (response) {
  //     console.log(response);
  //  	  dispatch({ type: 'CHECK_USER', payload: user});
  //   })
  //   .catch(function (error) {
  //     dispatch({ type: 'CHECK_FAILED'});
  //   });
};