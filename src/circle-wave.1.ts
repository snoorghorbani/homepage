import { Utility } from './utility/index';
import { Helper } from './helper/index';
import { angle } from './utility/angle';
import { renderer } from './renderer';

declare const Power0: any;
declare const THREE: any;
declare const TweenMax: any;
declare const BAS: any;
declare const TWEEN: any;

interface IConfig {
	wavesAmount: number;
	wavesHeight: number;
	circlesAmount: number;
	circlesSpacing: number;
	lineWidth: number;
	opacityCoeff: number;
	color: string;
	dev: boolean;
	z: boolean;
	radius: number;
	colorCoeff: number;
	tweenDelay: number;
	circleResolution: number;
	gap: number;
}
var uniforms = {
	amplitude: { value: 5.0 },
	opacity: { value: 0.3 },
	color: { value: new THREE.Color(0xffffff) }
};
var shaderMaterial = new THREE.ShaderMaterial({
	uniforms: uniforms,
	vertexShader: document.getElementById('vertexshader').textContent,
	fragmentShader: document.getElementById('fragmentshader').textContent,
	blending: THREE.AdditiveBlending,
	depthTest: false,
	transparent: true
});
export const circleWave = function(scene, config: IConfig) {
	const count = 5;
	var _w = window.innerWidth;
	var _h = window.innerHeight;

	var mouseX = _w / 2,
		mouseY = _h / 2;
	var mouseAngle = Utility.angle.toRad(90);

	var tweenEasing = TWEEN.Easing.Circular.Out;

	var circleGeo = new THREE.BufferGeometry();
	var startpoints = Utility.geometry.randomPointsInObject(new THREE.SphereGeometry(20, 20, 20), count);

	var coordinates = [];
	startpoints.forEach((i) => {
		coordinates.push(i.x);
		coordinates.push(i.y);
		coordinates.push(i.z);
	});
	var vertexes = new Float32Array(coordinates);
	var vertexBufferAttribute = new THREE.Float32BufferAttribute(vertexes, 3);
	circleGeo.addAttribute('vposition', vertexBufferAttribute);
	// for (var i = 0; i < startpoints.length; i++) {
	// 	circleGeo.vertices.push(startpoints[i]);
	// }

	var colors = new THREE.Float32BufferAttribute(count * 3, 3);
	circleGeo.addAttribute('colors', colors);
	var color = new THREE.Color(0xffffff);
	for (var i = 0, l = colors.count; i < l; i++) {
		color.setHSL(i / l, 0.5, 0.5);
		color.toArray(colors.array, i * colors.itemSize);
	}

	// var _colors =[];
	// for (var i = 0; i < count; i++) {
	// 	_colors[i] = new THREE.Color(Math.random(), Math.random(), Math.random());
	// }
	// var colors = new Float32Array(_colors);
	// var colorsBufferAttribute = new THREE.Float32BufferAttribute(colors, 1);
	// circleGeo.addAttribute('colors', colorsBufferAttribute);
	// 	// circleGeo.colors[i] = new THREE.Color(Math.random(), Math.random(), Math.random());
	// 	circleGeo.colors[i] = new THREE.Color(Math.random(), Math.random(), Math.random());
	// 	// circleGeo.colors[i + 1] = circleGeo.colors[i];
	// }
	var circle = new THREE.Line(
		circleGeo,
		shaderMaterial
		// new THREE.LineBasicMaterial({
		// 	// color: config.color,
		// 	vertexColors: THREE.VertexColors,
		// 	linewidth: config.lineWidth,
		// 	transparent: true
		// })
	);

	function buildCircle() {
		scene.add(circle);
	}
	var positions;
	var points = [
		Utility.geometry.randomPointsInObject(new THREE.SphereGeometry(11, 11, 11), count),
		Utility.geometry.randomPointsInObject(new THREE.CubeGeometry(11, 11, 11), count),
		Utility.geometry.randomPointsInObject(new THREE.CylinderGeometry(11, 6, 22), count),
		Utility.geometry.randomPointsInObject(new THREE.TetrahedronGeometry(11), count)
	];
	function updatePoints() {
		debugger;
		// positions = new_positions = Utility.geometry.randomPointsInObject(geos[Math.floor(Utility.angle.toDeg(mouseAngle) / 90)], count);
		positions = points[Math.floor(Utility.angle.toDeg(mouseAngle) / 90)];
		circle.geometry.verticesNeedUpdate = true; // do not forget to mark this flag each time you want to update geometry
	}

	function startTweens() {
		for (let i = 0; i < positions.length; i++) {
			// if (
			// 	circle.geometry.vertices[i].x == positions[i].x &&
			// 	circle.geometry.vertices[i].y == positions[i].y &&
			// 	circle.geometry.vertices[i].z == positions[i].z
			// ) {
			// 	debugger;
			// } else {
			// 	new TWEEN.Tween(circle.geometry.vertices[i])
			// 		.to(
			// 			{
			// 				x: positions[i].x,
			// 				y: positions[i].y,
			// 				z: positions[i].z
			// 			},
			// 			config.tweenDelay
			// 		)
			// 		.easing(tweenEasing)
			// 		.start();
			// 	var colors = [ 0x0000ff, 0x00ffff, 0xff00ff, 0x00ff00 ];
			// 	// new TWEEN.Tween(circle.material.color)
			// 	// 	.to(new THREE.Color(colors[Math.floor(Utility.angle.toDeg(mouseAngle) / 90)]), config.tweenDelay)
			// 	// 	.easing(tweenEasing)
			// 	// 	.start();
			// }
		}
	}

	renderer.do(() => {
		var time = Date.now() * 0.001;
		circle.rotation.y = 0.25 * time;
		uniforms.amplitude.value = Math.sin(0.5 * time);
		uniforms.color.value.offsetHSL(0.0005, 0, 0);
		var attributes = circle.geometry.attributes;
		var array = attributes.vposition.array;
		for (var i = 0, l = array.length; i < l; i += 3) {
			array[i] += 0.3 * (0.5 - Math.random());
			array[i + 1] += 0.3 * (0.5 - Math.random());
			array[i + 2] += 0.3 * (0.5 - Math.random());
		}
		attributes.vposition.needsUpdate = true;
	});

	function loop() {
		updatePoints();
		TWEEN.update();

		requestAnimationFrame(loop);
	}

	document.body.onmousemove = function(event) {
		debugger;
		mouseAngle = Utility.angle.getAngle(event.pageX, event.pageY);
		startTweens();
	};

	buildCircle();
	loop();
};
