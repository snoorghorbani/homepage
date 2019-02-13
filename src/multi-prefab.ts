// import * as THREE from 'three';
// import * as BAS from '../node_modules/three-bas/dist/bas.module';
// import { TweenMax } from "gsap/TweenMax";

declare const Power0 : any;
declare const THREE: any;
declare const TweenMax: any;
declare const BAS: any;


function Animation() {
    // the number of times the prefabGeometry will be repeated
    const prefabs = [
      new THREE.TorusBufferGeometry(4, 1),
      new THREE.TetrahedronGeometry(4),
      new THREE.IcosahedronGeometry(4),
    ];
    const repeatCount = 200;
  
    const geometry = new BAS.MultiPrefabBufferGeometry(prefabs, repeatCount);
  
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
  
    const startPosition = new THREE.Vector3();
    const endPosition = new THREE.Vector3();
    const range = 100;
    const prefabData = [];
  
    for (let i = 0; i < repeatCount * prefabs.length; i++) {
      startPosition.x = THREE.Math.randFloatSpread(range) - range * 0.5;
      startPosition.y = THREE.Math.randFloatSpread(range);
      startPosition.z = THREE.Math.randFloatSpread(range);
  
      endPosition.x = Math.random()*10* THREE.Math.randFloatSpread(range) + range * 0.5;
      endPosition.y = Math.random()*10* THREE.Math.randFloatSpread(range)+ range * 0.5;
      endPosition.z = Math.random()*10* THREE.Math.randFloatSpread(range)+ range * 0.5;
      // endPosition.x = THREE.Math.randFloatSpread(range) + range * 0.5;
      // endPosition.y = THREE.Math.randFloatSpread(range);
      // endPosition.z = THREE.Math.randFloatSpread(range);
  
      geometry.setPrefabData(aStartPosition, i, startPosition.toArray(prefabData));
      geometry.setPrefabData(aEndPosition, i, endPosition.toArray(prefabData));
    }
  
    const axis = new THREE.Vector3();
  
    geometry.createAttribute('aAxisAngle', 4, function(data) {
      axis.x = THREE.Math.randFloatSpread(2);
      axis.y = THREE.Math.randFloatSpread(2);
      axis.z = THREE.Math.randFloatSpread(2);
      axis.normalize();
      axis.toArray(data);
  
      data[3] = Math.PI * THREE.Math.randFloat(4.0, 8.0);
    });
  
    const material = new BAS.StandardAnimationMaterial({
      flatShading: true,
      side: THREE.DoubleSide,
      uniforms: {
        uTime: {value: 0}
      },
      uniformValues: {
        metalness: 0.5,
        roughness: 0.5,
        map: new THREE.TextureLoader().load('../_tex/UV_Grid.jpg')
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
        //'objectNormal = rotateVector(tQuat, objectNormal);'
      ],
      vertexPosition: [
        'transformed = rotateVector(tQuat, transformed);',
        'transformed += mix(aStartPosition, aEndPosition, tProgress);',
      ]
    });
  
    //geometry.computeVertexNormals();
  
    geometry.bufferUvs();
  
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
  


  export const multi_prefab = function(scene){
		var light = new THREE.PointLight(0x00ff00, 1, 1000);
		light.position.set(0, 0, 300);
		light.castShadow = true;
		light.shadow.mapSize.width = 1024; // default is 512
		light.shadow.mapSize.height = 1024;
		scene.add(light);


    const animation = new Animation();
    animation.animate(8.0, {ease: Power0.easeIn, repeat:-1, repeatDelay:0.25, yoyo: true});
    scene.add(animation);
  
  }