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
    this.createTradeTable = this.createTradeTable.bind(this);
    this.getTheApp = this.getTheApp.bind(this);
  }
  componentWillMount() {
    if (this.props.user.role === 'admin') {
      this.props.getUsers(this.props.user.token);
    }
    this.props.init(this.props.user);
    window.stop = () => clearInterval(this.interval);
  }
  componentWillUnmount() {
    clearInterval(this.interval);
    this.props.turnOffInterval();
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.interval !== nextProps.interval && nextProps.interval) {
      if (this.props.user.role === 'user') {
        this.interval = setInterval(() => {
          this.props.checkUpdate(this.props.user, this.props.deals, this.props.session, this.props.instruments);
        }, 1000);
      } else if (this.props.user.role === 'admin') {
        this.interval = setInterval(() => {
          this.props.checkUpdate(
            this.props.user, 
            this.props.deals, 
            this.props.session,
            this.props.instruments,
            this.props.adminUsers, 
            this.props.orders
          );
        }, 1000);
      }
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
  updateSession(type) {
    switch (type) {
      case 1: {
        let newDateEnd = new Date(this.props.session.end);
        newDateEnd.setMinutes(newDateEnd.getMinutes() + 1);
        newDateEnd = `${newDateEnd.getFullYear()}-` +
          `${newDateEnd.getMonth() + 1 > 9 ? newDateEnd.getMonth() + 1 : '0' + (newDateEnd.getMonth() + 1)}-` +
          `${newDateEnd.getDate() > 9 ? newDateEnd.getDate() : '0' + newDateEnd.getDate()} ` +
          `${newDateEnd.getHours() > 9 ? newDateEnd.getHours() : '0' + newDateEnd.getHours()}:` +
          `${newDateEnd.getMinutes() > 9 ? newDateEnd.getMinutes() : '0' + newDateEnd.getMinutes()}:` +
          `${newDateEnd.getSeconds() > 9 ? newDateEnd.getSeconds() : '0' + newDateEnd.getSeconds()}`;
        this.props.updateSession(this.props.user.token, this.props.session.id, newDateEnd);
        break;
      }
      case 5: {
        let newDateEnd = new Date(this.props.session.end);
        newDateEnd.setMinutes(newDateEnd.getMinutes() + 5);
        newDateEnd = `${newDateEnd.getFullYear()}-` +
          `${newDateEnd.getMonth() + 1 > 9 ? newDateEnd.getMonth() + 1 : '0' + (newDateEnd.getMonth() + 1)}-` +
          `${newDateEnd.getDate() > 9 ? newDateEnd.getDate() : '0' + newDateEnd.getDate()} ` +
          `${newDateEnd.getHours() > 9 ? newDateEnd.getHours() : '0' + newDateEnd.getHours()}:` +
          `${newDateEnd.getMinutes() > 9 ? newDateEnd.getMinutes() : '0' + newDateEnd.getMinutes()}:` +
          `${newDateEnd.getSeconds() > 9 ? newDateEnd.getSeconds() : '0' + newDateEnd.getSeconds()}`;
        this.props.updateSession(this.props.user.token, this.props.session.id, newDateEnd);
        break;
      }
      case 'end': {
        let newDateEnd = new Date();
        newDateEnd = `${newDateEnd.getFullYear()}-` +
          `${newDateEnd.getMonth() + 1 > 9 ? newDateEnd.getMonth() + 1 : '0' + (newDateEnd.getMonth() + 1)}-` +
          `${newDateEnd.getDate() > 9 ? newDateEnd.getDate() : '0' + newDateEnd.getDate()} ` +
          `${newDateEnd.getHours() > 9 ? newDateEnd.getHours() : '0' + newDateEnd.getHours()}:` +
          `${newDateEnd.getMinutes() > 9 ? newDateEnd.getMinutes() : '0' + newDateEnd.getMinutes()}:` +
          `${newDateEnd.getSeconds() > 9 ? newDateEnd.getSeconds() : '0' + newDateEnd.getSeconds()}`;
        this.props.updateSession(this.props.user.token, this.props.session.id, newDateEnd);
        break;
      }
      default: {

      }
    }
  }

  getMarketExcerpt() {
    let interestedInstruments = this.props.instruments.filter(instrument => instrument.interested).map(instrument => {
      return (
        <div className="instrument interested">
          {instrument.name}<b> {instrument.price.toFixed(4)}&nbsp;&nbsp;&nbsp;&bull;</b>
        </div>
      );
    });
    let dealtInstruments = this.props.instruments.filter(instrument => instrument.dealt).map(instrument => {
      return (
        <div className="instrument dealt">
          {instrument.name}<b> {instrument.price.toFixed(4)}&nbsp;&nbsp;&nbsp;&bull;</b>
        </div>
      );
    });
    let interestedInstrumentsTrack = null;
    let dealtInstrumentsTrack = null;
    if (interestedInstruments.length) {
      interestedInstrumentsTrack = <marquee className="interested-instruments-track">{interestedInstruments}</marquee>;
    }
    if (dealtInstruments.length) {
      dealtInstrumentsTrack = <marquee className="dealt-instruments-track">{dealtInstruments}</marquee>;
    }
    return <div className="market-excerpt">{interestedInstrumentsTrack}{dealtInstrumentsTrack}</div>;
  }

  getTheApp() {
    let App;
    let timeUpdated = false;
    if (this.props.processes['updated_session_time']) {
      if (this.props.processes['updated_session_time'].status) {
        timeUpdated = true;
      }
    }
    if (this.props.user.role === 'user') {
      let disabled = !this.props.orders.length;
      App = (
            <div style={{'padding-bottom':'80px'}}>
              <table id="trade_table">
                <tbody>
                  <tr className="table-prerow">
                    <Timer endTime={this.props.session.end} timeUpdated={timeUpdated}/>
                    <td colSpan="3"></td>
                    <td colSpan="3" style={{textAlign: 'center'}} className="cancel-all-orders">
                      <CancelAll disabled={disabled} cancelAll={this.cancelAll}/>
                    </td>
                    <td colSpan="2"></td>
                  </tr>
                  <tr className="table-header">
                    <td className="col-instrument-name">Инструмент</td>
                    <td className="col-instrument-price">Цена</td>
                    <td className="col-volume" colSpan="3">Объем заявки</td>
                    <td className="col-buy">Покупка</td>
                    <td className="col-cancel"></td>
                    <td className="col-sell">Продажа</td>
                    <td className="col-bought">Куплено</td>
                    <td className="col-sold">Продано</td>
                  </tr>
                  {this.createTradeTable()}
                </tbody>
              </table>
              {this.getMarketExcerpt()}
            </div>
      );
    } else if (this.props.user.role === 'admin') {
      let disableButtons = false;
      if (this.props.processes['update_session_time']) {
        if (this.props.processes['update_session_time'].status) {
          disableButtons = true;
        }
      }
      App = (
            <div style={{'padding-bottom':'80px'}}>
              <table id="trade_table" className="admin">
                <tbody>
                  <tr className="table-prerow">
                    <Timer endTime={this.props.session.end} timeUpdated={timeUpdated}/>
                    <td colSpan="3">
                      Продлить на:
                      <button 
                        disabled={disableButtons}
                        style={{marginRight: '8px', marginLeft: '8px'}} 
                        onClick={() => this.updateSession(1)}>1 мин.</button>
                      <button 
                        disabled={disableButtons}
                        style={{marginRight: '8px'}} 
                        onClick={() => this.updateSession(5)}>5 мин.</button>
                      <button 
                        disabled={disableButtons}
                        className="end-session" 
                        onClick={() => this.updateSession('end')}>Завершить</button>
                    </td>
                  </tr>
                  <tr className="table-header">
                    <td className="col-instrument-name">Инструмент</td>
                    <td className="col-instrument-price">Цена</td>
                    <td className="col-buy">Покупка</td>
                    <td className="col-sell">Продажа</td>
                    <td className="set-interest">Установить интерес</td>
                  </tr>
                  {this.createTradeTable()}
                </tbody>
              </table>
              {this.getMarketExcerpt()}
            </div>
      );
    }
    return App;
  }

  render() {
    if (this.props.session.status > 1) {
      return (
        <div className="App">
          {this.getTheApp()}
        </div>
      );
    } else {
      let cup = require('../../public/images/tea-cup.png');
      return (
        <div className="App">
          <div className="no-session">
            <p>На данный момент активной сессии нет</p>
            {
              this.props.session.status === 1 && 
              <p className="begin-session">Начало следующей сессии: {this.props.session.start}</p>
            } 
            <img alt="please-stand-by" src={cup} />
          </div>
        </div>
      );
    }
    
  }
}

function mapStateToProps(state) {
  return {
    processes: state.processes,
    instruments: state.instruments,
    user: state.user,
    session: state.session,
    orders: state.orders,
    deals: state.deals,
    interval: state.interval,
    adminUsers: state.adminUsers
  };
}

function matchDispatchToProps(dispatch) {
  return bindActionCreators({
  	cancelOrders: actions.cancelOrders,
    checkUpdate: actions.checkUpdate,
    init: actions.init,
    turnOffInterval: actions.turnOffInterval,
    getUsers: actions.getUsers,
    updateSession: actions.updateSession
  }, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(App);