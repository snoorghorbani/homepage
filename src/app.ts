import * as THREE from 'three';
import { OrbitControls } from './js/controls/OrbitControls';
import { _text_animation } from './triangulate';
declare const TWEEN: any;

class App {
    private readonly renderer = new THREE.WebGLRenderer({ antialias: true, canvas: <HTMLCanvasElement>document.getElementById("mainCanvas") });
    private readonly scene = new THREE.Scene();
    private readonly camera = new THREE.PerspectiveCamera(45, innerWidth / innerHeight, 0.1, 10000);

    private brick: THREE.Mesh;
    private brickGeo: THREE.Geometry;
    private plate: THREE.Mesh;
    private controls: OrbitControls;

    constructor() {

        this.config_renderer();
        this.config_scene();
        this.setup_controls();
        // this.setup_helpers();
        this.setup_camera();
        this.create_objects();
        this.setup_lights();
        this.render();

        setTimeout(() => {
            debugger
            _text_animation(this.scene)
            // this.move_camera()
            // this.scene.remove(this.brick)

            // var mat = new THREE.MeshLambertMaterial()

            // var brekedGeo = this.breakdownGeometry(this.brickGeo)
            // var currentMesh = new THREE.Mesh(brekedGeo, mat)
            // this.scene.add(currentMesh)
        }, 3333);
    }

    private setup_helpers() {
        // var axes = new THREE.AxisHelper(50);
        // this.scene.add(axes);
        // var helper = new THREE.GridHelper(1000, 10);
        // helper.setColors(0x0000ff, 0x808080);
        // this.scene.add(helper);
    }

    private config_scene() {
        this.scene.background = new THREE.Color("#ffffff");
    }

    private config_renderer() {
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.setSize(innerWidth, innerHeight);
        this.renderer.setClearColor(new THREE.Color("rgb(256,0,0)"));
    }

    private setup_lights() {
        var light = new THREE.PointLight(0xfff00f, 1, 1000);
        light.position.set(100, -100, 200);
        light.castShadow = true;
        light.shadowMapWidth = 1024; // default is 512
        light.shadowMapHeight = 1024;
        this.scene.add(light);
    }

    private create_objects() {
        var brickGeo = this.brickGeo =new THREE.BoxGeometry(20, 20, 20) 
        this.brick = new THREE.Mesh(brickGeo);
        this.brick.material = new THREE.MeshNormalMaterial({wireframe:true});
        this.brick.position.set(0, 0, 30);
        this.brick.castShadow = true;
        this.brick.receiveShadow = true;
        this.scene.add(this.brick);

        this.plate = new THREE.Mesh(new THREE.PlaneGeometry(200, 200, 20, 20));
        this.plate.material = new THREE.MeshLambertMaterial({ color: 0xff00ff });
        this.plate.castShadow = true;
        this.plate.receiveShadow = true;
        this.scene.add(this.plate);
    }

    private setup_camera() {
        this.camera.position.set(0, -500, 2);
        this.camera.lookAt(0, 0, 0);
        this.scene.add(this.camera);
    }

    private setup_controls() {
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.target.set(0, 0.5, 0);
        this.controls.rotateSpeed = 1.0;
        this.controls.zoomSpeed = 1.2;
        this.controls.keyPanSpeed = 0.8;
        this.controls.enablePan = false;
    }

    private adjustCanvasSize() {
        this.renderer.setSize(innerWidth, innerHeight);
        this.camera.aspect = innerWidth / innerHeight;
        this.camera.updateProjectionMatrix();
    }

    private render() {
        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(() => { this.render() });
        this.adjustCanvasSize();

        this.brick.rotateZ(0.03);
        this.controls.update();
        TWEEN.update();
    }

    private move_camera() {
        var from = {
            x: this.camera.position.x,
            y: this.camera.position.y,
            z: this.camera.position.z
        };

        var to = {
            x: from.x,
            y: from.y,
            z: from.z + 500
        };
        var tween = new TWEEN.Tween(from)
            .to(to, 2222)
            .easing(TWEEN.Easing.Linear.None)
            .onUpdate((frame: any) => {
                this.camera.position.set(frame.x, frame.y, frame.z);
                this.camera.lookAt(new THREE.Vector3(0, 0, 0));
            })
            .onComplete(() => {
                this.camera.lookAt(new THREE.Vector3(0, 0, 0));
            })
            .start();

    }

    private breakdownGeometry(sourceGeometry:any) {
        var geom = new THREE.Geometry()
      
        // Create a Vector3 with positive random values scaled by amount.
        var randVect = function(amount:any) {
          return new THREE.Vector3(Math.random() * amount, Math.random() * amount , Math.random() * amount)
        }
      
        // Create and randomly offset a triangle based on 3 original vertices
        var makeTri = function(geom:any, vertA:any, vertB:any, vertC:any, normal:any) {
          var delta = normal.clone().multiplyScalar(0.5).multiply(randVect(1))
          geom.vertices.push(vertA.clone().add(delta))
          geom.vertices.push(vertB.clone().add(delta))
          geom.vertices.push(vertC.clone().add(delta))
          var vertIndex = geom.vertices.length - 3
          var newFace = new THREE.Face3(vertIndex, vertIndex + 1, vertIndex + 2, normal)
          geom.faces.push(newFace)
        }
      
        var faces = sourceGeometry.faces
        for (var i = 0; i < faces.length; i++) {
          var face = faces[i]
          var vertA = sourceGeometry.vertices[face.a]
          var vertB = sourceGeometry.vertices[face.b]
          var vertC = sourceGeometry.vertices[face.c]
          var vertD = new THREE.Vector3().addVectors(vertA, vertB).multiplyScalar(0.5)
          var vertE = new THREE.Vector3().addVectors(vertB, vertC).multiplyScalar(0.5)
          var vertF = new THREE.Vector3().addVectors(vertC, vertA).multiplyScalar(0.5)
      
          makeTri(geom, vertA, vertD, vertF, face.normal)
          makeTri(geom, vertD, vertB, vertE, face.normal)
          makeTri(geom, vertE, vertC, vertF, face.normal)
          makeTri(geom, vertD, vertE, vertF, face.normal)
      
        }
      
        geom.verticesNeedUpdate = true
        geom.normalsNeedUpdate = true
        return geom
      }
      
}

const app = new App();
