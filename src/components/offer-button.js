import React, { Component } from 'react';

export default class Offer extends Component {
  constructor(props) {
  	super(props);
  	this.setOrderType = this.setOrderType.bind(this);
  }
  setOrderType() {
  	this.props.setOrderType('sale');
  }
  render() {
    return (
      <input disabled={this.props.disabled} type="submit" value="Продажа" onClick={this.setOrderType} />
    );
  }
}