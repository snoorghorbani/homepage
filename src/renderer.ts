import { Utility } from './utility/index';
import { Helper } from './helper/index';

declare const Power0: any;
declare const THREE: any;
declare const TweenMax: any;
declare const BAS: any;
declare const TWEEN: any;

export class Renderer {
	private renderer = new THREE.WebGLRenderer({
		antialias: true,
		canvas: <HTMLCanvasElement>document.getElementById('mainCanvas')
	});
	public domElement = this.renderer.domElement;

	private onRender = [];

	constructor(private scene, private camera) {
		debugger;
		this.config_renderer();
	}

	public config_renderer() {
		this.renderer.shadowMap.enabled = true;
		this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
		this.renderer.setSize(innerWidth, innerHeight);
		this.renderer.setClearColor(new THREE.Color('rgb(256,0,0)'));
	}

	public config() {
		this.renderer.setSize(innerWidth, innerHeight);
	}
	public render() {
		this.renderer.render(this.scene, this.camera);

		this.onRender.forEach((fn) => fn());
	}
	public do(fn: any) {
		this.onRender.push(fn);
	}
}
