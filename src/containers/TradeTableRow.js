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
      token: this.props.user.token
  	});
  }
  getBids() {
    if (this.props.orders.filter(order => order._failure).length !== 0) {
      return (
        <Order error={true} size="Ошибка сервера. Перезагрузите страницу" />
      );
    }
  	return this.props.orders.map((order) => {
	  if (order.type === 'bid' && order.instrument === this.props.instrument.id) {
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
	  if (order.type === 'offer' && order.instrument === this.props.instrument.id) {
	    return (
	      <Order key={order.id} size={order.quantity} />
	    );
	  } else {
	  	return false;
	  }
  	});
  }
  getClosedBids() {
  	// return this.props.orders.map((order) => {
	  // if (order.type === 'bid' && order.status === 'closed' && order.instrument === this.props.instrument.id) {
	  //   return (
	  //     <Order key={order.id} size={order.quantity} />
	  //   );
	  // } else {
	  // 	return false;
	  // }
  	// });
  }
  getClosedOffers() {
  	// return this.props.orders.map((order) => {
	  // if (order.type === 'offer' && order.status === 'closed' && order.instrument === this.props.instrument.id) {
	  //   return (
	  //     <Order key={order.id} size={order.quantity} />
	  //   );
	  // } else {
	  // 	return false;
	  // }
  	// });
  }
  render() {
    let disabled = false;
    for (let i = 0; i < this.props.addingOrders.length; i++) {
      if (this.props.addingOrders[i] === this.props.instrument.id) {
        disabled = true;
      } 
    }
    let ordersForThisInstrument = this.props.orders.filter((order) => {
      return order.instrument === this.props.instrument.id;
    });
    let cancelDisabled = !ordersForThisInstrument.length;
  	return (
  	  <tr>
  	    <td className="bordered">{this.props.instrument.name}</td>
  	    <td className="bordered">{this.props.instrument.price.toFixed(4)}</td>
  	    <td colSpan="3">
  	      <form className="size-form" onSubmit={this.registerOrder}>
  	        <BidButton disabled={disabled} setOrderType={this.setOrderType} />
  	        <OrderSize quantity={this.state.quantity} setQuantity={this.setQuantity}/>
  	        <OfferButton disabled={disabled} setOrderType={this.setOrderType} />
  	      </form>
  	    </td>
  	    <td style={{borderLeft: '1px solid #000'}}>{this.getBids()}</td>
  	    <td className="cancel-row">
          <CancelRow 
            instrument={this.props.instrument.id} 
            cancelRow={this.props.cancelRow} 
            disabled={cancelDisabled} />
        </td>
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
    user: state.user,
    addingOrders: state.addingOrders
  };
}

function matchDispatchToProps(dispatch) {
  return bindActionCreators({
  	cancelRow: actions.cancelRow,
  	addOrder: actions.addOrder
  }, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(TradeTableRow);