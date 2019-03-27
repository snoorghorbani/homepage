import { Utility } from '../utility/index';
import { Helper } from '../helper/index';

declare const Power0: any;
declare const THREE: any;
declare const TweenMax: any;
declare const BAS: any;
declare const TWEEN: any;

const config = {
	camera: null,
	renderer: null,
}

export const setup = function (camera, renderer) {
	config.camera = camera;
	config.renderer = renderer;
}

export class Interaction {
	private raycaster = new THREE.Raycaster();
	private mouse = new THREE.Vector2();
	private meshObjects: any[] = [];

	constructor() {
		document.addEventListener('mousedown', this.onDocumentMouseDown.bind(this), false);
		document.addEventListener('mousemove', this.onDocumentMouseMove.bind(this), false);
	}

	onClick(mesh: any) {
		if (!mesh.onClick) {
			console.log("mesh dont have onclick property");
			return;
		}

		this.meshObjects.push(mesh);
	}

	onMousemove(mesh: any) {
		if (!mesh.onMousemove) {
			console.log("mesh dont have onMousemovw property");
			return;
		}

		this.meshObjects.push(mesh);
	}

	private miniRotate(obj) {
		var oldX = obj.rotation.x;
		var oldY = obj.rotation.y;
		var oldZ = obj.rotation.y;
		document.body.addEventListener("mousemove", (event) => {
			var maxAngle = 45;
			var x = event.clientX;
			var y = event.clientY;
			var jahateX, deltaX, rateX;
			var jahateY, deltaY, rateY;

			if (x > innerWidth / 2) {
				jahateX = 1;
				deltaX = innerWidth - x;
				rateX = 1 - (deltaX / (innerWidth / 2));
			} else {
				jahateX = -1;
				deltaX = -x;
				rateX = 1 + (deltaX / (innerWidth / 2));
			}

			if (y > innerHeight / 2) {
				jahateY = -1;
				deltaY = innerHeight - y;
				rateY = 1 - (deltaY / (innerHeight / 2));
			} else {
				jahateY = 1;
				deltaY = -y;
				rateY = 1 + (deltaY / (innerHeight / 2));
			}

			var angleX = jahateX * rateX * maxAngle;
			// this.camera.position.x = oldX - angleX;
			var angleY = jahateY * rateY * maxAngle;
			// this.camera.position.y = oldY - angleY;

			obj.rotation.x = angleX;
			obj.rotation.y = angleY;
		});
	}

	private onDocumentMouseDown(event) {
		if (!(config.camera && config.renderer)) return;
		event.preventDefault();

		this.mouse.x = (event.clientX / config.renderer.domElement.clientWidth) * 2 - 1;
		this.mouse.y = - (event.clientY / config.renderer.domElement.clientHeight) * 2 + 1;

		this.raycaster.setFromCamera(this.mouse, config.camera);

		var intersects = this.raycaster.intersectObjects(this.meshObjects);

		if (intersects.length > 0) {
			if (!intersects[0].object.onClick) {
				debugger;
				return
			}
			intersects[0].object.onClick();
		}

	}
	private onDocumentMouseMove(event) {
		if (!(config.camera && config.renderer)) return;
		event.preventDefault();

		this.mouse.x = (event.clientX / config.renderer.domElement.clientWidth) * 2 - 1;
		this.mouse.y = - (event.clientY / config.renderer.domElement.clientHeight) * 2 + 1;

		this.raycaster.setFromCamera(this.mouse, config.camera);

		var intersects = this.raycaster.intersectObjects(this.meshObjects);

		if (intersects.length > 0) {
			if (!intersects[0].object.onMousemove) {
				debugger;
				return
			}
			intersects[0].object.onMousemove();
		}

	}
}
