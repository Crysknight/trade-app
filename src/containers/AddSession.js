import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
// import { Link } from 'react-router';

import * as actions from '../actions';

import TimeForm from '../components/time-form';

//import '../css/addsession.css';

class AddSession extends Component {

	// constructor(props) {
		// super(props);

	// }

	render() {
		return (
			<div className="add-session">
				<h2>Добавить сессию</h2>
				<div id="__session_form">
					<TimeForm />
				</div>
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

export default connect(mapStateToProps, matchDispatchToProps)(AddSession);