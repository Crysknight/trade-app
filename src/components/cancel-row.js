import React, { Component } from 'react';

export default class CancelRow extends Component {
  render() {
    return (
      <button className="cancel-row" onClick={() => this.props.cancelRow(this.props.instrument)}>Cancel All</button>
    );
  }
}