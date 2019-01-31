// import * as THREE from 'three';
// import * as BAS from '../node_modules/three-bas/dist/bas.module';
// import { TimelineMax } from "gsap/TimelineMax";

declare const PNLTRI: any
declare const Power1: any
declare const THREE: any;
declare const TimelineMax: any;
declare const TweenMax: any;
declare const BAS: any;

THREE.ShapeUtils.triangulateShape = (function () {
    var pnlTriangulator = new PNLTRI.Triangulator();
    return function triangulateShape(contour: any, holes: any) {
        return pnlTriangulator.triangulate_polygon([contour].concat(holes));
    };
})();

export const _text_animation = function (scene: any) {
    // var root = new THREERoot({
    //     createCameraControls: !true,
    //     antialias: (window.devicePixelRatio === 1),
    //     fov: 60
    // });

    // root.renderer.setClearColor(0xffffff);
    // root.renderer.setPixelRatio(window.devicePixelRatio || 1);
    // root.camera.position.set(0, 0, 600);


    var loader = new THREE.FontLoader();
    loader.load('./node_modules/three/examples/fonts/helvetiker_bold.typeface.json', function (font) {
        var textAnimation: any = createTextAnimation(font);
        scene.add(textAnimation);

        var light = new THREE.DirectionalLight();
        light.position.set(0, 0, 1);
        scene.add(light);
        debugger;
        var tl = new TimelineMax({
            repeat: -1,
            repeatDelay: 0.5,
            yoyo: true
        });
        tl.fromTo(textAnimation, 4,
            { animationProgress: 0.0 },
            { animationProgress: 0.6, ease: Power1.easeInOut },
            0
        );
        tl.fromTo(textAnimation.rotation, 4, { y: 0 }, { y: Math.PI * 2, ease: Power1.easeInOut }, 0);

        // createTweenScrubber(tl);
    })
}

function createTextAnimation(font) {
    var geometry = generateTextGeometry('Animation four', {
        size:40,
        height:12,
        font:font,
        weight:'bold',
        style:'normal',
        curveSegments:24,
        bevelSize:2,
        bevelThickness:2,
        bevelEnabled:true,
        anchor:{x:0.5, y:0.5, z:0.0}
      });
    
      utils.tessellateRepeat(geometry, 1.0, 2);
    
      BAS.Utils.separateFaces(geometry);
    
      return new TextAnimation(geometry);
    }

function generateTextGeometry(text: string, params: any) {
    // var geometry = new THREE.TextGeometry(text, params);
    var geometry =  new THREE.SphereGeometry(20, 20, 20);

    geometry.computeBoundingBox();
  
    var size = geometry.boundingBox.size();
    var anchorX = size.x * -params.anchor.x;
    var anchorY = size.y * -params.anchor.y;
    var anchorZ = size.z * -params.anchor.z;
    var matrix = new THREE.Matrix4().makeTranslation(anchorX, anchorY, anchorZ);
  
    geometry.applyMatrix(matrix);
  
    return geometry;
  }

////////////////////
// CLASSES
////////////////////

function TextAnimation(textGeometry) {
    var bufferGeometry = new BAS.ModelBufferGeometry(textGeometry);
  
    var aAnimation = bufferGeometry.createAttribute('aAnimation', 2);
    var aEndPosition = bufferGeometry.createAttribute('aEndPosition', 3);
    var aAxisAngle = bufferGeometry.createAttribute('aAxisAngle', 4);
  
    var faceCount = bufferGeometry.faceCount;
    var i, i2, i3, i4, v;
  
    var maxDelay = 0.0;
    var minDuration = 1.0;
    var maxDuration = 1.0;
    var stretch = 0.05;
    var lengthFactor = 0.001;
    var maxLength = textGeometry.boundingBox.max.length();
  
    this.animationDuration = maxDuration + maxDelay + stretch + lengthFactor * maxLength;
    this._animationProgress = 0;
  
    var axis = new THREE.Vector3();
    var angle;
  
    for (i = 0, i2 = 0, i3 = 0, i4 = 0; i < faceCount; i++, i2 += 6, i3 += 9, i4 += 12) {
      var face = textGeometry.faces[i];
      var centroid = BAS.Utils.computeCentroid(textGeometry, face);
      var centroidN = new THREE.Vector3().copy(centroid).normalize();
  
      // animation
      var delay = (maxLength - centroid.length()) * lengthFactor;
      var duration = THREE.Math.randFloat(minDuration, maxDuration);
  
      for (v = 0; v < 6; v += 2) {
        aAnimation.array[i2 + v    ] = delay + stretch * Math.random();
        aAnimation.array[i2 + v + 1] = duration;
      }
  
      // end position
      var point = utils.fibSpherePoint(i, faceCount, 200);
  
      for (v = 0; v < 9; v += 3) {
        aEndPosition.array[i3 + v    ] = point.x;
        aEndPosition.array[i3 + v + 1] = point.y;
        aEndPosition.array[i3 + v + 2] = point.z;
      }
  
      // axis angle
      axis.x = centroidN.x;
      axis.y = -centroidN.y;
      axis.z = -centroidN.z;
  
      axis.normalize();
  
      angle = Math.PI * THREE.Math.randFloat(0.5, 2.0);
  
      for (v = 0; v < 12; v += 4) {
        aAxisAngle.array[i4 + v    ] = axis.x;
        aAxisAngle.array[i4 + v + 1] = axis.y;
        aAxisAngle.array[i4 + v + 2] = axis.z;
        aAxisAngle.array[i4 + v + 3] = angle;
      }
    }
  
    var material = new BAS.PhongAnimationMaterial({
        shading: THREE.FlatShading,
        side: THREE.DoubleSide,
        transparent: true,
        uniforms: {
          uTime: {type: 'f', value: 0}
        },
        vertexFunctions: [
          BAS.ShaderChunk['cubic_bezier'],
          BAS.ShaderChunk['ease_out_cubic'],
          BAS.ShaderChunk['quaternion_rotation']
        ],
        vertexParameters: [
          'uniform float uTime;',
          'uniform vec3 uAxis;',
          'uniform float uAngle;',
          'attribute vec2 aAnimation;',
          'attribute vec3 aEndPosition;',
          'attribute vec4 aAxisAngle;'
        ],
        vertexInit: [
          'float tDelay = aAnimation.x;',
          'float tDuration = aAnimation.y;',
          'float tTime = clamp(uTime - tDelay, 0.0, tDuration);',
          //'float tProgress = ease(tTime, 0.0, 1.0, tDuration);'
           'float tProgress = tTime / tDuration;'
        ],
        vertexPosition: [
          'transformed = mix(transformed, aEndPosition, tProgress);',
  
          'float angle = aAxisAngle.w * tProgress;',
          'vec4 tQuat = quatFromAxisAngle(aAxisAngle.xyz, angle);',
          'transformed = rotateVector(tQuat, transformed);',
        ]
      },
      {
        diffuse: 0x444444,
        specular: 0xcccccc,
        shininess: 4
        //emissive:0xffffff
      }
    );
  
    THREE.Mesh.call(this, bufferGeometry, material);
  
    this.frustumCulled = false;
  }
  TextAnimation.prototype = Object.create(THREE.Mesh.prototype);
  TextAnimation.prototype.constructor = TextAnimation;
  
  Object.defineProperty(TextAnimation.prototype, 'animationProgress', {
    get: function() {
        debugger;
      return this._animationProgress;
    },
    set: function(v) {
      this._animationProgress = v;
      this.material.uniforms['uTime'].value = this.animationDuration * v;
    }
  });
  
  ////////////////////
  // UTILS
  ////////////////////
  
  var utils = {
    extend:function(dst, src) {
      for (var key in src) {
        dst[key] = src[key];
      }
  
      return dst;
    },
    randSign: function() {
      return Math.random() > 0.5 ? 1 : -1;
    },
    ease:function(ease, t, b, c, d) {
      return b + ease.getRatio(t / d) * c;
    },
    // mapEase:function(ease, v, x1, y1, x2, y2) {
    //   var t = v;
    //   var b = x2;
    //   var c = y2 - x2;
    //   var d = y1 - x1;
    //
    //   return utils.ease(ease, t, b, c, d);
    // },
    fibSpherePoint: (function() {
      var v = {x:0, y:0, z:0};
      var G = Math.PI * (3 - Math.sqrt(5));
  
      return function(i, n, radius) {
        var step = 2.0 / n;
        var r, phi;
  
        v.y = i * step - 1 + (step * 0.5);
        r = Math.sqrt(1 - v.y * v.y);
        phi = i * G;
        v.x = Math.cos(phi) * r;
        v.z = Math.sin(phi) * r;
  
        radius = radius || 1;
  
        v.x *= radius;
        v.y *= radius;
        v.z *= radius;
  
        return v;
      }
    })(),
    tessellate: function (geometry, maxEdgeLength) {
        var edge;
    
        var faces = [];
        var faceVertexUvs = [];
        var maxEdgeLengthSquared = maxEdgeLength * maxEdgeLength;
    
        for (var i = 0, il = geometry.faceVertexUvs.length; i < il; i++) {
    
          faceVertexUvs[i] = [];
    
        }
    
        for (var i = 0, il = geometry.faces.length; i < il; i++) {
    
          var face = geometry.faces[i];
    
          if (face instanceof THREE.Face3) {
    
            var a = face.a;
            var b = face.b;
            var c = face.c;
    
            var va = geometry.vertices[a];
            var vb = geometry.vertices[b];
            var vc = geometry.vertices[c];
    
            var dab = va.distanceToSquared(vb);
            var dbc = vb.distanceToSquared(vc);
            var dac = va.distanceToSquared(vc);
    
            if (dab > maxEdgeLengthSquared || dbc > maxEdgeLengthSquared || dac > maxEdgeLengthSquared) {
    
              var m = geometry.vertices.length;
    
              var triA = face.clone();
              var triB = face.clone();
    
              if (dab >= dbc && dab >= dac) {
    
                var vm = va.clone();
                vm.lerp(vb, 0.5);
    
                triA.a = a;
                triA.b = m;
                triA.c = c;
    
                triB.a = m;
                triB.b = b;
                triB.c = c;
    
                if (face.vertexNormals.length === 3) {
    
                  var vnm = face.vertexNormals[0].clone();
                  vnm.lerp(face.vertexNormals[1], 0.5);
    
                  triA.vertexNormals[1].copy(vnm);
                  triB.vertexNormals[0].copy(vnm);
    
                }
    
                if (face.vertexColors.length === 3) {
    
                  var vcm = face.vertexColors[0].clone();
                  vcm.lerp(face.vertexColors[1], 0.5);
    
                  triA.vertexColors[1].copy(vcm);
                  triB.vertexColors[0].copy(vcm);
    
                }
    
                edge = 0;
    
              } else if (dbc >= dab && dbc >= dac) {
    
                var vm = vb.clone();
                vm.lerp(vc, 0.5);
    
                triA.a = a;
                triA.b = b;
                triA.c = m;
    
                triB.a = m;
                triB.b = c;
                triB.c = a;
    
                if (face.vertexNormals.length === 3) {
    
                  var vnm = face.vertexNormals[1].clone();
                  vnm.lerp(face.vertexNormals[2], 0.5);
    
                  triA.vertexNormals[2].copy(vnm);
    
                  triB.vertexNormals[0].copy(vnm);
                  triB.vertexNormals[1].copy(face.vertexNormals[2]);
                  triB.vertexNormals[2].copy(face.vertexNormals[0]);
    
                }
    
                if (face.vertexColors.length === 3) {
    
                  var vcm = face.vertexColors[1].clone();
                  vcm.lerp(face.vertexColors[2], 0.5);
    
                  triA.vertexColors[2].copy(vcm);
    
                  triB.vertexColors[0].copy(vcm);
                  triB.vertexColors[1].copy(face.vertexColors[2]);
                  triB.vertexColors[2].copy(face.vertexColors[0]);
    
                }
    
                edge = 1;
    
              } else {
    
                var vm = va.clone();
                vm.lerp(vc, 0.5);
    
                triA.a = a;
                triA.b = b;
                triA.c = m;
    
                triB.a = m;
                triB.b = b;
                triB.c = c;
    
                if (face.vertexNormals.length === 3) {
    
                  var vnm = face.vertexNormals[0].clone();
                  vnm.lerp(face.vertexNormals[2], 0.5);
    
                  triA.vertexNormals[2].copy(vnm);
                  triB.vertexNormals[0].copy(vnm);
    
                }
    
                if (face.vertexColors.length === 3) {
    
                  var vcm = face.vertexColors[0].clone();
                  vcm.lerp(face.vertexColors[2], 0.5);
    
                  triA.vertexColors[2].copy(vcm);
                  triB.vertexColors[0].copy(vcm);
    
                }
    
                edge = 2;
    
              }
    
              faces.push(triA, triB);
              geometry.vertices.push(vm);
    
              for (var j = 0, jl = geometry.faceVertexUvs.length; j < jl; j++) {
    
                if (geometry.faceVertexUvs[j].length) {
    
                  var uvs = geometry.faceVertexUvs[j][i];
    
                  var uvA = uvs[0];
                  var uvB = uvs[1];
                  var uvC = uvs[2];
    
                  // AB
    
                  if (edge === 0) {
    
                    var uvM = uvA.clone();
                    uvM.lerp(uvB, 0.5);
    
                    var uvsTriA = [uvA.clone(), uvM.clone(), uvC.clone()];
                    var uvsTriB = [uvM.clone(), uvB.clone(), uvC.clone()];
    
                    // BC
    
                  } else if (edge === 1) {
    
                    var uvM = uvB.clone();
                    uvM.lerp(uvC, 0.5);
    
                    var uvsTriA = [uvA.clone(), uvB.clone(), uvM.clone()];
                    var uvsTriB = [uvM.clone(), uvC.clone(), uvA.clone()];
    
                    // AC
    
                  } else {
    
                    var uvM = uvA.clone();
                    uvM.lerp(uvC, 0.5);
    
                    var uvsTriA = [uvA.clone(), uvB.clone(), uvM.clone()];
                    var uvsTriB = [uvM.clone(), uvB.clone(), uvC.clone()];
    
                  }
    
                  faceVertexUvs[j].push(uvsTriA, uvsTriB);
    
                }
    
              }
    
            } else {
    
              faces.push(face);
    
              for (var j = 0, jl = geometry.faceVertexUvs.length; j < jl; j++) {
    
                faceVertexUvs[j].push(geometry.faceVertexUvs[j][i]);
    
              }
    
            }
    
          }
    
        }
    
        geometry.faces = faces;
        geometry.faceVertexUvs = faceVertexUvs;
      },
      tessellateRepeat: function(geometry, maxEdgeLength, times) {
        for (var i = 0; i < times; i++) {
          utils.tessellate(geometry, maxEdgeLength);
        }
      }
  };
  
  function createTweenScrubber(tween, seekSpeed) {
    seekSpeed = seekSpeed || 0.001;
  
    function stop() {
      TweenMax.to(tween, 1, {timeScale:0});
    }
  
    function resume() {
      TweenMax.to(tween, 1, {timeScale:1});
    }
  
    function seek(dx) {
      var progress = tween.progress();
      var p = THREE.Math.clamp((progress + (dx * seekSpeed)), 0, 1);
  
      tween.progress(p);
    }
  
    var _cx = 0;
  
    // desktop
    var mouseDown = false;
    document.body.style.cursor = 'pointer';
  
    window.addEventListener('mousedown', function(e) {
      mouseDown = true;
      document.body.style.cursor = 'ew-resize';
      _cx = e.clientX;
      stop();
    });
    window.addEventListener('mouseup', function(e) {
      mouseDown = false;
      document.body.style.cursor = 'pointer';
      resume();
    });
    window.addEventListener('mousemove', function(e) {
      if (mouseDown === true) {
        var cx = e.clientX;
        var dx = cx - _cx;
        _cx = cx;
  
        seek(dx);
      }
    });
    // mobile
    window.addEventListener('touchstart', function(e) {
      _cx = e.touches[0].clientX;
      stop();
      e.preventDefault();
    });
    window.addEventListener('touchend', function(e) {
      resume();
      e.preventDefault();
    });
    window.addEventListener('touchmove', function(e) {
      var cx = e.touches[0].clientX;
      var dx = cx - _cx;
      _cx = cx;
  
      seek(dx);
      e.preventDefault();
    });
  }