import React, { Component } from 'react';

export default class Timer extends Component {

	constructor(props) {
		super(props);
		this.setTimer = this.setTimer.bind(this);
		this.state = {
			time: undefined
		}
	}

	componentWillMount() {
		if (this.props.endTime) {
			this.setTimer(this.props.endTime);
		}
	}

	componentWillReceiveProps(nextProps) {
		if (this.props.endTime !== nextProps.endTime) {
			this.setTimer(nextProps.endTime);
		}
	}

	componentWillUnmount() {
		clearInterval(this.interval);
	}

	setTimer(endTime) {
		clearInterval(this.interval);
		this.endTime = new Date(endTime);
		this.interval = setInterval(() => {
			let currentTime = new Date();
			let timeLeft = this.endTime - currentTime;
			let hours = Math.round(timeLeft / 3600000);
			let minutes = Math.floor((timeLeft / 60000) % 60);
			let seconds = Math.floor((timeLeft / 1000) % 60);
			if (seconds < 0 || minutes < 0) {
				this.setState({ time: '-- 00:00:00' });
			} else {
				this.setState({
					time: 
					`${hours > 9 ? hours : '0' + hours}:` +
					`${minutes > 9 ? minutes : '0' + minutes}:` +
					`${seconds > 9 ? seconds : '0' + seconds}`
				});
			}
		}, 1000);
	}


	render() {
		return (
			<td className="time">{this.state.time}</td>
		);
	}

}