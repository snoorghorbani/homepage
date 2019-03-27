import { Utility } from './index';

export const position = {
	fullwidthInDistance(camera, distance?: number) {
		distance = distance || camera.position.z;
		var height = Math.tan(Utility.angle.toRad(camera.fov / 2)) * distance * 2;
		var width = height * innerWidth / innerHeight;

		return { width, height };
	}
};
