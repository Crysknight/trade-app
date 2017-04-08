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
    this.cancelRow = this.cancelRow.bind(this);
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
      token: this.props.user.token,
      type: this.state.orderType,
      quantity: +this.state.quantity,
  	  instrument_id: this.props.instrument.id,
      session_id: +this.props.session.session_id
  	});
    this.setState({ quantity: 0 });
  }
  cancelRow(instrument) {
    let orders = [];
    for (let i = 0; i < this.props.orders.length; i++) {
      if (this.props.orders[i].instrument === instrument) {
        orders.push(this.props.orders[i].id);
      }
    }
    if (orders.length !== 0) {
      this.props.cancelOrders(this.props.user.token, orders);
    }
  }
  getBids() {
    if (this.props.orders.filter(order => order._failure).length !== 0) {
      return (
        <Order error={true} size="Ошибка сервера. Перезагрузите страницу" />
      );
    }
  	return this.props.orders.map((order) => {
  	  if (order.type === 'buy' && order.instrument === this.props.instrument.id) {
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
  	  if (order.type === 'sale' && order.instrument === this.props.instrument.id) {
  	    return (
  	      <Order key={order.id} size={order.quantity} />
  	    );
  	  } else {
  	  	return false;
  	  }
  	});
  }
  getClosedBids() {
    let deals = this.props.deals;
    let amount = 0;
    for (let i = 0; i < deals.length; i++) {
      if (deals[i].type === 'buy' && deals[i].instrument === this.props.instrument.id) {
        amount += deals[i].volume;
      }
    }
    if (amount) {
      return amount;
    }
  }
  getClosedOffers() {
    let deals = this.props.deals;
    let amount = 0;
    for (let i = 0; i < deals.length; i++) {
      if (deals[i].type === 'sale' && deals[i].instrument === this.props.instrument.id) {
        amount += deals[i].volume;
      }
    }
    if (amount) {
      return amount;
    }
  }
  render() {
    let disabled = false;

    /* Цветакадирофка! Ы! */
    let animatedRed = '';
    let highlightedYellow = '';
    let highlightedGreen = '';
    let highlightedRed = '';

    if (this.props.instrument.interest > 0) {
      highlightedGreen = 'highlighted-green ';
    }

    if (this.props.instrument.interest > 1) {
      highlightedRed = ' highlighted-red';
    }

    if (this.props.processes[`price_changed_${this.props.instrument.id}`]) {
      if (this.props.processes[`price_changed_${this.props.instrument.id}`].status) {
        highlightedYellow = 'highlighted-yellow';
      }
    }

    if (this.props.processes[`instrument_new_deal_${this.props.instrument.id}`]) {
      if (this.props.processes[`instrument_new_deal_${this.props.instrument.id}`].status) {
        animatedRed = ' animated-red';
      }
    }

    if (this.props.processes[`adding_order_${this.props.instrument.id}`]) {
      if (this.props.processes[`adding_order_${this.props.instrument.id}`].status) {
        disabled = true;
      }
    }

    if (this.state.quantity === 0) {
      disabled = true;
    }
    let ordersForThisInstrument = this.props.orders.filter((order) => {
      return order.instrument === this.props.instrument.id;
    });
    let cancelDisabled = !ordersForThisInstrument.length;
  	return (
  	  <tr className={`${highlightedGreen}${highlightedYellow}`}>
  	    <td className="bordered">{this.props.instrument.name}</td>
  	    <td className={`bordered${highlightedRed}${animatedRed}`}>{this.props.instrument.price.toFixed(4)}</td>
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
            cancelRow={this.cancelRow} 
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
    session: state.session,
    deals: state.deals,
    processes: state.processes
  };
}

function matchDispatchToProps(dispatch) {
  return bindActionCreators({
  	cancelOrders: actions.cancelOrders,
  	addOrder: actions.addOrder
  }, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(TradeTableRow);