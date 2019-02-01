import { Utility } from "./index";

declare const THREE: any;

export const geometry = {
  randomPointsInObject(obj, count) {
    var geo = (obj.geometry) ? obj.geometry : obj;
    var position = (obj.position) ? obj.position : new THREE.Vector3(0,0,0);
    return THREE.GeometryUtils.randomPointsInGeometry(geo, count).map(p => p.add(position));
  }
}