declare const Power0: any;
declare const THREE: any;
declare const TweenMax: any;
declare const BAS: any;
declare const TWEEN: any;

export const circleWave = function (scene) {

    var config = {
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
    };
    // Stats
    // var stats = new Stats();
    // stats.setMode(0); // 0: fps, 1: ms, 2: mb

    // // align top-left
    // stats.domElement.style.position = 'absolute';
    // stats.domElement.style.left = '0px';
    // stats.domElement.style.top = '0px';
    // document.body.appendChild( stats.domElement );

    var _w = window.innerWidth;
    var _h = window.innerHeight;

    var mouseX = _w / 2, mouseY = _h / 2;
    var mouseAngle = toRad(90);

    var circleResolution = 360;
    var circle = new THREE.Line(new THREE.Geometry(), new THREE.LineBasicMaterial({
        color: config.color,
        linewidth: config.lineWidth,
        transparent: true,
    }));
    var new_positions = [];
    var circles = [];

    var waveAngle = toRad(40);
    var smoothingCoeff = 0.5;
    var tweenEasing = TWEEN.Easing.Circular.Out;

    function buildCircle() {
        for (var i = 0; i <= circleResolution; i++) {
            var angle = toRad(i);
            var x = (config.radius) * Math.cos(angle);
            var y = (config.radius) * Math.sin(angle);
            var z = 0;
            circle.geometry.vertices.push(new THREE.Vector3(x, y, z));
        }
        scene.add(circle);
    }

    function updatePoints() {
        new_positions = [];
        for (var i = 0; i <= circleResolution; i++) {
            var angle = toRad(i);
            var radiusAddon = 0;
            var smooth_pct = 1;

            // Fix the end of circle
            if ( // < 0
                ((mouseAngle - waveAngle) < 0) && (angle > (mouseAngle - waveAngle) + 2 * Math.PI)
            ) {
                angle = angle - Math.PI * 2;
            } else if ( // > 360
                ((mouseAngle + waveAngle) > 2 * Math.PI) && (angle < (mouseAngle + waveAngle) - 2 * Math.PI)
            ) {
                angle = angle + Math.PI * 2;
            }
            // Waves
            if (
                (angle >= (mouseAngle - waveAngle) && angle <= (mouseAngle + waveAngle))
            ) {

                // Smooth edges
                if (angle >= (mouseAngle - waveAngle) && angle <= ((mouseAngle - waveAngle + waveAngle * smoothingCoeff))) {
                    smooth_pct = 1 - (
                        (angle - (mouseAngle - waveAngle * smoothingCoeff)) /
                        ((mouseAngle - waveAngle) - (mouseAngle - waveAngle * smoothingCoeff))
                    );
                } else if ((angle >= ((mouseAngle + waveAngle - (waveAngle * smoothingCoeff)))) && (angle <= (mouseAngle + waveAngle))) {
                    smooth_pct = 1 - (
                        (angle - (mouseAngle + waveAngle - (waveAngle * smoothingCoeff))) /
                        ((mouseAngle + waveAngle) - (mouseAngle + waveAngle - (waveAngle * smoothingCoeff)))
                    );
                }

                radiusAddon =
                    (smooth_pct * Math.sin((angle - mouseAngle) * config.wavesAmount)) * config.wavesHeight /
                    ((angle - mouseAngle) * config.wavesAmount)
                    ;
            }

            var x = (config.radius + radiusAddon) * Math.cos(angle);
            var y = (config.radius + radiusAddon) * Math.sin(angle);

            new_positions.push(new THREE.Vector3(x, y, 0));

        }
        circle.geometry.verticesNeedUpdate = true; // do not forget to mark this flag each time you want to update geometry
    }

    function startTweens() {
        // Prevent tween delay at the end of the circle
        var startingLoop = Math.round(toDeg(mouseAngle)) - 40;
        if (startingLoop < 0) {
            startingLoop = startingLoop + circleResolution;
        } else if (startingLoop > circleResolution) {
            startingLoop = startingLoop - circleResolution;
        }

        // Loop twice so we dont get delay from 0 to 360;
        for (var i = 0; i <= circleResolution; i++) {
            var ii = (i + startingLoop) % (circleResolution + 1);
            if (circle.geometry.vertices[ii].x != new_positions[ii].x && circle.geometry.vertices[ii].y != new_positions[ii].y) {
                new TWEEN.Tween(circle.geometry.vertices[ii]).to({
                    x: new_positions[ii].x,
                    y: new_positions[ii].y,
                    z: new_positions[ii].z
                }, config.tweenDelay)
                    .easing(tweenEasing).start();
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
            var ii = Math.ceil(i / 2);
            circleClone.rotation.z = direction * ii * config.circlesSpacing * Math.PI / 180;
            circleClone.material.opacity = 1 / ii + config.opacityCoeff;
            circles.push(circleClone);
            scene.add(circleClone);
        }
    }

    function setCirclesMaterial(index, val) {
        for (var i = 1; i <= config.circlesAmount; i++) {
            var circle = circles[(i - 1)];
            var ii = Math.ceil(i / 2);
            if (index == 'color') {
                var percent = ii / config.circlesAmount * config.colorCoeff;
                var value = ColorLuminance(val, percent);
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
        //   stats.begin();

        updatePoints();
        TWEEN.update();

        requestAnimationFrame(loop);
    }

    document.body.onmousemove = function (event) {
        debugger;
        mouseX = event.pageX - _w / 2;
        mouseY = - (event.pageY - _h / 2);
        mouseAngle = Math.atan2(mouseY, mouseX);
        if (mouseAngle < 0) {
            mouseAngle = 2 * Math.PI - (- mouseAngle);
        }
        startTweens();
    };

    // Helpers
    function toDeg(val) {
        return val * (180 / Math.PI);
    }

    function toRad(val) {
        return val * (Math.PI / 180);
    }

    // http://www.sitepoint.com/javascript-generate-lighter-darker-color/
    function ColorLuminance(hex, lum) {
        // validate hex string
        hex = String(hex).replace(/[^0-9a-f]/gi, '');
        if (hex.length < 6) {
            hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
        }
        lum = lum || 0;

        // convert to decimal and change luminosity
        var rgb = '#', c, i;
        for (i = 0; i < 3; i++) {
            c = parseInt(hex.substr(i * 2, 2), 16);
            c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
            rgb += ('00' + c).substr(c.length);
        }

        return rgb;
    }

    buildCircle();
    loop();
    cloneCircle();
}