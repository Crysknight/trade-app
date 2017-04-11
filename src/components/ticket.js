import React, { Component } from 'react';

export default class Ticket extends Component {

	// constructor(props) {
		// super(props);

	// }

	render() {
		return (
			<tr>
				<td>{this.props.index + 1}</td>
				<td>{this.props.ticket.instrument_id}</td>
				<td className={this.props.ticket.side === 'Покупка' ? 'buy' : 'sale'}>{this.props.ticket.side}</td>
				<td>{this.props.ticket.volume}</td>
			</tr>
		);
	}

}