import React, { Component } from 'react';
// import { Link } from 'react-router';

export default class TimeForm extends Component {

	constructor(props) {
		super(props);
		let currentTime = new Date();
		this.state = {
			minTime: currentTime.toISOString()
		}
	}

	customISOString(date) {
		let Y = date.getFullYear();
		let M = (date.getMonth() + 1) > 9 ? date.getMonth() : '0' + date.getMonth();
		let D = date.getDate() > 9 ? date.getDate() : '0' + date.getDate();
		let h = date.getHours() > 9 ? date.getHours() : '0' + date.getHours();
		let m = date.getMinutes() > 9 ? date.getMinutes() : '0' + date.getMinutes();
		let s = date.getSeconds() > 9 ? date.getSeconds() : '0' + date.getSeconds();
		return `${Y}-${M}-${D}T${h}:${m}:${s}`;
	}

	componentWillMount() {
		// this.interval = setInterval(() => {
		// 	let currentTime = new Date();
		// 	this.setState({ minTime: currentTime.toISOString() });
		// }, 5000);
	}

	render() {
		let minTime = new Date();
		minTime = this.customISOString(minTime);
		return (
			<div className="time-form">
				<form>
					<label>Время начала:</label>
					<input onChange={this.props.handleTimeForm} id="date_start" min={minTime} type="datetime-local" required />
					<label>Время окончания:</label>
					<input onChange={this.props.handleTimeForm} id="date_end" max="2666-06-06T06:06:06" type="datetime-local" required />
				</form>
			</div>
		);
	}

}