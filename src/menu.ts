//  import * as T from 'three';
declare const PNLTRI: any
declare const Power1: any
declare const THREE: any;
declare const TWEEN: any;
declare const TimelineMax: any;
declare const TweenMax: any;
declare const BAS: any;


let isInOpenMode = false;

export const create_menu = function (scene: any) {
  var group = new THREE.Group();
  group.castShadow = true;
  group.receiveShadow = true;
  group.rotation.x = 0;
  group.rotation.y = Math.PI / 4;
  group.rotation.z = 0;

  const gap = 5;
  const size = 10;
  var geometry = new THREE.CubeGeometry(size, size, size);
  var hiddenGeometry = new THREE.CubeGeometry(0.1, 0.1, 0.1);
  geometry.morphTargets[0] = { name: 't1', vertices: hiddenGeometry.vertices };
  geometry.computeMorphNormals();

  var material = new THREE.MeshNormalMaterial({ morphTargets: true, color: 0xffffff, wireframe: false });

  var cube = new THREE.Mesh(geometry, material);
  cube.position.set(0, 0, 0);

  cube.castShadow = true;
  cube.receiveShadow = true;

  var menuItems = [];
  // var menuItem;
  for (let i = 0; i < 27; i++) {
    var menuItem = cube.clone();
    // menuItem.geometry = geometry.clone();
    var pos = getClosePosition(i)
    menuItem.position.set(pos.x, pos.y, pos.z)
    menuItems.push(menuItem);
    group.add(menuItem);
    // scene.add(menuItem);
  }

  scene.add(group);

  var axesHelper = new THREE.AxesHelper(55);
  group.add(axesHelper);

  render();

  function render() {
    requestAnimationFrame(render);
    if (!isInOpenMode) {
      // group.rotation.y += .03;
      group.rotation.y = group.rotation.y % Math.PI;
    }
    TWEEN.update();
  }

  function getOpenPosition(i: number) {
    i = i % 25;
    return {
      x: (i % 5) * (gap + size) - gap - 25,
      y: Math.floor(i / 5) * (gap + size) - gap - 25,
      z: 0
    }
  }
  function getHoverPosition(i: number) {
    return {
      x: (i % 3) * (gap + size) - gap - 10,
      y: Math.floor(i % 9 / 3) * (gap + size) - gap - 10,
      z: Math.floor(i / 9) * (gap + size) - gap - 10
    }
  }
  function getClosePosition(i: number) {
    return {
      x: (i % 3) * (size) - 10,
      y: Math.floor(i % 9 / 3) * (gap + size) - gap - 10,
      z: Math.floor(i / 9) * (size) - 10
    }
  }

  function open() {
    isInOpenMode = true;
    menuItems.forEach((cube, idx) => {
      new TWEEN.Tween(cube.position)
        .to(getOpenPosition(idx), 999)
        .easing(TWEEN.Easing.Circular.Out)
        .start();
    })
    new TWEEN.Tween(group.rotation)
      .to({ y: 0.0, x: 0.0, z: 0 }, 2222)
      .easing(TWEEN.Easing.Circular.Out)
      .start();
  }

  function hover() {
    menuItems.forEach((cube, idx) => {
      new TWEEN.Tween(cube.position)
        .to(getHoverPosition(idx), 666)
        .easing(TWEEN.Easing.Circular.Out)
        .start();
    })
    new TWEEN.Tween(group.rotation)
      .to({ y: -Math.PI / 4, x: Math.PI / 4, z: 0 }, 2222)
      .easing(TWEEN.Easing.Circular.Out)
      .start();
  }

  function close() {
    isInOpenMode = false;
    menuItems.forEach((cube, idx) => {
      new TWEEN.Tween(cube.position)
        .to(getClosePosition(idx), 999)
        .easing(TWEEN.Easing.Circular.Out)
        .start();
    })
    new TWEEN.Tween(group.rotation)
      .to({ y: Math.PI / 4, x: 0.0, z: 0 }, 2222)
      .easing(TWEEN.Easing.Circular.Out)
      .start();
  }
  function toggle() {
    if (isInOpenMode)
      close()
    else
      open()
  }
  function relax() {
    if (isInOpenMode)
      open();
    else
      close();
  }

  return {
    open,
    close,
    hover,
    relax,
    toggle
  };
}