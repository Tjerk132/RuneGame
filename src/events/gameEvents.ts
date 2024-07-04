import { Object3D, PerspectiveCamera, Raycaster, Vector2 } from "three";
import { usePlayerPositionEvent } from "./playerPositionEvent";
import { usePlayerShootEvent } from "./playerShootEvent";

export const gameEvents = (
    domElement: HTMLCanvasElement,
    camera: PerspectiveCamera,
    terrain: Object3D
) => {

    const raycaster = new Raycaster();
    const mouse = new Vector2();

    const { callback: playerPositionEventCallback, render: renderPlayerPositionEvent, cubeSelection } = usePlayerPositionEvent(terrain);
    const { callback: playerShootEventCallback, render: renderPlayerShootEvent } = usePlayerShootEvent(cubeSelection);

    const onDomElementClick = (event: MouseEvent) => {
        event.preventDefault();

        mouse.set(
            ((event.clientX - domElement.offsetLeft) / domElement.width) * 2 - 1,
            -((event.clientY - domElement.offsetTop) / domElement.height) * 2 + 1
        );

        raycaster.setFromCamera(mouse, camera);

        const lastClickedCube = locateClickedObject();

        playerPositionEventCallback(lastClickedCube);
        playerShootEventCallback(lastClickedCube);
    };

    const locateClickedObject = () => {
        const renderObjects = terrain.children;

        const intersections = raycaster.intersectObjects(renderObjects);

        if (intersections.length) {
            const intersection = intersections[0];

            return intersection.object;
        }

        return undefined;
    }

    return {
        onDomElementClick,
        render: () => {
            renderPlayerPositionEvent();
            renderPlayerShootEvent();
        }
    }
}