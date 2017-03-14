import React, { Component } from 'react';

export default class Offer extends Component {
  constructor(props) {
  	super(props);
  	this.setOrderType = this.setOrderType.bind(this);
  }
  setOrderType() {
  	this.props.setOrderType('offer');
  }
  render() {
    return (
      <input type="submit" value="OFFER" onClick={this.setOrderType} />
    );
  }
}