import React, { Component } from 'react';

export default class Bid extends Component {
  constructor(props) {
  	super(props);
  	this.setOrderType = this.setOrderType.bind(this);
  }
  setOrderType() {
  	this.props.setOrderType('bid');
  }
  render() {
    return (
      <input type="submit" value="BID" onClick={this.setOrderType} />
    );
  }
}