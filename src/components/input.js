import React, { Component } from 'react';

export default class Input extends Component {

	constructor(props) {
		super(props);
		this.state = ({
			value: this.props.inputValue
		});
		this.handleChange = this.handleChange.bind(this);
	}

	handleChange(e) {
		this.setState({
			value: e.target.value
		});
	}

	render() {
		return (
			<input id={this.props.inputId}
				type={this.props.inputType}
				name={this.props.inputName}
				step={this.props.inputStep}
				className={this.props.inputClassName}
				value={this.state.value}
				placeholder={this.props.inputPlaceHolder}
				onChange={this.handleChange} />
		);
	}

}