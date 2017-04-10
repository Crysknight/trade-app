import React, { Component } from 'react';
// import { Link } from 'react-router';

export default class CheckBox extends Component {

	constructor(props) {
		super(props);
		this.state = {
			checked: props.checkboxChecked
		}
		this.handleCheck = this.handleCheck.bind(this);
	}

	handleCheck(e) {
		this.setState({ checked: !this.state.checked });
		if (this.props.checkboxOnChange) {
			this.props.checkboxOnChange(e);
		}
	}

	render() {
		return (
			<input id={this.props.checkboxId} checked={this.state.checked} onChange={this.handleCheck} type="checkbox" /> 
		);
	}

}