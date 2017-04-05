import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
// import { Link } from 'react-router';

import * as actions from '../actions';

import TimeForm from '../components/time-form';
import AddInstrumentForm from '../components/add-instrument-form';
import CheckBox from '../components/checkbox';
import Input from '../components/input';

//import '../css/addsession.css';

class AddSession extends Component {

	constructor(props) {
		super(props);
		this.handleTimeForm = this.handleTimeForm.bind(this);
		this.handleAddInstrumentForm = this.handleAddInstrumentForm.bind(this);
		this.handleInstrumentForm = this.handleInstrumentForm.bind(this);
		this.handleCheckbox = this.handleCheckbox.bind(this);
		this.registerSession = this.registerSession.bind(this);
		this.storeSubmitId = this.storeSubmitId.bind(this);
		this.state = {
			date_start: undefined,
			date_end: undefined
		}
	}

	componentWillMount() {
		this.props.uploadAdminInstruments(this.props.user);
	}

	handleTimeForm(e) {
		if (e.target.id === 'date_start') {
			this.setState({ date_start: e.target.value.replace(/T/, ' ') });
		} else if (e.target.id === 'date_end') {
			this.setState({ date_end: e.target.value.replace(/T/, ' ') + ':00' });
		}
	}

	handleAddInstrumentForm(e) {
		e.preventDefault();
		let instrument_name = e.target[0].value;
		let instrument_price = e.target[1].value;
		this.props.addInstrument(this.props.user, instrument_name, instrument_price);
	}

	handleCheckbox(e) {
		this.props.instrumentCheckbox(+e.target.id.slice(11));
	}

	handleInstrumentForm(e) {
		e.preventDefault();
		let instrumentIndex;
		let instrumentName;
		let instrumentPrice;
		for (let key in e.target) {
			if (!isNaN(key)) {
				if (e.target[key].classList.length !== 0) {
					if (+e.target[key].classList[0].slice(11) === this.submitId) {
						if (e.target[key].classList[1] === 'name') {
							instrumentName = e.target[key].value;
							instrumentIndex = +e.target[key].classList[2].slice(6);
						} else if (e.target[key].classList[1] === 'price') {
							instrumentPrice = +e.target[key].value;
						}
					}
				}
			}
		}
		if (
			instrumentName && 
			instrumentPrice && 
			(instrumentName !== this.props.adminInstruments[instrumentIndex - 1].name ||
			instrumentPrice !== this.props.adminInstruments[instrumentIndex - 1].price)
		) {
			this.props.updateInstrument(this.props.user.token, instrumentIndex, this.submitId, instrumentName, instrumentPrice);
		}
	}

	storeSubmitId(e) {
		this.submitId = +e.target.id.slice(18);
	}

	registerSession() {
		if (this.state.date_start && this.state.date_end && this.props.adminInstruments.filter(instrument => instrument.chosen).length) {
			let chosenInstruments = this.props.adminInstruments.map(instrument => instrument.id);
			this.props.addSession(this.props.user.token, this.state.date_start, this.state.date_end, chosenInstruments);
		}
	}

	render() {
		let Instruments = this.props.adminInstruments.map(instrument => {
			let disabled = false;
			let successfulUpdate;
			if (this.props.processes[`updating_instrument_${instrument.id}`]) {
				if (this.props.processes[`updating_instrument_${instrument.id}`].status) {
					disabled = true;
				}
			}
			if (this.props.processes[`successfully_updated_index_${instrument.index}`]) {
				if (this.props.processes[`successfully_updated_index_${instrument.index}`].status) {
					successfulUpdate = 'success';
					disabled = true;
				}
			}
			return (
				<tr key={instrument.id}>			
					<td>{instrument.index}</td>
					<td><Input inputClassName={`instrument_${instrument.id} name index_${instrument.index}`} inputType="text" inputValue={instrument.name} /></td>
					<td><Input inputClassName={`instrument_${instrument.id} price index_${instrument.index}`} inputType="number" inputStep="0.0001" inputValue={instrument.price.toFixed(4)} /></td>
					<td><CheckBox checkboxId={`instrument_${instrument.id}`} checkboxOnChange={this.handleCheckbox} checkboxChecked={instrument.chosen} /></td>
					<td><button
						className={successfulUpdate}
						disabled={disabled}
						onClick={this.storeSubmitId}
						id={`instrument_button_${instrument.id}`}>{successfulUpdate ? 'Обновлено' : 'Обновить'}</button></td>
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
					<button className="register-session" onClick={this.registerSession}>ЗАРЕГИСТРИРОВАТЬ СЕССИЮ</button>
					<AddInstrumentForm handleAddInstrumentForm={this.handleAddInstrumentForm} />
				</div>
				<div className="wrapper">
					<h2>Список инструментов</h2>
					<form onSubmit={this.handleInstrumentForm}>
						<table className="instruments" cellpadding="0" cellspacing="0">
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
					</form>
				</div>
			</div>
		);
	}

}

function mapStateToProps(state) {
	return {
		user: state.user,
		adminInstruments: state.adminInstruments,
		processes: state.processes
	};
}

function matchDispatchToProps(dispatch) {
	return bindActionCreators({
		uploadAdminInstruments: actions.uploadAdminInstruments,
		addInstrument: actions.addInstrument,
		instrumentCheckbox: actions.instrumentCheckbox,
		addSession: actions.addSession,
		updateInstrument: actions.updateInstrument
	}, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(AddSession);