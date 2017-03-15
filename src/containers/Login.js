import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';

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
  }
  render() {
  	let enterButton;
  	if (JSON.stringify(this.props.user) !== '{}') {
  	  enterButton = <Link to="/trade-app">Войти</Link>;
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
      	  <input type="submit" />
      	</form>
      	{enterButton}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
  	user: state.user
  };
}

function matchDispatchToProps(dispatch) {
  return bindActionCreators({
  	checkUser: actions.checkUser
  }, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(Login);

// console.log(JSON.stringify({ eMail: 'pavel@pln-b.ru', password: 'It8-7' }));