import React, { Component } from 'react';
import InstrumentsList from '../containers/instruments-list';

class App extends Component {
  render() {
    return (
      <div className="App">
      	<InstrumentsList></InstrumentsList>
      </div>
    );
  }
}

export default App;
