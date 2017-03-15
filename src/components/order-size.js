import React, { Component } from 'react';

export default class OrderSize extends Component {
  setQuantity(e) {
  	this.props.setQuantity(e.target.value);
  }
  render() {
    return (
      <input 
        onChange={this.setQuantity.bind(this)}
        type="number"
        step="25"
        min="25"
        value={this.props.quantity}
        max="100"
      />
    );
  }
}