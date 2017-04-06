import React, { Component } from 'react';

export default class PopUp extends Component {

	//puFunction, puMessage, puButtonText, puClassName, puButtonClassName, puFadeTime - Options

	// constructor(props) {
		// super(props);

	// }

	render() {
		return (
			<div className={`pop-up ${this.props.puClassName}`}>
				<p>{this.props.puMessage}</p>
				<button 
					className={`pop-up-1button ${this.props.puButton1ClassName}`}
					onClick={this.props.puButton1Function}>{this.props.puButton1Text}</button>
				<button 
					className={`pop-up-2button ${this.props.puButton2ClassName}`}
					onClick={this.props.puButton2Function}>{this.props.puButton2Text}</button>
			</div>
		);
	}

}