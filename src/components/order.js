import React, { Component } from 'react';

export default class Order extends Component {
  render() {
  	let user = this.props.user;
  	let userString;
  	let fio = user.name.split(' ');
  	for (let i = 0; i < fio.length; i++) {
  		fio[i] = fio[i][0] + '.';
  	}
  	fio = fio.join(' ');
  	if (this.props.user) {
  		userString = ` - ${user.organization} (${fio})`;
  	}
    return (
      <div className={this.props.error === true ? "order order-error" : `order ${this.props.className}`}>{this.props.size + userString}</div>
    );
  }
}