import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

class InstrumentsList extends Component {
	createListItems() {
		return this.props.instruments.map((instrument) => {
			return (
				<li key={instrument.id}>{instrument.name}</li>
			);
		});
	}
	render() {
		return (
			<ul>
				{this.createListItems()}
			</ul>
		);
	}
}

function mapStateToProps(state) {
	return {
		instruments: state.instruments
	};
}

export default connect(mapStateToProps)(InstrumentsList);