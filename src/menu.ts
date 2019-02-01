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

  const gap = 10;
  const size = 20;
  var geometry = new THREE.BoxBufferGeometry(size, size, size);
  var material = new THREE.MeshLambertMaterial({ color: 0x00ff00, wireframe: false });

  var cube = new THREE.Mesh(geometry, material);
  cube.position.set(0, 0, 0);
  cube.castShadow = true;
  cube.receiveShadow = true;

  var menuItem;
  for (let i = 0; i < 27; i++) {
    menuItem = cube.clone();
    menuItem.position.set(
      (i % 3) * (gap + size) - gap,
      Math.floor(i % 9 / 3) * (gap + size) - gap,
      Math.floor(i / 9) * (gap + size) - gap
    )
    console.log(menuItem.position)
    group.add(menuItem);
  }

  scene.add(group);
}