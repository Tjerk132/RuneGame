declare global {
    interface Object3D extends CustomObject3D {}

    // interface Object3D<Object3DEventMap> {
    //     getObjectByPosition(position: Vector3, tolerance: number = 0.1);
    // }
}

interface CustomObject3D extends THREE.Object3D {
    getObjectByPosition(position: Vector3, tolerance: number = 0.1);
}