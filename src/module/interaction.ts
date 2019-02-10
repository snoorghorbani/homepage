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
	}

	onClick(mesh: any) {
		if (!mesh.onClick) {
			console.log("mesh dont have onclick property");
			debugger;
			return;
		}

		this.meshObjects.push(mesh);
	}

	private onDocumentMouseDown(event) {
		if (!(config.camera && config.renderer)) return;
		event.preventDefault();

		this.mouse.x = (event.clientX / config.renderer.domElement.clientWidth) * 2 - 1;
		this.mouse.y = - (event.clientY / config.renderer.domElement.clientHeight) * 2 + 1;

		this.raycaster.setFromCamera(this.mouse, config.camera);

		var intersects = this.raycaster.intersectObjects(this.meshObjects);

		if (intersects.length > 0) {
			debugger;
			if (!intersects[0].object.onClick) {
				debugger;
				return
			}
			intersects[0].object.onClick();
		}

	}
}
