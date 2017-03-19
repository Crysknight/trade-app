import React, { Component } from 'react';

export default class Order extends Component {
  render() {
    return (
      <div className={this.props.error === true ? "order order-error" : "order"}>{this.props.size}</div>
    );
  }
}