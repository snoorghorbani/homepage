import { Utility } from '../utility/index';
import { Helper } from '../helper/index';

declare const Power0: any;
declare const THREE: any;
declare const TweenMax: any;
declare const BAS: any;
declare const TWEEN: any;

class _Renderer {
	private scene;
	private camera;
	private width: number;
	private height: number;
	private renderer;
	public domElement;

	private onRender = [];

	constructor(canvasId: string, { width, height }) {
		this.width = width;
		this.height = height;

		this.renderer = new THREE.WebGLRenderer({
			antialias: true,
			alpha: true,
			canvas: <HTMLCanvasElement>document.getElementById(canvasId)
		});
		this.domElement = this.renderer.domElement;

		this.config_renderer();
	}

	public config_renderer() {
		this.renderer.shadowMap.enabled = true;
		this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
		this.renderer.setPixelRatio(window.devicePixelRatio);

		this.renderer.setSize(this.width, this.height);
		// this.renderer.setClearColor(new THREE.Color('rgb(256,0,0)'));
	}
	public dim(w: number, h: number) {
		this.width = w;
		this.height = h;
		this.renderer.setSize(this.width, this.height);
	}

	public config({ scene, camera, width, height }) {
		this.scene = scene;
		this.camera = camera;
		this.width = width;
		this.height = height;
	}
	public setup() {
		this.renderer.setSize(this.width, this.height);
	}
	public render() {
		this.onRender.forEach((fn) => fn());
		this.renderer.render(this.scene, this.camera);
	}
	public do(fn: any) {
		this.onRender.push(fn);
	}
}

const renederes: { [name: string]: _Renderer } = {}

export const Renderer = function (name: string, { width, height }) {

	return (renederes[name]) ? (renederes[name]) : renederes[name] = new _Renderer(name, { width, height })
}
