import React, { Component } from 'react';

export default class Instrument extends Component {

	// constructor(props) {
		// super(props);

	// }

	render() {
    let highlightedGreen = '';
    let highlightedRed = '';
    if (this.props.instrument.interest > 0) {
    	highlightedGreen = 'highlighted-green';
    }
    if (this.props.instrument.interest > 1) {
    	highlightedRed = 'highlighted-red';
    }
		return (
			<tr className={highlightedGreen}>
				<td className="instrument-name">{this.props.instrument.name}</td>
				<td className={highlightedRed}>{this.props.instrument.price.toFixed(4)}</td>
			</tr>
		);
	}

}