import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
// import { Link } from 'react-router';

import * as actions from '../actions';

import TimeForm from '../components/time-form';
import AddInstrumentForm from '../components/add-instrument-form';

//import '../css/addsession.css';

class AddSession extends Component {

	constructor(props) {
		super(props);
		this.handleTimeForm = this.handleTimeForm.bind(this);
		this.handleAddInstrumentForm = this.handleAddInstrumentForm.bind(this);
		this.handleInstrumentForm = this.handleInstrumentForm.bind(this);
		this.state = {
			date_start: undefined,
			date_end: undefined,
			instrument_ids: []
		}
	}

	componentWillMount() {
		this.props.uploadAdminInstruments(this.props.user);
	}

	handleTimeForm(e) {
		if (e.target.id === 'date_start') {
			this.setState({ date_start: e.target.value });
		} else if (e.target.id === 'date_end') {
			this.setState({ date_end: e.target.value });
		}
	}

	handleAddInstrumentForm(e) {
		e.preventDefault();
		console.dir(e.target);
		let instrument_name = e.target[0].value;
		let instrument_price = e.target[1].value;
		this.props.addInstrument(this.props.user, instrument_name, instrument_price);
	}

	handleInstrumentForm(e) {
		console.dir(e.target);
	}

	render() {
		let Instruments = this.props.adminInstruments.map(instrument => {
			return (
				<tr key={instrument.id}>
					<td colSpan="5">
						<form onSubmit={this.handleInstrumentForm}>
							<table>
								<tbody>					
									<td>{instrument.id}</td>
									<td><input type="text" value={instrument.name} /></td>
									<td><input type="number" step="0.0001" value={instrument.price.toFixed(4)} /></td>
									<td><input id={`instrument_${instrument.id}`} type="checkbox" checked /></td>
									<td><button>Обновить</button></td>
								</tbody>
							</table>
						</form>
					</td>

				</tr>
			);
		});
		return (
			<div className="add-session">
				<div className="wrapper">
					<h2>Добавить сессию</h2>
					<div id="__session_form">
						<TimeForm handleTimeForm={this.handleTimeForm} />
					</div>
					<AddInstrumentForm handleAddInstrumentForm={this.handleAddInstrumentForm} />
				</div>
				<div className="wrapper">
					<h2>Список инструментов</h2>
					<table cellpadding="0" cellspacing="0">
						<tbody>
							<tr className="table-header">
								<td>№</td>
								<td>Инструмент</td>
								<td>Цена</td>
								<td>Участвует в сессии</td>
								<td></td>
							</tr>
							{Instruments}
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
		adminInstruments: state.adminInstruments
	};
}

function matchDispatchToProps(dispatch) {
	return bindActionCreators({
		uploadAdminInstruments: actions.uploadAdminInstruments,
		addInstrument: actions.addInstrument
	}, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(AddSession);