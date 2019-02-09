import { Utility } from './utility/index';
import { Helper } from './helper/index';

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

export const circleWave = function (scene, config: IConfig) {
	var _w = window.innerWidth;
	var _h = window.innerHeight;

	var mouseX = _w / 2,
		mouseY = _h / 2;
	var mouseAngle = Utility.angle.toRad(90);

	var circle = new THREE.Line(
		new THREE.Geometry(),
		new THREE.LineBasicMaterial({
			color: config.color,
			linewidth: config.lineWidth,
			transparent: true
		})
	);
	var new_positions = [];
	var circles = [];

	var waveAngle = Utility.angle.toRad(40);
	var smoothingCoeff = 0.5;
	var tweenEasing = TWEEN.Easing.Circular.Out;

	function buildCircle() {
		for (var i = 0; i <= config.circleResolution; i++) {
			var angle = Utility.angle.toRad(i);
			var x = config.radius * Math.cos(angle);
			var y = config.radius * Math.sin(angle);
			var z = 0;
			circle.geometry.vertices.push(new THREE.Vector3(x, y, z));
		}
		scene.add(circle);
	}

	function updatePoints() {
		new_positions = [];
		var newpoints = Utility.geometry.randomPointsInObject(new THREE.SphereGeometry(20, 20, 20), 30);
		for (var i = 0; i <= config.circleResolution; i++) {
			var angle = Utility.angle.toRad(i);
			var radiusAddon = 0;
			var smooth_pct = 1;

			// Fix the end of circle
			if (
				// < 0
				mouseAngle - waveAngle < 0 &&
				angle > mouseAngle - waveAngle + 2 * Math.PI
			) {
				angle = angle - Math.PI * 2;
			} else if (
				// > 360
				mouseAngle + waveAngle > 2 * Math.PI &&
				angle < mouseAngle + waveAngle - 2 * Math.PI
			) {
				angle = angle + Math.PI * 2;
			}
			// Waves
			if (angle >= mouseAngle - waveAngle && angle <= mouseAngle + waveAngle) {
				// Smooth edges
				if (angle >= mouseAngle - waveAngle && angle <= mouseAngle - waveAngle + waveAngle * smoothingCoeff) {
					smooth_pct =
						1 -
						(angle - (mouseAngle - waveAngle * smoothingCoeff)) /
						(mouseAngle - waveAngle - (mouseAngle - waveAngle * smoothingCoeff));
				} else if (
					angle >= mouseAngle + waveAngle - waveAngle * smoothingCoeff &&
					angle <= mouseAngle + waveAngle
				) {
					smooth_pct =
						1 -
						(angle - (mouseAngle + waveAngle - waveAngle * smoothingCoeff)) /
						(mouseAngle + waveAngle - (mouseAngle + waveAngle - waveAngle * smoothingCoeff));
				}

				radiusAddon =
					smooth_pct *
					Math.sin((angle - mouseAngle) * config.wavesAmount) *
					config.wavesHeight /
					((angle - mouseAngle) * config.wavesAmount);
			}

			var x = (config.radius + radiusAddon) * Math.cos(angle);
			var y = (config.radius + radiusAddon) * Math.sin(angle);
			var z = 0;
			if (config.z) z = (config.radius + radiusAddon) * Math.sin(angle) * Math.cos(angle);


			new_positions.push(new THREE.Vector3(x, y, z));
		}
		circle.geometry.verticesNeedUpdate = true; // do not forget to mark this flag each time you want to update geometry
	}

	function startTweens() {
		// Prevent tween delay at the end of the circle
		var startingLoop = Math.round(Utility.angle.toDeg(mouseAngle)) - 40;
		if (startingLoop < 0) {
			startingLoop = startingLoop + config.circleResolution;
		} else if (startingLoop > config.circleResolution) {
			startingLoop = startingLoop - config.circleResolution;
		}

		// Loop twice so we dont get delay from 0 to 360;
		for (var i = 0; i <= config.circleResolution; i++) {
			var ii = (i + startingLoop) % (config.circleResolution + 1);
			if (
				circle.geometry.vertices[ii].x != new_positions[ii].x &&
				circle.geometry.vertices[ii].y != new_positions[ii].y
			) {
				new TWEEN.Tween(circle.geometry.vertices[ii])
					.to(
						{
							x: new_positions[ii].x,
							y: new_positions[ii].y,
							z: new_positions[ii].z
						},
						config.tweenDelay
					)
					.easing(tweenEasing)
					.start();
			}
		}
	}

	function cloneCircle() {
		for (var i = 1; i <= config.circlesAmount; i++) {
			var circleClone = new THREE.Line(circle.geometry, circle.material.clone());
			var direction = 1;
			if (i % 2) {
				direction = -1;
			}
			var ii = Math.ceil(i / config.gap);
			circleClone.rotation.z = direction * ii * config.circlesSpacing * Math.PI / 180;
			circleClone.material.opacity = 1 / ii + config.opacityCoeff;
			circles.push(circleClone);
			scene.add(circleClone);
		}
	}

	function setCirclesMaterial(index, val) {
		for (var i = 1; i <= config.circlesAmount; i++) {
			var circle = circles[i - 1];
			var ii = Math.ceil(i / 2);
			if (index == 'color') {
				var percent = ii / config.circlesAmount * config.colorCoeff;
				var value = Utility.color.ColorLuminance(val, percent);
				value = value.replace('#', '0x');
				circle.material[index].setHex(value);
			} else if (index == 'opacity') {
				circle.material[index] = 1 / ii + val;
			} else {
				circle.material[index] = val;
			}
		}
	}

	function removeCircles() {
		circles.forEach(function (circle) {
			scene.remove(circle);
		});
		circles = [];
	}

	function loop() {
		updatePoints();
		TWEEN.update();

		requestAnimationFrame(loop);
	}

	document.body.addEventListener("mousemove", function (event) {
		mouseAngle = Utility.angle.getAngle(event.pageX, event.pageY);
		startTweens();
	});

	buildCircle();
	loop();
	cloneCircle();
};
