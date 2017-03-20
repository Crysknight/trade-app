import React, { Component } from 'react';

export default class CancelRow extends Component {
  render() {
    return (
      <button 
        disabled={this.props.disabled} 
        className="cancel-row" 
        onClick={() => this.props.cancelRow(this.props.instrument)}>
      Отменить заявки</button>
    );
  }
}