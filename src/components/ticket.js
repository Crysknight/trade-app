import React, { Component } from 'react';

export default class Ticket extends Component {

	// constructor(props) {
		// super(props);

	// }

	render() {
		if (this.props.user.roleName === 'isuser') {
			return (
				<tr>
					<td>{this.props.index + 1}</td>
					<td className={this.props.ticket.side === 'Покупка' ? 'buy' : 'sale'}>{this.props.ticket.side}</td>
					<td>{this.props.ticket.instrument_name}</td>
					<td>{this.props.ticket.instrument_price}</td>
					<td>{this.props.ticket.volume}</td>
				</tr>
			);
		} else if (this.props.user.roleName === 'isadmin') {
			let buyer;
			let seller;
			for (let i = 0; i < this.props.adminUsers.length; i++) {
				if (this.props.adminUsers[i].id === this.props.ticket.buyer) {
					buyer = this.props.adminUsers[i].fio;
				} else if (this.props.adminUsers[i].id === this.props.ticket.seller) {
					seller = this.props.adminUsers[i].fio;
				}
			}
			return (
				<tr>
					<td>{this.props.index + 1}</td>
					<td>{buyer}</td>
					<td>{seller}</td>
					<td>{this.props.ticket.instrument_name}</td>
					<td>{this.props.ticket.instrument_price}</td>
					<td>{this.props.ticket.volume}</td>
				</tr>
			);			
		}
	}

}