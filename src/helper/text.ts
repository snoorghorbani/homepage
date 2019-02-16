import { geometry } from "../utility/geometry";

// import * as T from 'three';
// import * as BAS from '../node_modules/three-bas/dist/bas.module';
// import { TimelineMax } from "gsap/TimelineMax";

declare const THREE: any;

export const textHelper = function (parent, text) {

  var loader = new THREE.FontLoader();
  loader.load('./node_modules/three/examples/fonts/helvetiker_bold.typeface.json', function (font) {
    var geometry = new THREE.TextGeometry(text, {
      size: 22,
      height: 2,
      font: font,
      weight: 'bold',
      style: 'normal',
      // curveSegments:24,
      // bevelSize:2,
      // bevelThickness:2,
      // bevelEnabled:true,
      anchor: { x: 0.5, y: 0.5, z: 0.0 }
    });
    geometry.computeBoundingBox();

    var textMesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color: 0x000000 }))

    parent.add(textMesh)
  });
}