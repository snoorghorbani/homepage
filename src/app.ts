import * as T from 'three';
import { OrbitControls } from './js/controls/OrbitControls';
import { _text_animation } from './triangulate';
import { multi_prefab } from './multi-prefab';
import { create_menu } from './menu';
import { Helper } from './helper/index';
import { Curve } from './helper/curve';
import { circleWave } from './circle-wave';
import { Renderer } from './renderer';
import { morph_test } from './morph';
import './menu-app';
import { SolidWireframeMaterial } from './helper/wireframe';

declare const TWEEN: any;
declare const THREE: any;
declare const Power0: any;
declare const BAS: any;
// declare const OrbitControls: any;

const width = innerWidth;
const height = innerHeight;

const renderer = Renderer("mainCanvas", {
	width,
	height
});

class App {
	private readonly scene = new THREE.Scene();
	private readonly camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 10000);


	private brick: T.Mesh;
	private brickGeo: T.Geometry;
	private plate: T.Mesh;
	private controls: OrbitControls;



	constructor() {
		renderer.config({
			width,
			height,
			scene: this.scene,
			camera: this.camera
		});
		this.config_scene();
		this.setup_controls();
		// this.setup_helpers();
		this.setup_camera();
		this.create_objects();
		this.setup_lights();

		// var menu = create_menu(this.scene);

		//  morph_test(this.scene);
		circleWave(this.scene, {
			wavesAmount: 12,
			wavesHeight: 1,
			circlesAmount: 66,
			circlesSpacing: 2,
			lineWidth: 1,
			opacityCoeff: 0.4,
			color: '#fc1b6a',
			dev: true,
			radius: 4,
			colorCoeff: 1,
			tweenDelay: 1500,
			circleResolution: 360,
			gap: 9,
			z: true
		});
		// this.scene_text_to_shape();
		// this.scene_transform_prefabs();
		// this.scene_break_shape();
		// this.scene_multi_prefabs();

		// Curve(this.scene);

		// Helper.instansedPrefabs(this.scene);

		var geo = new THREE.BoxBufferGeometry(20, 20, 20);
		var _mat = SolidWireframeMaterial(geo);
		this.scene.add(new THREE.Mesh(geo, _mat));

		/**
		 * 
		 */
		this.animate();
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
		var brickGeo = (this.brickGeo = new THREE.SphereGeometry(20, 20, 20));
		var brick = new THREE.Mesh(brickGeo, new THREE.MeshNormalMaterial({ wireframe: true }));
		brick.position.set(222, 100, 100);
		var prefabs = new BAS.PrefabBufferGeometry(new THREE.TetrahedronGeometry(1.0), 10000);
		Helper.transform(this.scene, prefabs, brick, new THREE.SphereGeometry(200, 20, 20), {
			duration: 8.0,
			ease: Power0.easeIn,
			repeat: -1,
			repeatDelay: 0.25,
			yoyo: true
		});
	}

	private setup_helpers() {
		// var axes = new THREE.AxisHelper(50);
		// this.scene.add(axes);
		// var helper = new THREE.GridHelper(1000, 10);
		// helper.setColors(0x0000ff, 0x808080);
		// this.scene.add(helper);
	}

	private config_scene() {
		this.scene.background = new THREE.Color('#ffffff');
	}

	private setup_lights() {
		var light = new THREE.PointLight(0x00ffff, 100, 1000);
		light.position.set(0, 0, 300);
		light.castShadow = true;
		light.shadow.mapSize.width = 1024; // default is 512
		light.shadow.mapSize.height = 1024;
		this.scene.add(light);
	}

	private create_objects() {
		// var brickGeo = this.brickGeo = new THREE.SphereGeometry(20, 20, 20)
		// this.brick = new THREE.Mesh(brickGeo, new THREE.MeshNormalMaterial({ wireframe: false }));
		// this.brick.position.set(0, 0, 30);
		// this.brick.castShadow = true;
		// this.brick.receiveShadow = true;
		// this.scene.add(this.brick);
		// this.plate = new THREE.Mesh(new THREE.PlaneGeometry(200, 200, 20, 20));
		// this.plate.material = new THREE.MeshLambertMaterial({ color: 0xff00ff });
		// this.plate.castShadow = true;
		// this.plate.receiveShadow = true;
		// this.scene.add(this.plate);
	}

	private setup_camera() {
		this.camera.position.set(0, 0, 200);
		this.camera.lookAt(0, 0, 0);
		this.scene.add(this.camera);
	}

	private setup_controls() {
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
		// TWEEN.update();
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
		var tween = new TWEEN.Tween(from)
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
		var randVect = function (amount: any) {
			return new THREE.Vector3(Math.random() * amount, Math.random() * amount, Math.random() * amount);
		};

		// Create and randomly offset a triangle based on 3 original vertices
		var makeTri = function (geom: any, vertA: any, vertB: any, vertC: any, normal: any) {
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
