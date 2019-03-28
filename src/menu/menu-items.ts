import { StateHandler } from '../module/state';
import { Interaction } from '../module/interaction';
import { Utility } from '../utility/index';
import { Camera } from '../module/camera';
import { colors } from '../colors';

const interaction = new Interaction();

declare const THREE: any;
declare const TWEEN: any;

let scene, camera;
let menuItems = [];
let clickableItems = [];

export const create_menu_items = function (_scene: any, _camera: any) {
	scene = _scene;
	camera = _camera;
	var loader = new THREE.FontLoader();
	loader.load('./node_modules/three/examples/fonts/helvetiker_bold.typeface.json', function (font) {
		create_menu_item({
			id: 'Hello, Word',
			title: 'Hello',
			font,
			color: 0x275c6b
		});
		create_menu_item({
			id: 'About Me',
			title: 'We Are',
			font,
			color: 0xaca53b
		});
		// create_menu_item({
		// 	title: 'My Experiences',
		// 	font,
		// 	color: 0x669a35
		// });
		create_menu_item({
			id: 'We Know',
			title: 'We Know',
			font,
			color: 0x669a35
		});
	});
};
export const open = function () {
	/** move camera */
	Camera.save_position();
	Camera.move_far_right(222, 300);

	/** show items */
	for (let i = 0; i < menuItems.length; i++) {
		const item = menuItems[i];
		new TWEEN.Tween(item.position)
			.to({ y: getOpenedMenuItemPosition(i) }, 1111)
			.easing(TWEEN.Easing.Circular.Out)
			.start();

		for (let j = 0; j < item.children.length; j++) {
			const obj = item.children[j];
			if (obj.morphTargetInfluences)
				new TWEEN.Tween(obj.morphTargetInfluences)
					.to({ 0: 1, 1: 0 }, 1111)
					.easing(TWEEN.Easing.Circular.Out)
					.start();
		}
	}
	showClickableObjects();
};
export const close = function () {
	Camera.move_to_last_saved();
	for (let i = 0; i < menuItems.length; i++) {
		const item = menuItems[i];
		for (let j = 0; j < item.children.length; j++) {
			const obj = item.children[j];
			if (obj.morphTargetInfluences)
				new TWEEN.Tween(obj.morphTargetInfluences)
					.to({ 0: 0, 1: 0 }, 1111)
					.easing(TWEEN.Easing.Circular.Out)
					.start();
		}
	}
	hiddenClickableObjects();
};
export const maximize_item = function (name: string) {
	// StateHandler.goto("close_menu");
	hiddenClickableObjects();
	for (let i = 0; i < menuItems.length; i++) {
		const item = menuItems[i];
		if (item.name == name) {
			new TWEEN.Tween(item.position).to({ y: 0 }, 1111).easing(TWEEN.Easing.Circular.Out).start();

			for (let j = 0; j < item.children.length; j++) {
				const obj = item.children[j];
				if (obj.morphTargetInfluences)
					new TWEEN.Tween(obj.morphTargetInfluences)
						.to({ 1: 1 }, 1111)
						.easing(TWEEN.Easing.Circular.Out)
						.start();
			}
		}
		for (let j = 0; j < item.children.length; j++) {
			const obj = item.children[j];
			if (obj.morphTargetInfluences)
				new TWEEN.Tween(obj.morphTargetInfluences).to({ 0: 0 }, 1111).easing(TWEEN.Easing.Circular.Out).start();
		}
	}
};

function getVerticesFromCenter(_geometry) {
	var geometry = _geometry.clone();
	var center = getCenterPoint(geometry);
	geometry.vertices.forEach((v) => {
		v.x = center.x;
		v.y = center.y;
		v.z = center.z;
		// v.x = 100 * Math.random();
		// v.y = 100 * Math.random();
		// v.z = 100 * Math.random() - 200;
	});
	geometry.verticesNeedUpdate = true;
	return geometry;
}
function getCenterPoint(geometry) {
	var middle = new THREE.Vector3();
	geometry.computeBoundingBox();

	middle.x = (geometry.boundingBox.max.x + geometry.boundingBox.min.x) / 2;
	middle.y = (geometry.boundingBox.max.y + geometry.boundingBox.min.y) / 2;
	middle.z = (geometry.boundingBox.max.z + geometry.boundingBox.min.z) / 2;

	return middle;
}
function hiddenClickableObjects() {
	clickableItems.forEach((i) => (i.visible = false));
}
function showClickableObjects() {
	clickableItems.forEach((i) => (i.visible = true));
}
function generateTextGeometry(text: string, font: any) {
	var params = {
		size: 14,
		height: 0,
		font: font,
		weight: 'bold',
		style: 'normal',
		curveSegments: 0,
		bevelSize: 0,
		bevelThickness: 0,
		bevelEnabled: true,
		// anchor: { x: 0.5, y: 0.5, z: 0.0 }
		anchor: { x: 0, y: 0, z: 0.0 }
	};
	var geometry = new THREE.TextGeometry(text, params);
	// var geometry =  new THREE.IcosahedronGeometry(20);

	geometry.computeBoundingBox();

	var size = new THREE.Vector3();
	geometry.boundingBox.getSize(size);
	var anchorX = size.x * -params.anchor.x;
	var anchorY = size.y * -params.anchor.y;
	var anchorZ = size.z * -params.anchor.z;
	var matrix = new THREE.Matrix4().makeTranslation(anchorX, anchorY, anchorZ);

	geometry.applyMatrix(matrix);

	return geometry;
}
function create_menu_item({ title, id, font, color }) {
	const index = menuItems.length;
	var menuItem = new THREE.Group();
	menuItem.name = id;
	menuItem._type = 'menuItem';
	menuItem.position.x = 444;

	/**
   * title
   */
	var titleGeoOpen = generateTextGeometry(title, font);
	var titleGeoClose = getVerticesFromCenter(titleGeoOpen);
	titleGeoClose.morphTargets[0] = { name: 'open', vertices: titleGeoOpen.vertices };
	titleGeoClose.computeMorphNormals();
	var id = new THREE.Mesh(titleGeoClose, new THREE.MeshBasicMaterial({ color: colors.menuItems, morphTargets: true }));
	id.morphTargetInfluences[0] = 0;
	menuItem.add(id);

	/**
   * box
   */
	// var openBoxDim = Utility.position.fullwidthInDistance(camera, camera.position.z + 30);
	// var boxGeoOpen = new THREE.CubeGeometry(
	// 	Math.abs(titleGeoOpen.boundingBox.min.x) + Math.abs(titleGeoOpen.boundingBox.max.x) + 30,
	// 	20,
	// 	0
	// );
	// var boxGeoClose = new THREE.CubeGeometry(0.001, 0, 0);
	// var boxGeoMax = new THREE.CubeGeometry(openBoxDim.width, openBoxDim.height, 0);
	// boxGeoClose.morphTargets[0] = { name: 'open', vertices: boxGeoOpen.vertices };
	// boxGeoClose.morphTargets[1] = { name: 'max', vertices: boxGeoMax.vertices };
	// boxGeoClose.computeMorphNormals();
	// var box = new THREE.Mesh(
	// 	boxGeoClose,
	// 	new THREE.MeshBasicMaterial({
	// 		color: color,
	// 		wireframe: false,
	// 		transparent: true,
	// 		opacity: 1,
	// 		morphTargets: true
	// 	})
	// );
	// // var box = new THREE.Mesh(boxGeoClose, new THREE.MeshBasicMaterial({ color: Utility.color.random(), wireframe: false, transparent: true, opacity: 1, morphTargets: true }));
	// box.morphTargetInfluences[0] = 0;
	// box.position.z = -30;
	// menuItem.add(box);

	/**
   * clickable
   */
	var clickableGeo = new THREE.CubeGeometry(200, 30, 0);
	var clickable = new THREE.Mesh(
		clickableGeo,
		new THREE.MeshBasicMaterial({
			color: 0x00ff00,
			wireframe: false,
			transparent: true,
			opacity: 0,
			morphTargets: false
		})
	);
	clickable.position.z = -30;
	clickable.visible = false;
	clickable.onClick = function () {
		StateHandler.goto(clickable.parent.name);
	};
	interaction.onClick(clickable);
	clickable.onMousemove = function () {
		StateHandler.goto("bold_cursor");
	};
	interaction.onMousemove(clickable);
	clickableItems.push(clickable);
	menuItem.add(clickable);

	menuItem.position.y = getOpenedMenuItemPosition(index);
	menuItems.push(menuItem);

	scene.add(menuItem);
}
function getOpenedMenuItemPosition(i: number) {
	return i * -40 + 50;
}

// StateHandler.on('open_menu', open);
// StateHandler.on('close_menu', close);
// StateHandler.on('About Me', () => {
// 	maximize_item('About Me');
// });
// StateHandler.on('Hello, Word', () => {
// 	maximize_item('Hello, Word');
// });
// StateHandler.on('My Experiences', () => {
// 	maximize_item('My Experiences');
// });
