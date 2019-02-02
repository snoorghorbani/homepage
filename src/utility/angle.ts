export const angle = {
	getAngle(x: number, y: number): number {
		const _w = window.innerWidth;
		const _h = window.innerHeight;
		const mouseX = x - _w / 2;
		const mouseY = -(y - _h / 2);

		var mouseAngle = Math.atan2(mouseY, mouseX);

		if (mouseAngle < 0) {
			mouseAngle = 2 * Math.PI - -mouseAngle;
		}

		return mouseAngle;
	},
	toRad(val: number): number {
		return val * (Math.PI / 180);
	},
	toDeg(val: number): number {
		return val * (180 / Math.PI);
	}
};
