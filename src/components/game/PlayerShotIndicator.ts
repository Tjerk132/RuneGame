import { Curve, Vector3 } from "three";

export class CustomSinCurve extends Curve<Vector3> {
    scale: number;

    constructor(scale = 1) {
        super();
        this.scale = scale;
    }

    getPoint(t: number, optionalTarget = new Vector3()): Vector3 {
        const tx = t * 3 - 1.5;
        const ty = Math.sin(2 * Math.PI * t);
        const tz = Math.cos(2 * Math.PI * t);
        return optionalTarget.set(tx, ty, tz).multiplyScalar(this.scale);
    }
}