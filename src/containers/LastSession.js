import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
// import { Link } from 'react-router';

import * as actions from '../actions';

import Instrument from '../components/instrument';

//import '../css/last-session.css';

class LastSession extends Component {

	// constructor(props) {
		// super(props);

	// }

	componentWillMount() {
		this.props.loadLastSession(this.props.user.token);
	}

	render() {
		let session = this.props.lastSession;
		let Instruments;
		let dateStart;
		let dateEnd;
		if (session.length !== 0) {
			Instruments = session.instruments.map((instrument, index) => <Instrument key={index} instrument={instrument} />);
			dateStart = session.start;
			dateEnd = session.end;
		}
		return (
			<div className="last-session">
				<h1>Предыдущая сессия</h1>
				<p><b>Время начала:</b> {dateStart}</p>
				<p><b>Время окончания:</b> {dateEnd}</p>
				<table id="last_session_table">
					<tbody>
						<tr className="table-header">
							<td>Инструмент</td>
							<td>Цена</td>
						</tr>
						{Instruments}
					</tbody>
				</table>
			</div>
		);
	}

}

function mapStateToProps(state) {
	return {
		lastSession: state.lastSession,
		user: state.user
	};
}

function matchDispatchToProps(dispatch) {
	return bindActionCreators({
		loadLastSession: actions.loadLastSession
	}, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(LastSession);