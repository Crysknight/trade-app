import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
// import { Link } from 'react-router';

import * as actions from '../actions';

//here be components

//import '../css/tickets.css';

class Tickets extends Component {

	constructor(props) {
		super(props);
		this.handleRadio = this.handleRadio.bind(this);
	}

	handleRadio(e) {
		if (e.target.id === 'by_day') {
			let date = new Date();
			let date_start = `${date.getFullYear()}-` + 
				`${date.getMonth() + 1 > 9 ? date.getMonth() + 1 : '0' + date.getMonth()}-` +
				`${date.getDate()}` + ' 00:00:00';
			let date_end = date_start.replace(/00:00:00/, '23:59:00');
			this.props.getDealsByDate(this.props.user, date_start, date_end);
		}
	}

	render() {
		return (
			<div className="tickets">
				<h1>Тикеты</h1>
				<div className="display-choice">
					<div><b>Отображать:</b></div>
					<p>
						<label>&mdash; сделки за сегодняшний день</label>
						<input id="by_day" type="radio" onChange={this.handleRadio} name="tickets-radio" />
					</p>
					<p>
						<label>&mdash; сделки за дату</label>
						<input id="by_date" type="radio" onChange={this.handleRadio} name="tickets-radio" />
					</p>
				</div>
			</div>
		);
	}

}

function mapStateToProps(state) {
	return {
		user: state.user,
		tickets: state.tickets
	};
}

function matchDispatchToProps(dispatch) {
	return bindActionCreators({
		getDealsByDate: actions.getDealsByDate
	}, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(Tickets);