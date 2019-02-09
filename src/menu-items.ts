//  import * as T from 'three';
declare const PNLTRI: any
declare const Power1: any
declare const THREE: any;
declare const TWEEN: any;
declare const TimelineMax: any;
declare const TweenMax: any;
declare const BAS: any;

let scene;
let menuItems = [];


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
    anchor: { x: 0.5, y: 0.5, z: 0.0 }
  }
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

const create_menu_item = function ({ title, font }) {
  const index = menuItems.length;
  var menuItem = new THREE.Group();

  // var boxGeo = new THREE.CubeGeometry(200, 30, 0);
  // var box = new THREE.Mesh(boxGeo, new THREE.MeshBasicMaterial({ color: 0x33ff00, wireframe: false }));
  // box.position.z = -30;
  // menuItem.add(box)

  var titleGeo = generateTextGeometry(title, font);
  var title = new THREE.Mesh(titleGeo, new THREE.MeshBasicMaterial({ color: 0x333333 }));
  menuItem.add(title)

  menuItem.position.y = (index * -40) + 50;
  menuItems.push(menuItem);


  scene.add(menuItem);
}

export const create_menu_items = function (_scene: any) {
  scene = _scene;
  var loader = new THREE.FontLoader();
  loader.load('./node_modules/three/examples/fonts/helvetiker_bold.typeface.json', function (font) {
    create_menu_item({
      title: "Hello, Word",
      font,
    });
    create_menu_item({
      title: "About Me",
      font,
    });
    create_menu_item({
      title: "My Experiences",
      font,
    });
  });

  return {
  }
}