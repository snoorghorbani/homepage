import { Utility } from './utility/index';
import { Helper } from './helper/index';
import { angle } from './utility/angle';

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

export const circleWave = function(scene, config: IConfig) {
	var _w = window.innerWidth;
	var _h = window.innerHeight;

	var mouseX = _w / 2,
		mouseY = _h / 2;
	var mouseAngle = Utility.angle.toRad(90);

	var tweenEasing = TWEEN.Easing.Circular.Out;

	var circleGeo = new THREE.Geometry();
	var startpoints = Utility.geometry.randomPointsInObject(new THREE.SphereGeometry(20, 20, 20), 3000);
	for (var i = 0; i < startpoints.length; i++) {
		circleGeo.vertices.push(startpoints[i]);
	}
	for (var i = 0; i < circleGeo.vertices.length; i += 1) {
		// circleGeo.colors[i] = new THREE.Color(Math.random(), Math.random(), Math.random());
		circleGeo.colors[i] = new THREE.Color(Math.random(), Math.random(), Math.random());
		// circleGeo.colors[i + 1] = circleGeo.colors[i];
	}
	var circle = new THREE.Line(
		circleGeo,
		new THREE.LineBasicMaterial({
			// color: config.color,
			vertexColors:  THREE.VertexColors,
			linewidth: config.lineWidth,
			transparent: true
		})
	);

	function buildCircle() {
		scene.add(circle);
	}
	var positions;
	var points = [
		Utility.geometry.randomPointsInObject(new THREE.SphereGeometry(11, 11, 11), 3000),
		Utility.geometry.randomPointsInObject(new THREE.CubeGeometry(11, 11, 11), 3000),
		Utility.geometry.randomPointsInObject(new THREE.CylinderGeometry(11, 6, 22), 3000),
		Utility.geometry.randomPointsInObject(new THREE.TetrahedronGeometry(11), 3000)
	];
	function updatePoints() {
		debugger;
		// positions = new_positions = Utility.geometry.randomPointsInObject(geos[Math.floor(Utility.angle.toDeg(mouseAngle) / 90)], 3000);
		positions = points[Math.floor(Utility.angle.toDeg(mouseAngle) / 90)];
		circle.geometry.verticesNeedUpdate = true; // do not forget to mark this flag each time you want to update geometry
	}

	function startTweens() {
		for (let i = 0; i < positions.length; i++) {
			if (
				circle.geometry.vertices[i].x == positions[i].x &&
				circle.geometry.vertices[i].y == positions[i].y &&
				circle.geometry.vertices[i].z == positions[i].z
			) {
				debugger;
			} else {
				new TWEEN.Tween(circle.geometry.vertices[i])
					.to(
						{
							x: positions[i].x,
							y: positions[i].y,
							z: positions[i].z
						},
						config.tweenDelay
					)
					.easing(tweenEasing)
					.start();
				var colors = [ 0x0000ff, 0x00ffff, 0xff00ff, 0x00ff00 ];

				// new TWEEN.Tween(circle.material.color)
				// 	.to(new THREE.Color(colors[Math.floor(Utility.angle.toDeg(mouseAngle) / 90)]), config.tweenDelay)
				// 	.easing(tweenEasing)
				// 	.start();
			}
		}
	}

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
