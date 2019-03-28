import { StateHandler } from '../module/state';
import { Interaction } from '../module/interaction';
import { Utility } from '../utility/index';
import { Camera } from '../module/camera';
import { Renderer } from '../module/renderer';

const width = innerWidth;
const height = innerHeight;

const renderer = Renderer('mainCanvas', {
	width,
	height
});

const interaction = new Interaction();

declare const THREE: any;
declare const TWEEN: any;

let scene, camera;
let menuItems = [];

export const CircularCursor = function (_scene: any, _camera: any) {
	scene = _scene;
	camera = _camera;

	var geometry = new THREE.CircleGeometry(1, 56);
	var material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
	material.transparent = true;
	material.blending = THREE.CustomBlending;
	material.blendEquation = THREE.MaxEquation; //default
	material.blendSrc = THREE.SrcColorFactor; //default
	material.blendDst = THREE.OneMinusSrcAlphaFactor; //default

	var circle = new THREE.Mesh(geometry, material);
	circle.position.z = -100;
	camera.add(circle);
	circle.onMousemove = function (a, b) {
		// debugger;
	};
	interaction.onMousemove(circle);


	document.addEventListener(
		'mousemove',
		(event) => {
			const distanceFromCamera = 100
			const fullDim = Utility.position.fullwidthInDistance(camera, distanceFromCamera);
			console.log(fullDim);
			console.log(camera.position.z)
			const x = fullDim.width / 2
				* (event.clientX / window.innerWidth * 2 - 1)
			// - fullDim.width / 2
			// + camera.position.x;
			const y = fullDim.height / 2 * (-(event.clientY / window.innerHeight) * 2) + fullDim.height / 2;
			circle.position.set(x, y, -distanceFromCamera);
		},
		false
	);

	var buildUp = function () {
		return new TWEEN.Tween({
			scale: 1
		}).to({
			scale: 4
		}, 1111)
			.easing(TWEEN.Easing.Circular.Out)
			.onUpdate(function (state) {
				circle.scale.set(state.scale, state.scale, state.scale);
			}).onComplete(function () {
				// buildDown().start();
			});
	};

	var buildDown = function () {
		return new TWEEN.Tween({
			scale: 4
		}).to({
			scale: 1
		}, 1111)
			.easing(TWEEN.Easing.Circular.Out)
			.onUpdate(function (state) {
				circle.scale.set(state.scale, state.scale, state.scale);
			}).onComplete(function () {
				// buildUp().start();
			});
	};

	// buildUp().start();

	StateHandler.on('bold_cursor', () => {
		buildUp().start();
	});
	StateHandler.on('normal_cursor', () => {
		buildDown().start();
	});

};
