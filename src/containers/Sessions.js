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

	componentWillMount() {
		this.props.getSessionsCount(this.props.user.token);
	}

	cancelPlannedSession() {
		this.props.cancelPlannedSession(this.props.user);
	}

	render() {
		let to = '/admin/addsession';
		let className = '';
		if (this.props.session.id !== 0) {
			to = '';
			className = ' disabled';
		}
		let PlannedSessionBlock;
		if (this.props.session.status === 1) {
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
				{this.props.routing.locationBeforeTransitions.pathname.indexOf('page') === -1 && (<Link className="button-link" to={`/admin/sessions/page_${this.props.sessions.pagesCount}`}>
					Показать прошлые сессии
				</Link>)}
				<div style={{marginTop: '40px'}}>
					{this.props.children}
				</div>
			</div>
		);
	}

}

function mapStateToProps(state) {
	return {
		user: state.user,
		routing: state.routing,
		session: state.session,
		sessions: state.sessions
	};
}

function matchDispatchToProps(dispatch) {
	return bindActionCreators({
		cancelPlannedSession: actions.cancelPlannedSession,
		getSessionsCount: actions.getSessionsCount
	}, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(Sessions);