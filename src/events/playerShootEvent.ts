import { ConeGeometry, Group, MathUtils, Mesh, MeshBasicMaterial, MeshPhongMaterial, Object3D, SphereGeometry, TubeGeometry, Vector3 } from "three";
import type { CubeSelection } from "./playerPositionEvent";
import { sceneMutation } from "../store/store";
import { CustomSinCurve } from "../components/game/PlayerShotIndicator";

export const usePlayerShootEvent = (cubeSelection?: CubeSelection) => {

    const geometry = new SphereGeometry(10, 24, 24);
    const material = new MeshPhongMaterial({ color: 0xffffff });

    // const playerShootIndicator = new Mesh(geometry, material);

    type PlayerShotDetails = { confirmed: boolean };

    let indicationArrow: Group | undefined;

    let playerShotIndicatorPosition: Vector3 = new Vector3();

    const playerShotDetails = {
        confirmed: false
    } as PlayerShotDetails;

    const callback = (lastClickedCube?: Object3D) => {

        if (cubeSelection?.cube && cubeSelection?.confirmed) {

            if (playerShotDetails.confirmed) {
                return;
            }

            const [x, y, z] = cubeSelection.cube.position;

            playerShotIndicatorPosition = new Vector3(x, y, z + 25);

            // Create the curved path
            const path = new CustomSinCurve();
            const tubeGeometry = new TubeGeometry(path, 20, 0.05, 8, false);
            const tubeMaterial = new MeshBasicMaterial({ color: 0xffff00 });
            const tubeMesh = new Mesh(tubeGeometry, tubeMaterial);

            // Create the arrowhead
            const arrowheadGeometry = new ConeGeometry(10, 20, 8);
            const arrowheadMaterial = new MeshBasicMaterial({ color: 0xffff00 });
            const arrowheadMesh = new Mesh(arrowheadGeometry, arrowheadMaterial);

            // Position the arrowhead at the end of the tube
            const endPoint = path.getPoint(1);
            arrowheadMesh.position.copy(endPoint);
            arrowheadMesh.lookAt(path.getPoint(0.99)); // Ensure the arrowhead points in the right direction

            // Combine the tube and arrowhead into one mesh
            const arrow = new Group();
            arrow.add(tubeMesh);
            arrow.add(arrowheadMesh);
            arrow.position.copy(playerShotIndicatorPosition);

            indicationArrow = arrow;

            playerShotDetails.confirmed = true;

             // Red for X-axis // Green for Y-axis  // Blue for Z-axis // Blue for Z-axis
            sceneMutation.set(({
                object: arrow,
                action: "add"
            }));
        }
    }

    // Variables for animation
    const radius = 5;
    const speed = 0.01;
    let angle = 0;
    let direction = 1;

    // Precompute positions around the center for 90 degrees (π/2)
    const positions = <any>[];
    for (let i = -Math.PI / 2; i <= Math.PI / 2; i += speed) {
        positions.push({
            x: radius * Math.cos(i),
            y: radius * Math.sin(i),
        });
    }

    const render = () => {
        if (indicationArrow) {
            console.log(angle, positions[Math.floor(angle)]);
            // Update angle and direction
            angle += direction * speed;
            if (angle >= Math.PI / 2 || angle <= -Math.PI / 2) {
                direction *= -1;
            }

            // Get current position
            const currentIndex = Math.floor((angle + Math.PI / 2) / speed);
            const currentPosition = positions[currentIndex];

            if (!currentPosition)
                return;

            // Calculate the target rotation to always look at the center
            const targetRotation = Math.atan2(-currentPosition.y, -currentPosition.x);
            indicationArrow.rotation.z = targetRotation;
        }
    }

    return { callback, render }
}