import * as T from 'three';

declare const TWEEN: any;
declare const THREE: any;
declare const Power0: any;
declare const BAS: any;
// declare const OrbitControls: any;

export const SolidWireframeMaterial = function (geometry) {
    var size = 100;
    var material = new THREE.MeshBasicMaterial({ wireframe: true });

    var mesh = new THREE.Mesh(geometry, material);
    mesh.position.x = - 150;
    // scene.add( mesh );

    //

    var geometry2 = geometry.clone();
    geometry2 = geometry2.toNonIndexed();

    setupAttributes(geometry);


    material = new THREE.ShaderMaterial({
        uniforms: {},
        vertexShader: vertexShader,
        fragmentShader: fragmentShader
    });

    material.extensions.derivatives = true;

    return material
}
function setupAttributes(geometry) {

    // TODO: Bring back quads

    var vectors = [
        new THREE.Vector3(1, 0, 0),
        new THREE.Vector3(0, 1, 0),
        new THREE.Vector3(0, 0, 1)
    ];

    var position = geometry.attributes.position;
    var centers = new Float32Array(position.count * 3);

    for (var i = 0, l = position.count; i < l; i++) {

        vectors[i % 3].toArray(centers, i * 3);

    }

    geometry.addAttribute('center', new THREE.BufferAttribute(centers, 3));

}
/**
 * the vertex shader
 * @type {String}
 */
// export const SolidWireframeMaterial: { vertexShader?: string; fragmentShader?: string } = {}
var vertexShader = [
    "attribute vec3 center;",
			"varying vec3 vCenter;",

			"void main() {",

				"vCenter = center;",
				"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

			"}"
].join('\n')

/**
 * the fragment shader
 * @type {String}
 */
var fragmentShader = [
    "varying vec3 vCenter;",

    "float edgeFactorTri() {",

        "vec3 d = fwidth( vCenter.xyz );",
        "vec3 a3 = smoothstep( vec3( 0.0 ), d * 1.5, vCenter.xyz );",
        "return min( min( a3.x, a3.y ), a3.z );",

    "}",

    "void main() {",

        "gl_FragColor.rgb = mix( vec3( 1.0 ), vec3( 0.2 ), edgeFactorTri() );",
        "gl_FragColor.a = 1.0;",
    "}"
].join('\n')

