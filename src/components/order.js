import React, { Component } from 'react';

export default class Order extends Component {
  render() {
  	let fio = '';
  	if (this.props.user) {
  		fio = ` - ${this.props.user.fio}`;
  	}
    return (
      <div className={this.props.error === true ? "order order-error" : `order ${this.props.className}`}>{this.props.size + fio}</div>
    );
  }
}