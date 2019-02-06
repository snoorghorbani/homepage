import * as T from 'three';
import { OrbitControls } from './js/controls/OrbitControls';
import { _text_animation } from './triangulate';
import { multi_prefab } from './multi-prefab';
import { create_menu } from './menu';
import { Helper } from './helper/index';
import { Curve } from './helper/curve';
import { circleWave } from './circle-wave.1';
import { Renderer } from './renderer';
import { morph_test } from './morph';

const width = 100;
const height = 100;

const renderer = Renderer("menuCanvas", {
	width,
	height
});

declare const TWEEN: any;
declare const THREE: any;
declare const Power0: any;
declare const BAS: any;
// declare const OrbitControls: any;

class MenuApp {
	private readonly scene = new THREE.Scene();
	private readonly camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 10000);


	private brick: T.Mesh;
	private brickGeo: T.Geometry;
	private plate: T.Mesh;
	private controls: OrbitControls;
	private menu;
	constructor() {
		renderer.config({
			width: 200,
			height: 200,
			scene: this.scene,
			camera: this.camera
		});
		this.setup_camera();
		this.setup_lights();
		this.setup_controls()
		var axesHelper = new THREE.AxesHelper(55);
		this.scene.add(axesHelper);

		this.menu = create_menu(this.scene);
		this.animate();
	}


	private setup_lights() {
		var light = new THREE.PointLight(0x00ffff, 100, 1000);
		light.position.set(100, -100, -100);
		light.castShadow = true;
		// light.shadow.mapSize.width = 1024; // default is 512
		// light.shadow.mapSize.height = 1024;
		this.scene.add(light);
	}
	private setup_camera() {
		this.camera.position.set(0, 0, 200);
		this.camera.lookAt(0, 0, 0);
		this.scene.add(this.camera);
	}
	private adjustCanvasSize() {
		renderer.config;
		this.camera.aspect = width / height;
		this.camera.updateProjectionMatrix();
	}

	private animate() {
		requestAnimationFrame(() => {
			this.animate();
		});
		this.render();
	}

	private setup_controls() {
		this.controls = new THREE.OrbitControls(this.camera, renderer.domElement);
		this.controls.target.set(0, 0.5, 0);
		this.controls.rotateSpeed = 1.0;
		this.controls.zoomSpeed = 1.2;
		this.controls.keyPanSpeed = 0.8;
		this.controls.enablePan = false;
	}
	private render() {
		renderer.render();
		this.adjustCanvasSize();

		this.menu.rotation.z += .03;
	}
}
const app = new MenuApp();
