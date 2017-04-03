import React, { Component } from 'react';
// import { Link } from 'react-router';

export default class TimeForm extends Component {

	// constructor(props) {
		// super(props);

	// }

	componentWillMount() {
		// this.interval = setInterval(() => {
		// 	this.currentTime = new Date();
		// 	let isoYear = this.currentTime.getFullYear();
		// 	let iso Month = ('0' + (this.currentTime.getMonth() + 1)).length > 2 ? this.currentTime.getMonth + 1 : 
		// 	this.forceUpdate();
		// }, 5000);
	}

	render() {
		return (
			<div className="time-form">
				<form>
					<label>Время начала:</label>
					<input type="datetime-local" min="" required />
					<label>Время окончания:</label>
					<input type="datetime-local" required />
				</form>
			</div>
		);
	}

}