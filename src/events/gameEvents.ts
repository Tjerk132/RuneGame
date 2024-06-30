import { BoxGeometry, Mesh, MeshPhongMaterial, Object3D, PerspectiveCamera, Raycaster, Vector2, Vector3 } from "three";
import { playerPosition } from '../store/store';

export const gameEvents = (
    domElement: HTMLCanvasElement,
    camera: PerspectiveCamera,
    terrain: Object3D
) => {

    const raycaster = new Raycaster();
    const mouse = new Vector2();

    type CubeSelection = { cube: Mesh<BoxGeometry, MeshPhongMaterial> | undefined, confirmed: boolean };

    const cubeSelection = {
        cube: undefined,
        confirmed: false
    } as CubeSelection;

    const onDomElementClick = (event: MouseEvent) => {
        event.preventDefault();

        mouse.set(
            ((event.clientX - domElement.offsetLeft) / domElement.width) * 2 - 1,
            -((event.clientY - domElement.offsetTop) / domElement.height) * 2 + 1
        );

        raycaster.setFromCamera(mouse, camera);

        const lastClickedCube = locateClickedObject();

        const selectionCubeChanged = lastClickedCube !== cubeSelection.cube;
        //when clicked other cube return previous cube to original material (remove highlight)
        if (cubeSelection.cube && selectionCubeChanged) {
            cubeSelection.cube.material = new MeshPhongMaterial({ color: cubeSelection.cube.material.color });
        }
        //if cube is already highlighted, assign to player (player confirmed position)
        if (cubeSelection.cube && !selectionCubeChanged && !cubeSelection.confirmed) {
            cubeSelection.confirmed = true;
            // cubeSelection.cube.material = new MeshPhongMaterial({ color: Math.random() * 0xffffff });

            //send aciton that user selection position
            const [x, y, z] = cubeSelection.cube.position;
            const immutablePosition = {
                "x": x,
                "y": y,
                "z": z
            }
            Rune.actions.confirmPosition({
                playerId: null,
                color: null,
                position: immutablePosition
            });
        }
        cubeSelection.cube = lastClickedCube as Mesh<BoxGeometry, MeshPhongMaterial>;
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

    //pass in a the same method without reinstantiating
    const min = 0;
    const max = 0.1;
    let current = 0.5 * (max - min) + min;
    let step = 0.0025;

    const renderClickedCubeHighlight = () => {
        if (cubeSelection.cube && !cubeSelection.confirmed) {
            cubeSelection.cube.material = new MeshPhongMaterial({ color: cubeSelection.cube.material.color, emissive: 0xffffff });
            current += step
            if (current >= max || current <= min) {
                step = -step;
            }
            cubeSelection.cube.material.emissiveIntensity = current;
        }
    }

    playerPosition.subscribe(playerPosition => {
        if (playerPosition?.position) {
            const position = new Vector3(playerPosition.position.x, playerPosition.position.y, playerPosition.position.z);
            // terrain.getObjectByPosition()
            const cube = getObjectByPosition(position) as Mesh;
            if (cube) {
                cube.material = new MeshPhongMaterial({
                    color: playerPosition.color ?? 0xffffff
                    // Math.random() * 0xffffff 
                });
            }
        }
    })

    //use extension method
    const getObjectByPosition = (position: Vector3, tolerance: number = 0.1) => {
        for (const object of terrain.children) {
            if (object.position.distanceTo(position) < tolerance) {
                return object;
            }
        }
        return null;
    }

    return {
        onDomElementClick,
        render: () => {
            renderClickedCubeHighlight();
        }
    }
}