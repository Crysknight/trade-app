import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import * as actions from '../actions';

//here be components

//import '../css/class.css';

class MasterPage extends Component {

	constructor(props) {
		super(props);
		this.logOut = this.logOut.bind(this);
	}

  logOut() {
    this.props.logOut();
  }

	render() {
		let Menu;
		if (
			JSON.stringify(this.props.user) !== '{}' && 
			!this.props.user.error &&
			!~this.props.routing.locationBeforeTransitions.pathname.indexOf('admin')
		) {
  	  Menu = (
  	  	<div id="trade_app_header">
  	  		<Link className="common-menu-link" to="/trade-app/">Рынок</Link>
  	  		<Link className="common-menu-link" to="/trade-app/last-session">Предыдущая сессия</Link>
  	  		<Link className="common-menu-link" to="/trade-app/tickets">Тикеты</Link>
          <div className="common-menu-link" onClick={this.logOut}>Выйти</div>
  	  	</div>
  	  );
		}
  	return (
  	  <div>
	  		{Menu}
  	    {this.props.children}
  	  </div>
  	);
	}

}

function mapStateToProps(state) {
	return {
		user: state.user,
		routing: state.routing
	};
}

function matchDispatchToProps(dispatch) {
	return bindActionCreators({
    logOut: actions.logOut
	}, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(MasterPage);