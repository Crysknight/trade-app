import React, { Component } from 'react';

export default class CancelAll extends Component {
  render() {
    return (
      <button className="cancel-all" onClick={() => this.props.cancelAll()}>Отменить все заявки</button>
    );
  }
}