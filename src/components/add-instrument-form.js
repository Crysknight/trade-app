import React, { Component } from 'react';

export default class AddInstrumentForm extends Component {

	// constructor(props) {
		// super(props);

	// }

	render() {
		return (
			<form onSubmit={this.props.handleAddInstrumentForm}>
				<label className="add-instruments">Добавить инструменты:</label>
				<div id="__instruments">
					<div className="instrument">
						<input type="text" placeholder="Инструмент" required />
						<input type="number" step="0.0001" placeholder="Цена" required />
					</div>
					<input type="submit" id="__add_instrument" value="Добавить" />
				</div>
			</form>
		);
	}

}