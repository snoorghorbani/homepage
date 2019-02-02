// import * as THREE from 'three';
// import * as BAS from '../node_modules/three-bas/dist/bas.module';
// import { TimelineMax } from "gsap/TimelineMax";

declare const PNLTRI: any
declare const Power0: any
declare const Power1: any
declare const THREE: any;
declare const TimelineMax: any;
declare const TweenMax: any;
declare const BAS: any;


export function instansedPrefabs(scene) {
  var light = new THREE.DirectionalLight(0xff00ff);
  scene.add(light);

  light = new THREE.DirectionalLight(0x00ffff);
  light.position.y = -1;
  scene.add(light);

  // Animation extends THREE.Mesh
  var animation = new Animation();
  animation.animate(8.0, { ease: Power0.easeIn, repeat: 0, repeatDelay: 0.25, yoyo: true });
  scene.add(animation);
}


////////////////////
// CLASSES
////////////////////

function Animation() {
  const startPositionGeometry = new THREE.TorusKnotGeometry(100, 50, 128, 32, 1, 2)
  const endPositionGeometry = new THREE.TorusKnotGeometry(100, 50, 128, 32, 1, 8)

  const prefab = new THREE.TorusKnotBufferGeometry(4, 0.5);
  const prefabCount = startPositionGeometry.vertices.length;
  const geometry = new BAS.InstancedPrefabBufferGeometry(prefab, prefabCount);

  const duration = 1.0;
  const maxPrefabDelay = 0.5;

  // used in the Animation.animate function below
  this.totalDuration = duration + maxPrefabDelay;

  geometry.createAttribute('aDelayDuration', 2, function(data) {
    data[0] = Math.random() * maxPrefabDelay;
    data[1] = duration;
  });

  const aStartPosition = geometry.createAttribute('aStartPosition', 3);
  const aEndPosition = geometry.createAttribute('aEndPosition', 3);
  const prefabData = [];

  for (let i = 0; i < prefabCount; i++) {
    geometry.setPrefabData(aStartPosition, i, startPositionGeometry.vertices[i].toArray(prefabData));
    geometry.setPrefabData(aEndPosition, i, endPositionGeometry.vertices[i].toArray(prefabData));
  }

  const axis = new THREE.Vector3();

  geometry.createAttribute('aAxisAngle', 4, function(data) {
    axis.x = THREE.Math.randFloatSpread(2);
    axis.y = THREE.Math.randFloatSpread(2);
    axis.z = THREE.Math.randFloatSpread(2);
    axis.normalize();
    axis.toArray(data);

    data[3] = Math.PI * 4;
  });

  const material = new BAS.ToonAnimationMaterial({
    uniforms: {
      uTime: {value: 0}
    },
    uniformValues: {
      gradientMap: new THREE.TextureLoader().load('../_tex/fox_gradient_map.png')
    },
    vertexFunctions: [
      BAS.ShaderChunk['ease_cubic_in_out'],
      BAS.ShaderChunk['ease_quad_out'],
      BAS.ShaderChunk['quaternion_rotation']
    ],
    vertexParameters: [
      'uniform float uTime;',
      'attribute vec2 aDelayDuration;',
      'attribute vec3 aStartPosition;',
      'attribute vec3 aEndPosition;',
      'attribute vec4 aAxisAngle;'
    ],
    vertexInit: [
      'float tProgress = clamp(uTime - aDelayDuration.x, 0.0, aDelayDuration.y) / aDelayDuration.y;',
      'tProgress = easeCubicInOut(tProgress);',
      'vec4 tQuat = quatFromAxisAngle(aAxisAngle.xyz, aAxisAngle.w * tProgress);'
    ],
    vertexNormal: [
      'objectNormal = rotateVector(tQuat, objectNormal);'
    ],
    vertexPosition: [
      'transformed = rotateVector(tQuat, transformed);',
      'transformed += mix(aStartPosition, aEndPosition, tProgress);',
    ]
  });

  geometry.computeVertexNormals();

  THREE.Mesh.call(this, geometry, material);

  this.frustumCulled = false;
}
Animation.prototype = Object.create(THREE.Mesh.prototype);
Animation.prototype.constructor = Animation;

Object.defineProperty(Animation.prototype, 'time', {
  get: function () {
    return this.material.uniforms['uTime'].value;
  },
  set: function (v) {
    this.material.uniforms['uTime'].value = v;
  }
});

Animation.prototype.animate = function (duration, options) {
  options = options || {};
  options.time = this.totalDuration;

  return TweenMax.fromTo(this, duration, {time: 0.0}, options);
};
