import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import * as actions from '../actions';

//here be components

import '../css/admin.css';

class AdminPanel extends Component {

	// constructor(props) {
		// super(props);

	// }

	componentWillMount() {
		this.props.init(this.props.user, this.props.routing);
	}

	componentWillUnmount() {
		this.props.turnOffInterval();
	}

	render() {
		let pathname = this.props.routing.locationBeforeTransitions.pathname;
		let topMenu = (pathname !== '/trade-app/admin' && pathname !== '/trade-app/admin/') ? (
			<div class="top-menu">
				<ul>
					<li><Link to="/trade-app/admin/sessions">Сессии</Link></li>
					<li><Link to="/trade-app/admin/users">Пользователи</Link></li>
				</ul>
			</div>
		) : null;
		return (
			<div className="admin-panel">
				<h1>Панель администратора</h1>
				{topMenu}
				<div id="__wrapper">
					{this.props.children}
				</div>
			</div>
		);
	}

}

function mapStateToProps(state) {
	return {
		routing: state.routing,
		user: state.user
	};
}

function matchDispatchToProps(dispatch) {
	return bindActionCreators({
		init: actions.init,
		turnOffInterval: actions.turnOffInterval
	}, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(AdminPanel);