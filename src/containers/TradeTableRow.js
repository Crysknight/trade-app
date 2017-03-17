import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as actions from '../actions';

import BidButton from '../components/bid-button';
import OfferButton from '../components/offer-button';
import OrderSize from '../components/order-size';
import Order from '../components/order';
import CancelRow from '../components/cancel-row';

class TradeTableRow extends Component {
  constructor(props) {
  	super(props);
  	this.state = {
  	  quantity: 0
  	};
  	this.registerOrder = this.registerOrder.bind(this);
  	this.setQuantity = this.setQuantity.bind(this);
  	this.setOrderType = this.setOrderType.bind(this);
  }
  setQuantity(value) {
  	this.setState({
  	  quantity: value
  	});
  }
  setOrderType(value) {
  	this.setState({
  	  orderType: value
  	});
  }
  registerOrder(event) {
  	event.preventDefault();
  	this.props.addOrder({
  	  instrument: this.props.instrument.id,
  	  quantity: this.state.quantity,
  	  type: this.state.orderType,
  	  status: 'placed',
      token: this.props.user.token
  	});
  }
  getBids() {
  	return this.props.orders.map((order) => {
	  if (order.type === 'bid' && order.status === 'placed' && order.instrument === this.props.instrument.id) {
	    return (
	      <Order key={order.id} size={order.quantity} />
	    );
	  } else {
	  	return false;
	  }
  	});
  }
  getOffers() {
  	return this.props.orders.map((order) => {
	  if (order.type === 'offer' && order.status === 'placed' && order.instrument === this.props.instrument.id) {
	    return (
	      <Order key={order.id} size={order.quantity} />
	    );
	  } else {
	  	return false;
	  }
  	});
  }
  getClosedBids() {
  	return this.props.orders.map((order) => {
	  if (order.type === 'bid' && order.status === 'closed' && order.instrument === this.props.instrument.id) {
	    return (
	      <Order key={order.id} size={order.quantity} />
	    );
	  } else {
	  	return false;
	  }
  	});
  }
  getClosedOffers() {
  	return this.props.orders.map((order) => {
	  if (order.type === 'offer' && order.status === 'closed' && order.instrument === this.props.instrument.id) {
	    return (
	      <Order key={order.id} size={order.quantity} />
	    );
	  } else {
	  	return false;
	  }
  	});
  }
  render() {
  	return (
  	  <tr>
  	    <td className="bordered">{this.props.instrument.name}</td>
  	    <td className="bordered">{this.props.instrument.price.toFixed(4)}</td>
  	    <td colSpan="3">
  	      <form className="size-form" onSubmit={this.registerOrder}>
  	        <BidButton setOrderType={this.setOrderType} />
  	        <OrderSize quantity={this.state.quantity} setQuantity={this.setQuantity}/>
  	        <OfferButton setOrderType={this.setOrderType} />
  	      </form>
  	    </td>
  	    <td style={{borderLeft: '1px solid #000'}}>{this.getBids()}</td>
  	    <td className="cancel-row"><CancelRow instrument={this.props.instrument.id} cancelRow={this.props.cancelRow} /></td>
  	    <td>{this.getOffers()}</td>
  	    <td className="bordered">{this.getClosedBids()}</td>
  	    <td className="bordered">{this.getClosedOffers()}</td>
  	  </tr>
  	);
  }
}

function mapStateToProps(state) {
  return {
    orders: state.orders,
    user: state.user
  };
}

function matchDispatchToProps(dispatch) {
  return bindActionCreators({
  	cancelRow: actions.cancelRow,
  	addOrder: actions.addOrder
  }, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(TradeTableRow);