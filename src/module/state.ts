import { Utility } from "../utility/index";

declare const TWEEN: any;

interface state {
	name: string;
	type: "action" | "view";
	xIndex?: number;
	yIndex?: number;
	listeners: any[];
	object?: any;
}

const states: { [stateName: string]: state } = {};
let currentState: state;
let camera: any;
let gap: number;

const set = function (_camera: any, _gap = 50) {
	camera = _camera;
	gap = _gap;
}

function create_view(stateName: string, xIndex, yIndex) {
	var position = find_position(xIndex, yIndex, 444);
	var object = new THREE.Group();
	object.position.x = position.x;
	object.position.y = position.y;

	return states[stateName] = {
		name: stateName,
		type: "view",
		listeners: [],
		object,
		xIndex,
		yIndex
	};
}
function create_action(actionName: string) {
	return states[actionName] = states[actionName] || {
		name: actionName,
		type: "action",
		listeners: []
	};
}

function add_to_state(stateName: string, obj: any) {
	states[stateName].object.add(obj);
	return states[stateName];
}

function get(stateName: string) {
	return states[stateName];
}

function on(stateName: string, handler) {
	let state = states[stateName] || create_action(stateName);
	state.listeners.push(handler);
}

function goto(stateName: string) {
	if (currentState && currentState.name == stateName) return;
	currentState = states[stateName];

	if (currentState.type == "view") {
		for (const sn in states) {
			var state = states[sn];
			if (state.type == "view") {
				var newPosition = find_position(
					state.xIndex - states[stateName].xIndex,
					state.yIndex - states[stateName].yIndex,
					camera.position.z
				);
				new TWEEN.Tween(state.object.position)
					.to(newPosition, 1111)
					.easing(TWEEN.Easing.Circular.Out)
					.start();
			}
		}
	}

	currentState.listeners.forEach(h => h());
}

const find_position = function (xIndex, yIndex, depth) {
	var openBoxDim = Utility.position.fullwidthInDistance(camera, camera.position.z + depth);
	return {
		x: xIndex * (openBoxDim.width + gap),
		y: yIndex * (openBoxDim.height + gap)
	}
}

export const StateHandler = {
	set, on, add_to_state, goto, create_view, create_action, get
}