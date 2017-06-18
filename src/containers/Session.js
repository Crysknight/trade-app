import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
// import { Link } from 'react-router';

import * as actions from '../actions';

import Instrument from '../components/instrument';

class Session extends Component {

	constructor(props) {
		super(props);
		this.state = {
			session: this.props.params.id.slice(3)
		};
	}

	componentWillMount() {
		this.props.getSession(this.props.user.token, this.state.session);
	}

	render() {
		let session = this.props.lastSession;
		let Instruments;
		let dateStart;
		let dateEnd;
		if (session.length !== 0) {
			Instruments = session.instrumentsSnapshot.map((instrument, index) => <Instrument key={index} instrument={instrument} />);
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
		user: state.user,
		lastSession: state.lastSession
	};
}

function matchDispatchToProps(dispatch) {
	return bindActionCreators({
		getSession: actions.getSession
	}, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(Session);