import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as actions from '../actions';

import TradeTableRow from './TradeTableRow';

import CancelAll from '../components/cancel-all';
import Timer from '../components/timer';

class App extends Component {
  constructor(props) {
    super(props);
    this.cancelAll = this.cancelAll.bind(this);
  }
  componentWillMount() {
    this.props.init(this.props.user);
    window.stop = () => clearInterval(this.interval);
  }
  componentWillUnmount() {
    clearInterval(this.interval);
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.interval !== nextProps.interval && nextProps.interval) {
      this.interval = setInterval(() => {
        this.props.checkUpdate(this.props.user, this.props.deals, this.props.session, this.props.instruments);
      }, 1000);
    } else if (this.props.interval !== nextProps.interval && !nextProps.interval) {
      clearInterval(this.interval);
    }
  }
  createTradeTable() {
  	return this.props.instruments.map((instrument) => <TradeTableRow key={instrument.id} instrument={instrument}/>);
  }
  cancelAll() {
    let orders = [];
    for (let i = 0; i < this.props.orders.length; i++) {
      orders.push(this.props.orders[i].id);
    }
    this.props.cancelOrders(this.props.user.token, orders);
  }
  render() {
    let disabled = !this.props.orders.length;
    if (this.props.session.session_id) {
      return (
        <div className="App">
          <table id="trade_table">
            <tbody>
              <tr className="table-prerow">
                <Timer endTime={this.props.session.date_end}/>
                <td colSpan="5"></td>
                <td className="cancel-all-orders">
                  <CancelAll disabled={disabled} cancelAll={this.cancelAll}/>
                </td>
                <td colSpan="3"></td>
              </tr>
              <tr className="table-header">
              <td>Инструмент</td>
              <td>Цена</td>
              <td colSpan="3">Объем заявки</td>
              <td style={{borderRight: 'none', width: '9%'}}>Покупка</td>
              <td style={{border: 'none'}}></td>
              <td style={{borderLeft: 'none', width: '9%'}}>Продажа</td>
              <td>Куплено</td>
              <td>Продано</td>
              </tr>
            {this.createTradeTable()}
            </tbody>
          </table>
        </div>
      );
    } else {
      let cup = require('../../public/images/tea-cup.png');
      return (
        <div className="App">
          <div className="no-session">
            <p>На данный момент активной сессии нет</p>
            <img alt="please-stand-by" src={cup} />
          </div>
        </div>
      );
    }
    
  }
}

function mapStateToProps(state) {
  return {
    instruments: state.instruments,
    user: state.user,
    session: state.session,
    orders: state.orders,
    deals: state.deals,
    interval: state.interval
  };
}

function matchDispatchToProps(dispatch) {
  return bindActionCreators({
  	cancelOrders: actions.cancelOrders,
    checkUpdate: actions.checkUpdate,
    init: actions.init
  }, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(App);
