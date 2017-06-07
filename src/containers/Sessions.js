import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import * as actions from '../actions';

//here be components

//import '../css/sessions.css';

class Sessions extends Component {

	constructor(props) {
		super(props);
		this.cancelPlannedSession = this.cancelPlannedSession.bind(this);
	}

	cancelPlannedSession() {
		this.props.cancelPlannedSession(this.props.user);
	}

	render() {
		let to = '/admin/addsession';
		let className = '';
		if (this.props.session.session_id !== 0 || this.props.session.planned_session) {
			to = '';
			className = ' disabled';
		}
		let PlannedSessionBlock;
		if (this.props.session.planned_session) {
			PlannedSessionBlock = (
				<div style={{marginTop: '40px'}}>
					<p>У Вас есть запланированная сессия</p>
					<button className="cancel-planned-session" onClick={this.cancelPlannedSession}>Отменить</button>
				</div>
			);
		}
		return (
			<div className="sessions">
				<h2>Сессии</h2>
				<p>
					<Link to="/last-session">Последняя сессия</Link>
				</p>
				<p>
					<Link className={`button-link${className}`} to={to}>Добавить новую</Link>
				</p>
				{PlannedSessionBlock}
			</div>
		);
	}

}

function mapStateToProps(state) {
	return {
		user: state.user,
		session: state.session
	};
}

function matchDispatchToProps(dispatch) {
	return bindActionCreators({
		cancelPlannedSession: actions.cancelPlannedSession
	}, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(Sessions);