//  import * as T from 'three';
declare const PNLTRI: any
declare const Power1: any
declare const THREE: any;
declare const TimelineMax: any;
declare const TweenMax: any;
declare const BAS: any;


export const create_menu = function (scene: any) {
  var group = new THREE.Group();
  group.castShadow = true;
  group.receiveShadow = true;
  const gap = 5;
  const size = 10;
  var geometry = new THREE.BoxBufferGeometry(size, size, size);
  var material = new THREE.MeshLambertMaterial({ color: 0xffffff, wireframe: false });

  var cube = new THREE.Mesh(geometry, material);
  cube.position.set(0, 0, 0);
  debugger;
  cube.castShadow = true;
  cube.receiveShadow = true;

  var menuItem;
  for (let i = 0; i < 27; i++) {
    menuItem = cube.clone();
    menuItem.position.set(
      (i % 3) * (gap + size) - gap -10 ,
      Math.floor(i % 9 / 3) * (gap + size) - gap -10 ,
      Math.floor(i / 9) * (gap + size) - gap -10
    )
    console.log(menuItem.position)
    group.add(menuItem);
  }

  //   group.position.x=-10;
  // group.position.y=-10;
  // group.position.z=-10;
  // group.position.y=-20;
  // group.rotation.x = 45;
  // group.rotation.z = 45;
  // group.computeBoundingBox();

  scene.add(group);
  return group;
}