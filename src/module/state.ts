interface state {
	name: string;
	listeners: any[];
	object: any;
}

const states: { [stateName: string]: state } = {};
let currentState: state;

function create(stateName: string) {
	return states[stateName] = { name: stateName, listeners: [], object: new THREE.Group() };
}

function add_to_state(stateName: string, obj: any) {
	if (!states[stateName]) create(stateName);

	states[stateName].object.add(obj);

	return states[stateName];
}
function get(stateName: string) {
	if (!states[stateName]) create(stateName);

	return states[stateName];
}

function on(stateName: string, handler) {
	let state = states[stateName] || create(stateName);
	state.listeners.push(handler);
}

function goto(stateName: string) {
	if (currentState && currentState.name == stateName) return;
	currentState = states[stateName];

	currentState.listeners.forEach(h => h());
}

export const StateHandler = {
	on, add_to_state, goto, create, get
}