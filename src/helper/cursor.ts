import { StateHandler } from '../module/state';
import { Interaction } from '../module/interaction';
import { Utility } from '../utility/index';
import { Camera } from '../module/camera';

const interaction = new Interaction();

declare const THREE: any;
declare const TWEEN: any;

let scene, camera;
let menuItems = [];

export const CircularCursor = function(_scene: any, _camera: any) {
	scene = _scene;
	camera = _camera;

	var geometry = new THREE.CircleGeometry(5, 32);
	var material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
	var circle = new THREE.Mesh(geometry, material);
	scene.add(circle);
	circle.onMousemove = function(a, b) {
		debugger;
		console.log(circle.parent.name);
	};
	interaction.onMousemove(circle);

	document.addEventListener(
		'mousemove',
		(event) => {
			debugger;
			const fullDim = Utility.position.fullwidthInDistance(camera);

			const x = ((fullDim.width / 2) * (event.clientX / window.innerWidth * 2))-(fullDim.width / 2);
			const y = ((fullDim.height / 2) * (-(event.clientY / window.innerHeight) * 2)) + (fullDim.height/2);
			console.log(x, y);
			circle.position.set(x, y, 0);
		},
		false
	);
};