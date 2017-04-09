import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
// import { Link } from 'react-router';

import * as actions from '../actions';

//here be components

//import '../css/class.css';

class ConfirmationPopUp extends Component {

	constructor(props) {
		super(props);
		this.handleConfirmButton = this.handleConfirmButton.bind(this);
		this.handleAbortButton = this.handleAbortButton.bind(this);
	}

	handleConfirmButton() {
		this.props.puButtonFunction();
		this.props.hidePopUp();
	}

	handleAbortButton() {
		this.props.hidePopUp();
	}

	render() {
		return (
			<div className="pop-up-wrapper">
				<div className={`pop-up ${this.props.puClassName}`}>
					<p>{this.props.puMessage}</p>
					<button 
						className="confirm-button"
						onClick={this.handleConfirmButton}>{this.props.puButtonText}</button>
					<button 
						className="abort-button"
						onClick={this.handleAbortButton}>Отмена</button>
				</div>
			</div>
		);
	}

}

function mapStateToProps(state) {
	return {
		
	};
}

function matchDispatchToProps(dispatch) {
	return bindActionCreators({
		hidePopUp: actions.hidePopUp
	}, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(ConfirmationPopUp);

// import React, { Component } from 'react';

// export default class PopUp extends Component {

// 	//puFunction, puMessage, puButtonText, puClassName, puButtonClassName, puFadeTime - Options

// 	// constructor(props) {
// 		// super(props);

// 	// }

// 	render() {
// 		return (
// 			<div className={`pop-up ${this.props.puClassName}`}>
// 				<p>{this.props.puMessage}</p>
// 				<button 
// 					className={`pop-up-1button ${this.props.puButton1ClassName}`}
// 					onClick={this.props.puButton1Function}>{this.props.puButton1Text}</button>
// 				<button 
// 					className={`pop-up-2button ${this.props.puButton2ClassName}`}
// 					onClick={this.props.puButton2Function}>{this.props.puButton2Text}</button>
// 			</div>
// 		);
// 	}

// }