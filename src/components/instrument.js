import React, { Component } from 'react';

export default class Instrument extends Component {

	// constructor(props) {
		// super(props);

	// }

	render() {
    let highlightedGreen = '';
    let highlightedRed = '';
    if (this.props.instrument.interested) {
    	highlightedGreen = 'highlighted-green';
    }
    if (this.props.instrument.dealt > 0) {
    	highlightedRed = 'highlighted-red';
    }
		return (
			<tr className={highlightedGreen}>
				<td className="instrument-name">{this.props.instrument.name}<br /><p style={{ 'font-size':'12px', 'color':'#aaa', 'margin':'2px 0' }}>({this.props.instrument.isin})</p></td>
				<td className={highlightedRed}>{this.props.instrument.price.toFixed(4)}</td>
			</tr>
		);
	}

}