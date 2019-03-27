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
	material.transparent = true;
	material.blending = THREE.AdditiveBlending;
	// material.blendEquation = THREE.AddEquation; //default
	// material.blendSrc = THREE.SrcAlphaFactor; //default
	// material.blendDst = THREE.OneMinusSrcAlphaFactor; //default
	var circle = new THREE.Mesh(geometry, material);
	circle.position.z = 100;
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
			const fullDim = Utility.position.fullwidthInDistance(camera, camera.position.z - 100);

			const x = fullDim.width / 2 * (event.clientX / window.innerWidth * 2) - fullDim.width / 2;
			const y = fullDim.height / 2 * (-(event.clientY / window.innerHeight) * 2) + fullDim.height / 2;
			circle.position.set(x, y, 100);
		},
		false
	);
};
