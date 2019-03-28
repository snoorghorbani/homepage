import * as T from 'three';
import { OrbitControls } from './js/controls/OrbitControls';
import { _text_animation } from './triangulate';
import { create_menu } from './menu';
import { Renderer } from './module/renderer';
import { StateHandler } from './module/state';


let renderer;
declare const TWEEN: any;
declare const THREE: any;
declare const Power0: any;
declare const BAS: any;
// declare const OrbitControls: any;


class MenuApp {
	width = 100;
	height = 100;
	state: { isOpen: boolean }
	private readonly raycaster = new THREE.Raycaster();
	private readonly scene = new THREE.Scene();
	private readonly camera = new THREE.PerspectiveCamera(45, this.width / this.height, 0.1, 10000);
	private light;
	private light2;
	private radius = 0;


	private controls: OrbitControls;
	private menu;
	constructor() {
		renderer = Renderer("menuCanvas", {
			width: this.width,
			height: this.height
		});
		renderer.config({
			width: 200,
			height: 200,
			scene: this.scene,
			camera: this.camera
		});
		this.setup_camera();
		this.setup_lights();
		this.setup_controls()
		// var axesHelper = new THREE.Mesh
		// 	(new THREE.SphereGeometry(20, 22, 22),
		// 		new THREE.MeshNormalMaterial({ wireframe: false }));
		// this.scene.add(axesHelper);

		this.menu = create_menu(this.scene);
		this._handleMenu();
		this.animate();
		// setTimeout(() => {
		// 	this.maximize()
		// }, 2222)
	}


	private setup_lights() {
		this.light = new THREE.DirectionalLight(0xffffff, 1, 500);
		this.light.position.set(50, -50, 50);
		this.light.castShadow = true;
		this.light.shadow.mapSize.width = 1024; // default is 512
		this.light.shadow.mapSize.height = 1024;
		this.scene.add(this.light);
		// this.scene.add(
		// 	new THREE.PointLightHelper(this.light)
		// )
		this.light2 = new THREE.DirectionalLight(0xffffff, 1, 500);
		this.light2.position.set(100, 100, 300);
		this.light2.castShadow = true;
		this.light2.shadow.mapSize.width = 1024; // default is 512
		this.light2.shadow.mapSize.height = 1024;
		// this.scene.add(
		// 	new THREE.PointLightHelper(this.light2)
		// )
		// this.scene.add(this.light2);
	}
	private setup_camera() {
		// this.camera.position.set(300, -300, 300);
		this.camera.position.set(0, 0, 200);
		this.camera.lookAt(0, 0, 0);
		this.scene.add(this.camera);
	}
	private adjustCanvasSize() {
		// renderer.dim(width, height);
		this.camera.aspect = this.width / this.height;
		this.camera.updateProjectionMatrix();
	}
	private _handleMenu() {
		renderer.domElement.addEventListener('mouseenter', (event) => {
			StateHandler.goto("bold_cursor");
			this.menu.hover();
		}, false);
		renderer.domElement.addEventListener('click', (event) => {
			this.menu.toggle();
			// this.maximize()
		}, false);
		renderer.domElement.addEventListener('mouseout', (event) => {
			StateHandler.goto("normal_cursor");
			this.menu.relax();
		}, false);
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

	private maximize() {
		setInterval(() => {
			renderer.dim(this.width, this.height)
		}, 11)
		new TWEEN.Tween(this)
			.to({ width: innerWidth, height: innerHeight }, 999)
			.easing(TWEEN.Easing.Circular.Out)
			.start();

	}

	private render() {
		this.radius += .03
		this.radius = this.radius % 360;
		this.light.position.x = Math.sin(this.radius) * 100;
		this.light.position.z = Math.cos(this.radius) * 100;
		this.light.position.y = 0;
		this.light2.position.y = Math.cos(this.radius) * 100;
		this.light2.position.z = Math.sin(this.radius) * 100;
		this.light2.position.x = 0;

		renderer.render();
		this.adjustCanvasSize();
		TWEEN.update();
	}
}
const app = new MenuApp();
