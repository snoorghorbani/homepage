import { Utility } from "../utility/index";
import { StateHandler } from "../module/state";

declare const THREE: any;
declare const TWEEN: any;

let camera, scene;
const bgs = []
const gap = 100;

const set = function (_scene: any, _camera: any) {
  scene = _scene;
  camera = _camera;
}

const add = function (id: string, color: string | number, depth: number) {
  var openBoxDim = Utility.position.fullwidthInDistance(camera, camera.position.z + depth);

  var geo = new THREE.CubeGeometry(openBoxDim.width, openBoxDim.height, 0);
  var bg = new THREE.Mesh(
    geo,
    new THREE.MeshBasicMaterial({
      color: color,
      wireframe: false,
      transparent: true,
      opacity: 1
    })
  );
   bg.position.z = -depth;
  // bg.position.x = find_position(xIndex, yIndex, depth).x;
  // bg.position.y = find_position(xIndex, yIndex, depth).y;
   bg.name = id;
  // bg._coordinate = { x: xIndex, y: yIndex };
  // bg._depth = depth;

  bgs.push(bg);
  // scene.add(bg);
  return bg;
}

const find_position = function (xIndex, yIndex, depth) {
  var openBoxDim = Utility.position.fullwidthInDistance(camera, camera.position.z + depth);
  return {
    x: xIndex * (openBoxDim.width + gap),
    y: yIndex * (openBoxDim.height + gap)
  }
}

const focus_on = function (id: string) {
  var c = bgs.filter(bg => bg.name == id)[0]._coordinate;
  bgs.forEach(bg => {
    var newPosition = find_position(
      bg._coordinate.x - c.x,
      bg._coordinate.y - c.y,
      bg._depth
    );

    new TWEEN.Tween(bg.position)
      .to(newPosition, 1111)
      .easing(TWEEN.Easing.Circular.Out)
      .start();
  })
}

// StateHandler.on('About Me', () => {
//   focus_on("About Me");
// });

export const backgroundHelper = {
  set,
  add
}