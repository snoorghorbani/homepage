interface state {
	name: string;
	listeners: any[]
}

const states: { [stateName: string]: state } = {};
let currentState: state;

function add(stateName: string) {
	return states[stateName] = { name: stateName, listeners: [] };
}

function on(stateName: string, handler) {
	let state = states[stateName] || add(stateName);
	state.listeners.push(handler);
}

function goto(stateName: string) {
	currentState = states[stateName];

	currentState.listeners.forEach(h => h());
}

export const StateHandler = {
	on, add, goto
}