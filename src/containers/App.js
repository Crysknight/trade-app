import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as actions from '../actions';

import TradeTableRow from './TradeTableRow';

import CancelAll from '../components/cancel-all';

class App extends Component {
  createTradeTable() {
  	return this.props.instruments.map((instrument) => <TradeTableRow key={instrument.id} instrument={instrument}/>);
  }
  render() {
    return (
      <div className="App">
      	<table id="trade_table">
      	  <tbody>
      	    <tr className="table-prerow">
      	      <td className="time">14:19</td>
      	      <td colSpan="5"></td>
      	      <td className="cancel-all-orders">
      	        <CancelAll cancelAll={this.props.cancelAll}/>
      	      </td>
      	      <td colSpan="3"></td>
      	    </tr>
      	  	<tr className="table-header">
  	  		  <td>Инструмент</td>
  	  		  <td>Цена</td>
  	  		  <td colSpan="3">Объем заявки</td>
  	  		  <td style={{borderRight: 'none', width: '18%'}}>Покупка</td>
  	  		  <td style={{border: 'none'}}></td>
  	  		  <td style={{borderLeft: 'none', width: '18%'}}>Продажа</td>
  	  		  <td>Куплено</td>
  	  		  <td>Продано</td>
      	  	</tr>
      		{this.createTradeTable()}
      	  </tbody>
      	</table>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    instruments: state.instruments
  };
}

function matchDispatchToProps(dispatch) {
  return bindActionCreators({
  	cancelAll: actions.cancelAll
  }, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(App);
