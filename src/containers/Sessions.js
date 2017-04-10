import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import * as actions from '../actions';

//here be components

//import '../css/sessions.css';

class Sessions extends Component {

	// constructor(props) {
		// super(props);

	// }

	render() {
		let to = '/trade-app/admin/addsession';
		let className = '';
		if (this.props.session.session_id !== 0) {
			to = '';
			className = ' disabled';
		}
		return (
			<div className="sessions">
				<h2>Сессии</h2>
				<p>
					<Link to="/trade-app/last-session">Последняя сессия</Link>
				</p>
				<p>
					<Link className={`button-link${className}`} to={to}>Добавить новую</Link>
				</p>
			</div>
		);
	}

}

function mapStateToProps(state) {
	return {
		session: state.session
	};
}

function matchDispatchToProps(dispatch) {
	return bindActionCreators({
		
	}, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(Sessions);