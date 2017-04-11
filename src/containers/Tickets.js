import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
// import { Link } from 'react-router';

import * as actions from '../actions';

import Ticket from '../components/ticket';
import TimeForm from '../components/time-form';


//import '../css/tickets.css';

class Tickets extends Component {

	constructor(props) {
		super(props);
		this.state = {
			radio: 'by_day'
		};
		this.handleRadio = this.handleRadio.bind(this);
		this.getTodaysTickets = this.getTodaysTickets.bind(this);
		this.handleTimeForm = this.handleTimeForm.bind(this);
		this.handleTimeFormFocus = this.handleTimeFormFocus.bind(this);
		this.displayError = this.displayError.bind(this);
	}

	getTodaysTickets() {
		let date = new Date();
		let date_start = `${date.getFullYear()}-` + 
			`${(date.getMonth() + 1) > 9 ? (date.getMonth() + 1) : '0' + (date.getMonth() + 1)}-` +
			`${date.getDate()}` + ' 00:00:00';
		let date_end = date_start.replace(/00:00:00/, '23:59:00');
		this.props.getDealsByDate(this.props.user, date_start, date_end);
	}

	componentWillMount() {
		this.getTodaysTickets();
	}

	handleRadio(e) {
		if (e.target.id === 'by_day') {
			this.setState({ radio: 'by_day' });
			this.getTodaysTickets();
		} else if (e.target.id === 'by_date') {
			this.setState({ radio: 'by_date' });
		}
	}

	handleTimeForm(e) {
		let date_start;
		let date_end;
		for (let key in e.target) {
			if (!isNaN(key)) {
				if (e.target[key].id === 'date_start') {
					date_start = e.target[key].value;
				} else if (e.target[key].id === 'date_end') {
					date_end = e.target[key].value;
				}
			}
		}
		if (!date_start || !date_end) {
			this.props.createError({
				name: 'emptyInput'
			});
			return;
		}
		let sDate = new Date(date_start);
		let eDate = new Date(date_end);
		if (sDate > eDate) {
			this.props.createError({
				name: 'startBiggerThanEnd'
			});
			return;
		}
		if (date_start === date_end) {
			this.props.createError({
				name: 'equalDates'
			});
			return;
		}
		date_start += ' 00:00:00';
		date_end += ' 23:59:59';
		this.props.getDealsByDate(this.props.user, date_start, date_end);
	}

	handleTimeFormFocus() {
		let error;
		for (let key in this.props.errors) {
			error = key;
		}
		if (error) {
			this.props.deleteError(error);
		}
	}

	getTickets() {
		let Tickets = this.props.tickets.map((ticket, index) => <Ticket key={index} index={index} ticket={ticket} />);
		return Tickets;
	}

	displayError() {
		if (this.props.errors.emptyInput) {
			if (this.props.errors.emptyInput.status) {
				return 'Пустое поле';
			}
		}
		if (this.props.errors.startBiggerThanEnd) {
			if (this.props.errors.startBiggerThanEnd.status) {
				return 'Даты перепутаны';
			}
		}
		if (this.props.errors.equalDates) {
			if (this.props.errors.equalDates.status) {
				return 'Даты одинаковы';
			}
		}
		return '';
	}

	render() {
		let error = this.displayError();
		return (
			<div className="tickets">
				<h1>Тикеты</h1>
				<div className="display-choice">
					<div><b>Отображать:</b></div>
					<p>
						<input
							id="by_day"
							type="radio"
							onChange={this.handleRadio}
							checked={this.state.radio === 'by_day' ? true : false}
							name="tickets-radio" />
						<label style={{paddingLeft: '6px'}}>&mdash; сделки за сегодняшний день</label>
					</p>
					<p>
						<input
							id="by_date"
							type="radio"
							onChange={this.handleRadio}
							checked={this.state.radio === 'by_date' ? true : false}
							name="tickets-radio" />
						<label style={{paddingLeft: '6px'}}>&mdash; сделки за дату</label>
						{this.state.radio === 'by_date' && (
							<TimeForm
								className={error.length === 0 ? '' : 'error'}
								handleTimeForm={this.handleTimeForm}
								handleFocus={this.handleTimeFormFocus}
								type={'date'}
								from={'От: '}
								to={'До: '}
								submitText={error.length === 0 ? 'Отфильтровать' : error} />
						)}
					</p>
					<table id="last_session_table">
						<tbody>
							<tr className="table-header">
								<td>№</td>
								<td>instrument_id</td>
								<td>Сторона сделки</td>
								<td>Объем</td>
							</tr>
							{this.getTickets()}
						</tbody>
					</table>
				</div>
			</div>
		);
	}

}

function mapStateToProps(state) {
	return {
		user: state.user,
		errors: state.errors,
		tickets: state.tickets
	};
}

function matchDispatchToProps(dispatch) {
	return bindActionCreators({
		getDealsByDate: actions.getDealsByDate,
		createError: actions.createError,
		deleteError: actions.deleteError
	}, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(Tickets);