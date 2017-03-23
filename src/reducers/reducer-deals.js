export default function(state = [], action) {
	switch (action.type) {
		case "NEW_DEAL": {
			let ownOrder = action.payload.ownOrder;
			let contractorOrder = action.payload.contractorOrder;
			let volume = action.payload.type === 'buy' ? +ownOrder.bought : +ownOrder.saled;
			return [
				...state,
				{
					id: ownOrder.order_id,
					instrument: +action.payload.instrument,
					type: action.payload.type,
					volume
				}
			];
		}
		default: {
			return state;
		}
	}
}