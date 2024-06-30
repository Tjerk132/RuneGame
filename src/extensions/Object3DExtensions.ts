///<reference path="../@types/global.d.ts" />

import { Object3D, Vector3 } from "three";

// import { Object3D, Vector3, type Object3DEventMap } from "three";

Object3D.prototype.getObjectByPosition = function (position: Vector3, tolerance: number = 0.1): Object3D | null {
    for (const object of this.children) {
        if (object.position.distanceTo(position) < tolerance) {
            return object;
        }
    }
    return null;
}

export { }