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
		return (
			<div className="sessions">
				<h2>Сессии</h2>
				<Link to='/trade-app/admin/addsession'>Добавить новую</Link>
			</div>
		);
	}

}

function mapStateToProps(state) {
	return {
		
	};
}

function matchDispatchToProps(dispatch) {
	return bindActionCreators({
		
	}, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(Sessions);