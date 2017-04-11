import React, { Component } from 'react';
// import { Link } from 'react-router';

export default class TimeForm extends Component {

	constructor(props) {
		super(props);
		this.handleTimeForm = this.handleTimeForm.bind(this);
	}

	handleTimeForm(e) {
		e.preventDefault();
		this.props.handleTimeForm(e);
	}

	render() {
		return (
			<div className="time-form">
				<form className={this.props.className} onSubmit={this.handleTimeForm}>
					<label>{this.props.from}</label>
					<input
						onChange={this.props.handleTimeFormInput}
						onFocus={this.props.handleFocus}
						id="date_start"
						type={this.props.type === 'datetime-local' ? 'datetime-local' : 'date'}
						required />
					<label>{this.props.to}</label>
					<input
						onChange={this.props.handleTimeFormInput}
						onFocus={this.props.handleFocus}
						id="date_end"
						type={this.props.type === 'datetime-local' ? 'datetime-local' : 'date'}
						required />
					{!this.props.withoutSubmit &&	<input type="submit" value={this.props.submitText}/>}
				</form>
			</div>
		);
	}

}