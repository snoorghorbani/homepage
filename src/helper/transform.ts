import { Utility } from "../utility/index";

declare const Power0: any
declare const Power1: any
declare const THREE: any;
declare const TimelineMax: any;
declare const TweenMax: any;
declare const BAS: any;

interface animationConfig {
  duration: number, ease: any, repeat: -1 | 0 | 1, repeatDelay: number, yoyo: boolean
}

export function transform(scene, prefabGeometry, fromGeo, toGeo, animationConfig: animationConfig) {
  var light = new THREE.DirectionalLight(0xff00ff);
  scene.add(light);

  light = new THREE.DirectionalLight(0x00ffff);
  light.position.y = -1;
  scene.add(light);

  // Animation extends THREE.Mesh
  var animation = new Animation(prefabGeometry, fromGeo, toGeo);
  animation.animate(animationConfig.duration, animationConfig);
  scene.add(animation);
}

////////////////////
// CLASSES
////////////////////

// Animation is just a convenient wrapper to create a BufferGeometry and a ShaderMaterial, which are tightly coupled
// the geometry contains animation data, and the material uses this data to calculate an animation state based on uniforms
function Animation(prefabs, fromGeo, toGeo) {
  var prefabCount = prefabs.prefabCount
  // the geometry that will be used by the PrefabBufferGeometry
  // any Geometry will do, but more complex ones can be repeated less often

  // the number of times the prefabGeometry will be repeated

  // BAS.PrefabBufferGeometry extends THREE.BufferGeometry
  // it stores data that is used for animation calculation in addition to the actual geometry
  // var prefabs = new BAS.PrefabBufferGeometry(prefabGeometry, prefabCount);

  // temp stuff
  var i, j, offset;

  // create a BufferAttribute with an item size of 2
  // each prefab has an animation duration and a delay
  // these will be used to calculate the animation state within the vertex shader
  var aDelayDuration = prefabs.createAttribute('aDelayDuration', 2);
  var duration = 1.0;
  var maxPrefabDelay = 0.5;

  // used in the Animation.animate function below
  this.totalDuration = duration + maxPrefabDelay;

  // give each prefab a random delay
  for (i = 0, offset = 0; i < prefabCount; i++) {
    var delay = Math.random() * maxPrefabDelay;

    // store the duration and the delay for each vertex of the prefab
    // we have to do this because the vertex shader is executed for each vertex
    // because the values are the same per vertex, the prefab will move as a whole
    // if the duration or delay varies per vertex, you can achieve a stretching effect
    debugger
    for (j = 0; j < prefabs.prefabGeometry.vertices.length; j++) {
      aDelayDuration.array[offset] = delay;
      aDelayDuration.array[offset + 1] = duration;

      offset += 2;
    }
  }

  // create two BufferAttributes with an item size of 3
  // these will store the start and end position for the translation
  var aStartPosition = prefabs.createAttribute('aStartPosition', 3);
  var aEndPosition = prefabs.createAttribute('aEndPosition', 3);

  // make two temp vectors so we don't create excessive objects inside the loop
  var startPosition = new THREE.Vector3();
  var endPosition = new THREE.Vector3();
  var range = 400;
  var prefabData = [];


  // var startPositions = THREE.GeometryUtils.randomPointsInGeometry(fromGeo.geometry,prefabCount)
  // var endPositions = THREE.GeometryUtils.randomPointsInGeometry(toGeo,prefabCount)
  var startPositions = Utility.geometry.randomPointsInObject(fromGeo, prefabCount)
  var endPositions = Utility.geometry.randomPointsInObject(toGeo, prefabCount)

  // calculate the stand and end positions for each prefab
  for (i = 0; i < prefabCount; i++) {

    debugger;;
    startPosition = startPositions[i];
    endPosition = endPositions[i];
    // endPosition.x = THREE.Math.randFloatSpread(range) + range * 0.5;
    // endPosition.y = THREE.Math.randFloatSpread(range) ;
    // endPosition.z = THREE.Math.randFloatSpread(range);

    // this data has to be stored per prefab as well
    // BAS.PrefabBufferGeometry.setPrefabData is a convenience method for this
    // calling this (instead of the unfolded way like aDelayDuration) might be slightly slower in large geometries
    prefabs.setPrefabData(aStartPosition, i, startPosition.toArray(prefabData));
    prefabs.setPrefabData(aEndPosition, i, endPosition.toArray(prefabData));
  }

  // the axis and angle will be used to calculate the rotation of the prefab using a Quaternion
  // we use quaternions instead of (rotation) matrices because the quaternion is more compact (4 floats instead of 16)
  // it also requires less trig functions (sin, cos), which are fairly expensive on the GPU
  var axis = new THREE.Vector3();
  var angle;

  // create a BufferAttribute with an item size of 4
  // the 3rd argument is a function that will be called for each prefab
  // it essentially replaces the loop we used for the other attributes
  // the first argument, 'data', should be populated with the data for the attribute
  // 'i' is the index of the prefab
  // 'total' is the total number of prefabs (same as prefabCount)
  // this is the most compact way of filling the buffer, but it's a little slower and less flexible than the others
  prefabs.createAttribute('aAxisAngle', 4, function (data, i, total) {
    // get a random axis
    axis.x = THREE.Math.randFloatSpread(2);
    axis.y = THREE.Math.randFloatSpread(2);
    axis.z = THREE.Math.randFloatSpread(2);
    // axis has to be normalized, or else things get weird
    axis.normalize();
    // the total angle of rotation around the axis
    angle = Math.PI * THREE.Math.randFloat(4.0, 8.0);

    // copy the data to the array
    axis.toArray(data);
    data[3] = angle;
  });

  // BAS.StandardAnimationMaterial uses the data in the buffer geometry to calculate the animation state
  // this calculation is performed in the vertex shader
  // BAS.StandardAnimationMaterial uses THREE.js shader chunks to duplicate the THREE.MeshStandardMaterial
  // the shader is then 'extended' by injecting our own chunks at specific points
  // BAS also extends THREE.MeshPhongMaterial and THREE.MeshBasicMaterial in the same way
  var material = new BAS.StandardAnimationMaterial({
    // material parameters/flags go here
    flatShading: true,
    // custom uniform definitions
    uniforms: {
      // uTime is updated every frame, and is used to calculate the current animation state
      // this is the only value that changes, which is the reason we can animate so many objects at the same time
      uTime: { value: 0 }
    },
    // uniform *values* of the material we are extending go here
    uniformValues: {
      metalness: 0.5,
      roughness: 0.5
    },
    // BAS has a number of functions that can be reused. They can be injected here.
    vertexFunctions: [
      // Penner easing functions easeCubicInOut and easeQuadOut (see the easing example for all available functions)
      BAS.ShaderChunk['ease_cubic_in_out'],
      BAS.ShaderChunk['ease_quad_out'],
      // quatFromAxisAngle and rotateVector functions
      BAS.ShaderChunk['quaternion_rotation']
    ],
    // parameter  must match uniforms and attributes defined above in both name and type
    // as a convention, I prefix uniforms with 'u' and attributes with 'a' (and constants with 'c', varyings with 'v', and temps with 't')
    vertexParameters: [
      'uniform float uTime;',
      'attribute vec2 aDelayDuration;',
      'attribute vec3 aStartPosition;',
      'attribute vec3 aEndPosition;',
      'attribute vec4 aAxisAngle;'
    ],
    // this chunk is injected 1st thing in the vertex shader main() function
    // variables declared here are available in all subsequent chunks
    vertexInit: [
      // calculate a progress value between 0.0 and 1.0 based on the vertex delay and duration, and the uniform time
      'float tProgress = clamp(uTime - aDelayDuration.x, 0.0, aDelayDuration.y) / aDelayDuration.y;',
      // ease the progress using one of the available easing functions
      'tProgress = easeCubicInOut(tProgress);',
      // calculate a quaternion based on the vertex axis and the angle
      // the angle is multiplied by the progress to create the rotation animation
      'vec4 tQuat = quatFromAxisAngle(aAxisAngle.xyz, aAxisAngle.w * tProgress);'
    ],
    // this chunk is injected before all default normal calculations
    vertexNormal: [
      // 'objectNormal' is used throughout the three.js vertex shader
      // we rotate it to match the new orientation of the prefab
      // this isn't required when using flat shading
      //'objectNormal = rotateVector(tQuat, objectNormal);'
    ],
    // this chunk is injected before all default position calculations (including the model matrix multiplication)
    vertexPosition: [
      // calculate a scale based on tProgress
      // here an easing function is used with the (t, b, c, d) signature (see easing example)
      'float scl = easeQuadOut(tProgress, 0.5, 1.5, 1.0);',
      // 'transformed' is the vertex position modified throughout the THREE.js vertex shader
      // it contains the position of each vertex in model space
      // scaling it can be done by simple multiplication
      'transformed *= scl;',
      // rotate the vector by the quaternion calculated in vertexInit
      'transformed = rotateVector(tQuat, transformed);',
      // linearly interpolate between the start and end position based on tProgress
      // and add the value as a delta
      'transformed += mix(aStartPosition, aEndPosition, tProgress);'
    ]
  });

  // this isn't required when using flat shading
  //geometry.computeVertexNormals();

  THREE.Mesh.call(this, prefabs, material);

  // it's usually a good idea to set frustum culling to false because
  // the bounding box does not reflect the dimensions of the whole object in the scene
  this.frustumCulled = false;
}
Animation.prototype = Object.create(THREE.Mesh.prototype);
Animation.prototype.constructor = Animation;
// helper method for changing the uTime uniform
Object.defineProperty(Animation.prototype, 'time', {
  get: function () {
    return this.material.uniforms['uTime'].value;
  },
  set: function (v) {
    this.material.uniforms['uTime'].value = v;
  }
});
// helper method to animate the time between 0.0 and the totalDuration calculated in the constructor
Animation.prototype.animate = function (duration, options) {
  options = options || {};
  options.time = this.totalDuration;
  TweenMax.fromTo(this.rotation, 4, { y: 0 }, { y: Math.PI * 2, ease: Power1.easeInOut }, 0);


  return TweenMax.fromTo(this, duration, { time: 0.0 }, options);
};
