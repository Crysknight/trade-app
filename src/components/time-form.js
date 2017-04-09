import React, { Component } from 'react';
// import { Link } from 'react-router';

export default class TimeForm extends Component {

	// constructor(props) {
	// 	super(props);
	// }

	render() {
		return (
			<div className="time-form">
				<form>
					<label>Время начала:</label>
					<input onChange={this.props.handleTimeForm} id="date_start" type="datetime-local" required />
					<label>Время окончания:</label>
					<input onChange={this.props.handleTimeForm} id="date_end" max="2666-06-06T06:06:06" type="datetime-local" required />
				</form>
			</div>
		);
	}

}