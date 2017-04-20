import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';

import * as actions from '../actions';

import '../css/login.css';

class Login extends Component {
  constructor(props) {
  	super(props);
  	this.submitUser = this.submitUser.bind(this);
  	this.handleInput = this.handleInput.bind(this);
  	this.state = {
  	  eMail: undefined,
  	  password: undefined
  	};
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.user.roleName === 'isadmin') {
      document.location = '/trade-app/admin/';
    } else if (
      JSON.stringify(nextProps.user) !== '{}' && 
      !nextProps.user.error
    ) {
      browserHistory.push('/trade-app/');
    }
  }
  submitUser(event) {
  	event.preventDefault();
  	if (this.state.eMail !== undefined && this.state.password !== undefined) {
  	  this.props.checkUser({ eMail: this.state.eMail, password: this.state.password });
    }
  }
  handleInput(event) {
  	if (event.target.id === 'auth__email') {
  	  this.setState({ eMail: event.target.value });
  	} else if (event.target.id === 'auth__password') {
  	  this.setState({ password: event.target.value });
  	}
    if (this.props.user.error) {
      this.props.tryLoginAgain();
    }
  }
  render() {
    let resultBlock;
    if (JSON.stringify(this.props.user) !== '{}') {
      switch (this.props.user.error) {
        case 'wrong user': {
          console.log('You\'re liar!');
          resultBlock = <div className="errorBlock">Неверный логин и/или пароль</div>;
          break;
        }
        case 'internal server error': {
          resultBlock = <div className="errorBlock">Ошибка сервера</div>;
          break;
        }
        default: {
          resultBlock = <div className="successBlock"></div>;
        }
      }
    }
    if (this.props.processes['login_from_other_location']) {
      if (this.props.processes['login_from_other_location'].status) {
        resultBlock = <div className="errorBlock">Ошибка сервера</div>;
      }
    }
    return (
      <div>
      	<form id="auth" onSubmit={this.submitUser}>
      	  <input 
      	    id="auth__email" 
      	    type="email" 
      	    placeholder="E-mail" 
      	    required
      	    onChange={this.handleInput}
      	  />
      	  <input 
      	    id="auth__password" 
      	    type="password" 
      	    placeholder="Password" 
      	    required
      	    onChange={this.handleInput}
      	  />
      	  <input type="submit" value="Войти"/>
      	</form>
        {resultBlock}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
  	user: state.user,
    processes: state.processes
  };
}

function matchDispatchToProps(dispatch) {
  return bindActionCreators({
  	checkUser: actions.checkUser,
    tryLoginAgain: actions.tryLoginAgain
  }, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(Login);