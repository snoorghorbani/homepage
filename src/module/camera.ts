import * as T from 'three';
import { Utility } from '../utility/index';
import { Helper } from '../helper/index';

declare const Power0: any;
declare const THREE: any;
declare const TweenMax: any;
declare const BAS: any;
declare const TWEEN: any;


let camera: T.Camera = null;
let start_position: T.Vector3 = null;

const set = function (_camera) {
	camera = _camera;
	start_position = camera.position.clone();
}

const move_right = function (x: number, duration = 1111) {
	new TWEEN.Tween(camera.position)
		.to({ x: Math.abs(x) }, duration)
		.easing(TWEEN.Easing.Circular.Out)
		.start();
}
const move_far_right = function (x: number, far: number, duration = 1111) {
	new TWEEN.Tween(camera.position)
		.to({ z: camera.position.z + far }, duration)
		.easing(TWEEN.Easing.Circular.In)
		.onComplete(() => {
			new TWEEN.Tween(camera.position)
				.to({ x: Math.abs(x) }, duration)
				.easing(TWEEN.Easing.Circular.Out)
				.onComplete(() => {

				})
				.start();
		})
		.start();
}
const move_left = function (x: number, duration = 1111) {
	new TWEEN.Tween(camera.position)
		.to({ x: -1 * Math.abs(x) }, duration)
		.easing(TWEEN.Easing.Circular.Out)
		.start();
}
const move_to_center = function (duration = 1111) {
	move_to({ x: 0, y: 0, z: 0 }, duration)
}
const move_to_last_saved = function (duration = 1111) {
	move_to(start_position, duration)
}
const move_to = function (coordinate: { x?: number, y?: number, z?: number }, duration = 1111) {
	new TWEEN.Tween(camera.position)
		.to(coordinate, duration)
		.easing(TWEEN.Easing.Circular.Out)
		.start();
}

const look_to = function (obj) {
	debugger;
}
const save_position = function () {
	start_position = camera.position.clone();
}


export const Camera = {
	set, move_right, move_left, move_to_center,
	move_to_default: move_to_last_saved,
	save_position,
	look_to,
	move_to_last_saved,
	move_far_right
}


