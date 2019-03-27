import { StateHandler } from './module/state';
import * as T from 'three';
import { OrbitControls } from './js/controls/OrbitControls';
import { _text_animation } from './triangulate';
import { multi_prefab } from './multi-prefab';
import { create_menu } from './menu';
import { Helper } from './helper/index';
import { Curve } from './helper/curve';
import { circleWave as circleWave1 } from './circle-wave.1';
import { circleWave } from './circle-wave';
import { Renderer } from './module/renderer';
import './menu-app';
import { SolidWireframeMaterial } from './helper/wireframe';
import * as menuItems from './menu/menu-items';
import * as Interaction from './module/interaction';
import { Scene } from 'three';
import { Utility } from './utility/index';
import { textHelper } from './helper/text';
import { Camera } from './module/camera';
import { backgroundHelper } from './helper/background';
import { colors } from './colors';
import { CircularCursor } from './helper/cursor';

declare const TWEEN: any;
declare const THREE: any;
declare const Power0: any;
declare const BAS: any;
// declare const OrbitControls: any;

const width = innerWidth;
const height = innerHeight;

const renderer = Renderer('mainCanvas', {
	width,
	height
});

const camera = {
	fov: 45,
	near: 0.1,
	far: 1000
};

class App {
	private readonly scene = new THREE.Scene();
	private readonly camera = new THREE.PerspectiveCamera(camera.fov, width / height, camera.near, camera.far);
	// private projector = new THREE.Projector();

	private selectedMenuItem: any;
	private brick: T.Mesh;
	private brickGeo: T.Geometry;
	private plate: T.Mesh;
	private controls: OrbitControls;
	private INTERSECTED: any;
	noramlMouse: { x: number; y: number } = { x: -1, y: -1 };
	constructor() {
		Interaction.setup(this.camera, renderer);
		Camera.set(this.camera);
		StateHandler.set(this.camera);
		backgroundHelper.set(this.scene, this.camera);

		document.body.addEventListener('mousemove', (event) => {
			this.noramlMouse.x = event.clientX / window.innerWidth * 2 - 1;
			this.noramlMouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
		});

		renderer.config({
			width,
			height,
			scene: this.scene,
			camera: this.camera
		});
		this.config_scene();
		// this.setup_controls();
		// this.setup_orbit_controls();
		// this.setup_helpers();
		this.setup_camera();
		// this.setup_lights();

		debugger;
		StateHandler.create_action('open_menu');
		StateHandler.create_action('close_menu');
		var helloWord = StateHandler.create_view('Hello, Word', 0, 0);
		var aboutMe = StateHandler.create_view('About Me', 0, -1);

		var bg1 = backgroundHelper.add('Hello, Word', colors.secondery, 444);
		var bg2 = backgroundHelper.add('About Me', colors.main, 444, 0, -1);
		StateHandler.add_to_state('Hello, Word', bg1);
		StateHandler.add_to_state('About Me', bg2);

		textHelper(helloWord.object, 'Hello World');
		this.scene_circle_wave(helloWord.object);

		this.scene.add(helloWord.object);
		this.scene.add(aboutMe.object);

		CircularCursor(this.scene, this.camera);
		// this.test_quaternion();

		// var menu = create_menu(this.scene);
		// this.scene_text_to_shape();
		// this.scene_transform_prefabs();
		// this.scene_break_shape();
		// this.scene_multi_prefabs();

		// this.scene_wireframe_multimaterial_obejct();
		// this.helper_wireframe_shader();
		// Helper.instansedPrefabs(this.scene);
		// Curve(this.scene);
		menuItems.create_menu_items(this.scene, this.camera);
		/**
		 * 
		 */
		this.animate();
	}

	private test_quaternion() {
		var xAngleInRadian =
			this.camera.position.z === 0 ? 0 : Math.atan(this.camera.position.y / this.camera.position.z);
		var yAngleInRadian =
			this.camera.position.x === 0 ? 0 : Math.atan(this.camera.position.z / this.camera.position.x);
		var zAngleInRadian =
			this.camera.position.y === 0 ? 0 : Math.atan(this.camera.position.x / this.camera.position.y);
		var xAngle = Utility.angle.toDeg(xAngleInRadian);
		var yAngle = Utility.angle.toDeg(yAngleInRadian);
		var zAngle = Utility.angle.toDeg(zAngleInRadian);
		var _height = Math.tan(Utility.angle.toRad(camera.fov / 2)) * this.camera.position.z * 2;
		var _width = _height * width / height;
		// var _geo = new THREE.CubeGeometry(360, 160, 0);
		// var _geo1 = new THREE.CubeGeometry(_width, _height, 0);
		var _geo1 = new THREE.CubeGeometry(_width, _height, 0);
		var _box1 = new THREE.Mesh(_geo1, new THREE.MeshBasicMaterial({ color: 0xffff00 }));
		// _box1.rotation.x = xAngleInRadian;
		// _box1.rotation.y = yAngleInRadian;
		// debugger
		// _box1.rotation.z = zAngleInRadian;
		// var quaternion = new THREE.Quaternion(); // create one and reuse it
		// var v1 = new THREE.Vector3(1, 0, 0);
		// var v2 = new THREE.Vector3(1, 2, -1);
		// quaternion.setFromUnitVectors(v1, v2);
		// var matrix = new THREE.Matrix4(); // create one and reuse it
		// matrix.makeRotationFromQuaternion(quaternion);
		// _geo1.applyMatrix(matrix);
		this.scene.add(_box1);
	}
	private scene_circle_wave(parent) {
		circleWave(parent, {
			wavesAmount: 12,
			wavesHeight: 5,
			circlesAmount: 33,
			circlesSpacing: 2,
			lineWidth: 1,
			opacityCoeff: 0.4,
			color: colors.forground as any,
			dev: true,
			radius: 66,
			colorCoeff: 1,
			tweenDelay: 1500,
			circleResolution: 360,
			gap: 2,
			z: true
		});
	}
	private helper_wireframe_shader() {
		var geo = new THREE.BoxBufferGeometry(20, 20, 20);
		var _mat = SolidWireframeMaterial(geo);
		this.scene.add(new THREE.Mesh(geo, _mat));
	}
	private scene_wireframe_multimaterial_obejct() {
		var geo = new THREE.BoxBufferGeometry(20, 20, 20);
		var darkMaterial = new THREE.MeshBasicMaterial({
			color: 0xffffff,
			transparent: true,
			opacity: 1,
			side: THREE.BackSide
		});
		var wireframeMaterial = new THREE.MeshBasicMaterial({
			color: 0x333333,
			wireframe: true,
			wireframeLinewidth: 11,
			transparent: true
		});
		var multiMaterial = [ darkMaterial, wireframeMaterial ];
		var outlineMaterial1 = new THREE.MeshBasicMaterial({
			color: 0xf63a5b,
			side: THREE.BackSide
		});
		var outlineMesh1 = new THREE.Mesh(geo, outlineMaterial1);
		outlineMesh1.scale.multiplyScalar(1.13);
		this.scene.add(outlineMesh1);
		var sphere = THREE.SceneUtils.createMultiMaterialObject(geo.clone(), multiMaterial);
		this.scene.add(sphere);
	}
	private scene_multi_prefabs() {
		multi_prefab(this.scene);
	}
	private scene_break_shape() {
		var brickGeo = (this.brickGeo = new THREE.SphereGeometry(20, 20, 20));
		this.brick = new THREE.Mesh(brickGeo, new THREE.MeshNormalMaterial({ wireframe: false }));
		this.brick.position.set(0, 0, 30);
		this.brick.castShadow = true;
		this.brick.receiveShadow = true;
		this.scene.add(this.brick);
		this.scene.remove(this.brick);
		var mat = new THREE.MeshLambertMaterial({ flatShading: true });
		var brekedGeo = this.breakdownGeometry(this.brickGeo);
		var currentMesh = new THREE.Mesh(brekedGeo, mat);
		this.scene.add(currentMesh);
	}
	private scene_text_to_shape() {
		_text_animation(this.scene);
	}
	private scene_transform_prefabs() {
		var brickGeo = (this.brickGeo = new THREE.CubeGeometry(80, 80, 80));
		var brick = new THREE.Mesh(brickGeo, new THREE.MeshNormalMaterial({ wireframe: true }));
		// brick.position.set(222, 100, 100);
		var prefabs = new BAS.PrefabBufferGeometry(new THREE.TetrahedronGeometry(1.0), 10000);
		Helper.transform(this.scene, prefabs, brick, new THREE.SphereGeometry(40, 20, 20), {
			duration: 8.0,
			ease: Power0.easeIn,
			repeat: -1,
			repeatDelay: 0.25,
			yoyo: true
		});
	}
	private setup_helpers() {
		var axesHelper = new THREE.AxesHelper(55);
		this.scene.add(axesHelper);

		// var axes = new THREE.AxisHelper(50);
		// this.scene.add(axes);
		// var helper = new THREE.GridHelper(1000, 10);
		// helper.setColors(0x0000ff, 0x808080);
		// this.scene.add(helper);
	}
	private config_scene() {
		this.scene.background = new THREE.Color(colors.background);
	}
	private setup_lights() {
		var light = new THREE.PointLight(0xffffff, 1, 1000);
		light.position.set(0, 0, 100);
		light.castShadow = true;
		light.shadow.mapSize.width = 1024; // default is 512
		light.shadow.mapSize.height = 1024;
		this.scene.add(light);
	}
	private setup_camera() {
		this.camera.position.set(0, 0, 200);
		this.camera.lookAt(0, 0, 0);
		this.scene.add(this.camera);
	}
	private setup_controls() {
		var oldX = this.camera.position.x;
		var oldY = this.camera.position.y;
		document.body.addEventListener('mousemove', (event) => {
			var maxAngle = 45;
			var x = event.clientX;
			var y = event.clientY;
			var jahateX, deltaX, rateX;
			var jahateY, deltaY, rateY;

			if (x > innerWidth / 2) {
				jahateX = 1;
				deltaX = innerWidth - x;
				rateX = 1 - deltaX / (innerWidth / 2);
			} else {
				jahateX = -1;
				deltaX = -x;
				rateX = 1 + deltaX / (innerWidth / 2);
			}

			if (y > innerHeight / 2) {
				jahateY = -1;
				deltaY = innerHeight - y;
				rateY = 1 - deltaY / (innerHeight / 2);
			} else {
				jahateY = 1;
				deltaY = -y;
				rateY = 1 + deltaY / (innerHeight / 2);
			}

			var angleX = jahateX * rateX * maxAngle;
			// this.camera.position.x = oldX - angleX;
			var angleY = jahateY * rateY * maxAngle;
			// this.camera.position.y = oldY - angleY;

			new TWEEN.Tween(this.camera.position)
				.to({ x: oldX - angleX, y: oldY - angleY }, 1111)
				.easing(TWEEN.Easing.Linear.None)
				.onUpdate((frame: any) => {
					this.camera.position.set(frame.x, frame.y, frame.z);
					this.camera.lookAt(new THREE.Vector3(0, 0, 0));
				})
				.onComplete(() => {
					this.camera.lookAt(new THREE.Vector3(0, 0, 0));
				})
				.start();

			this.camera.lookAt(new THREE.Vector3(0, 0, 0));
		});
	}
	private setup_orbit_controls() {
		this.controls = new THREE.OrbitControls(this.camera, renderer.domElement);
		this.controls.target.set(0, 0.5, 0);
		this.controls.rotateSpeed = 1.0;
		this.controls.zoomSpeed = 1.2;
		this.controls.keyPanSpeed = 0.8;
		this.controls.enablePan = false;
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
	private render() {
		renderer.render();
		this.adjustCanvasSize();

		// this.brick.rotateZ(0.03);
		// this.controls.update();
		TWEEN.update();
	}
	private move_camera() {
		var from = {
			x: this.camera.position.x,
			y: this.camera.position.y,
			z: this.camera.position.z
		};

		var to = {
			x: from.x,
			y: from.y,
			z: from.z + 500
		};
		new TWEEN.Tween(from)
			.to(to, 2222)
			.easing(TWEEN.Easing.Linear.None)
			.onUpdate((frame: any) => {
				this.camera.position.set(frame.x, frame.y, frame.z);
				this.camera.lookAt(new THREE.Vector3(0, 0, 0));
			})
			.onComplete(() => {
				this.camera.lookAt(new THREE.Vector3(0, 0, 0));
			})
			.start();
	}
	private breakdownGeometry(sourceGeometry: any) {
		var geom = new THREE.Geometry();

		// Create a Vector3 with positive random values scaled by amount.
		var randVect = function(amount: any) {
			return new THREE.Vector3(Math.random() * amount, Math.random() * amount, Math.random() * amount);
		};

		// Create and randomly offset a triangle based on 3 original vertices
		var makeTri = function(geom: any, vertA: any, vertB: any, vertC: any, normal: any) {
			var delta = normal.clone().multiplyScalar(0.5).multiply(randVect(1));
			geom.vertices.push(vertA.clone().add(delta));
			geom.vertices.push(vertB.clone().add(delta));
			geom.vertices.push(vertC.clone().add(delta));
			var vertIndex = geom.vertices.length - 3;
			var newFace = new THREE.Face3(vertIndex, vertIndex + 1, vertIndex + 2, normal);
			geom.faces.push(newFace);
		};

		var faces = sourceGeometry.faces;
		for (var i = 0; i < faces.length; i++) {
			var face = faces[i];
			var vertA = sourceGeometry.vertices[face.a];
			var vertB = sourceGeometry.vertices[face.b];
			var vertC = sourceGeometry.vertices[face.c];
			var vertD = new THREE.Vector3().addVectors(vertA, vertB).multiplyScalar(0.5);
			var vertE = new THREE.Vector3().addVectors(vertB, vertC).multiplyScalar(0.5);
			var vertF = new THREE.Vector3().addVectors(vertC, vertA).multiplyScalar(0.5);

			makeTri(geom, vertA, vertD, vertF, face.normal);
			makeTri(geom, vertD, vertB, vertE, face.normal);
			makeTri(geom, vertE, vertC, vertF, face.normal);
			makeTri(geom, vertD, vertE, vertF, face.normal);
		}

		geom.verticesNeedUpdate = true;
		geom.normalsNeedUpdate = true;
		return geom;
	}
}

const app = new App();
