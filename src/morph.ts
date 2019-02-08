import { Utility } from './utility/index';
import { Helper } from './helper/index';
import { angle } from './utility/angle';

declare const Power0: any;
declare const THREE: any;
declare const TweenMax: any;
declare const BAS: any;
declare const TWEEN: any;

export const morph_test = (scene) => {
    var mouseAngle = 45;
    // create a cube
    var cubeGeometry = new THREE.CubeGeometry(25,25,25);
    var cubeMaterial = new THREE.MeshLambertMaterial({ morphTargets: true, color: 0xff0000 });

    // define morphtargets, we'll use the vertices from these geometries
    var cubeTarget1 = new THREE.CubeGeometry(69, 10, 50);
    var cubeTarget2 = new THREE.CubeGeometry(82, 22, 8);

    // define morphtargets and compute the morphnormal
    cubeGeometry.morphTargets[0] = { name: 't1', vertices: cubeTarget2.vertices };
    cubeGeometry.morphTargets[1] = { name: 't2', vertices: cubeTarget1.vertices };
    cubeGeometry.computeMorphNormals();

    var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);

    // position the cube
    cube.position.x = 0;
    cube.position.y = 3;
    cube.position.z = 0;

    // add the cube to the scene
    scene.add(cube);

    var ambientLight = new THREE.AmbientLight(0x0c0c0c);
    scene.add(ambientLight);

    var spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(-25, 25, 15);

    scene.add(spotLight);


    // var influence1 = 0.01;
    // var influence2 = 0.01;
    // var controls = new function () {

    //     this.update = function () {
    //         cube.morphTargetInfluences[0] = controls.influence1;
    //         cube.morphTargetInfluences[1] = controls.influence2;
    //     };
    // }


    render();

    function render() {
        requestAnimationFrame(render);
        TWEEN.update();
    }

    function startTweens(mouseAngle:number) {
        // cube.morphTargetInfluences[0] =1
        new TWEEN.Tween(cube.morphTargetInfluences)
            .to({0:1}, 1555)
            .onUpdate(i=>{
                // debugger;
                console.log(i)
                // cube.morphTargetInfluences[0] = i;
            })
            // .easing(tweenEasing)
            .start();
    }

    document.body.onmousemove = function (event) {
        debugger;
        mouseAngle = Utility.angle.getAngle(event.pageX, event.pageY);
        startTweens(mouseAngle);
    };

}
