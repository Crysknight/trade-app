import React, { Component } from 'react';

export default class Ticket extends Component {

	// constructor(props) {
		// super(props);

	// }

	render() {
		if (this.props.user.role === 'user') {
			return (
				<tr>
					<td>{this.props.index + 1}</td>
					<td className={this.props.ticket.side === 'Покупка' ? 'buy' : 'sell'}>{this.props.ticket.side}</td>
					<td>{this.props.ticket.instrument.name}</td>
					<td>{this.props.ticket.instrument.price}</td>
					<td>{this.props.ticket.volume}</td>
				</tr>
			);
		} else if (this.props.user.role === 'admin') {
			let buyer;
			let seller;
			for (let i = 0; i < this.props.adminUsers.length; i++) {
				let user = this.props.adminUsers[i];
				if (user.id === this.props.ticket.buyer.user) {
					buyer = user.name.split(' ');
					for (let i = 0; i < buyer.length; i++) {
						buyer[i] = buyer[i][0] + '.';
					}
					buyer = user.organization + ' (' + buyer.join(' ') + ')';
				} else if (user.id === this.props.ticket.seller.user) {
					seller = user.name.split(' ');
					for (let i = 0; i < seller.length; i++) {
						seller[i] = seller[i][0] + '.';
					}
					seller = user.organization + ' (' + seller.join(' ') + ')';
				}
			}
			return (
				<tr>
					<td>{this.props.index + 1}</td>
					<td>{buyer}</td>
					<td>{seller}</td>
					<td>{this.props.ticket.instrument.name}</td>
					<td>{this.props.ticket.instrument.price}</td>
					<td>{this.props.ticket.volume}</td>
				</tr>
			);			
		}
	}

}