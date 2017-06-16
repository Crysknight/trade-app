import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
// import { Link } from 'react-router';

import * as actions from '../actions';

//here be components

//import '../css/class.css';

class SessionPage extends Component {

	// constructor(props) {
		// super(props);

	// }

	componentWillReceiveProps(nextProps) {
		let sessions = nextProps.sessions;
		if (sessions.sessionsCount && sessions.pagesCount) {
			let page = +nextProps.params.page;
			this.props.getSessions(
				nextProps.user.token, 
				page, 
				nextProps.sessions.sessionsCount,
				nextProps.sessions.pagesCount, 
				nextProps.sessions.sessionsPerPage,
			);	
		}		
	}

	render() {
		return (
			<h1>page {this.props.params.page}</h1>
		);
	}

}

function mapStateToProps(state) {
	return {
		user: state.user,
		sessions: state.sessions
	};
}

function matchDispatchToProps(dispatch) {
	return bindActionCreators({
		getSessions: actions.getSessions
	}, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(SessionPage);