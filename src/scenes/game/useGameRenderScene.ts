import { AmbientLight, AxesHelper, DirectionalLight, Object3D, PerspectiveCamera, Scene, Vector3, WebGLRenderer } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { useGameTerrainGenerator } from "../../generators/useGameTerrainGenerator";
import { gameEvents } from "../../events/gameEvents";
import { sceneMutation } from "../../store/store";

export type SceneMutationAction = "add" | "remove"

export type SceneMutation = { object: Object3D, action: SceneMutationAction }

export const useGameRenderScene = (
    cubesize: number,
    landscape_width: number,
    landscape_length: number,
    camera_offset: number,
    camera_height: number
) => {
    const { terrain } = useGameTerrainGenerator(cubesize, landscape_width, landscape_length);

    const scene = new Scene();

    const camera = new PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.set(0, camera_offset, camera_height);
    camera.up = new Vector3(0, 0, 2);
    camera.lookAt(new Vector3(0, 0, 0));

    const renderer = new WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    const { onDomElementClick, render: renderEvents } = gameEvents(
        renderer.domElement,
        camera,
        terrain
    );
    renderer.domElement.addEventListener('click', onDomElementClick);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    // const stats = new Stats();
    // document.body.appendChild(stats.dom);
    scene.add(new AxesHelper(800))

    // const gridHelper = new THREE.GridHelper(1000, 20);
    // // gridHelper.rotateX(Math.PI/2)
    // // gridHelper.rotateZ(Math.PI/2)
    // scene.add(gridHelper);

    scene.add(terrain);

    const ambientLight = new AmbientLight(0x606060, 3);

    const directionalLight = new DirectionalLight(0xffffff, 3);
    directionalLight.position.set(1, 0.75, 0.5).normalize();

    scene.add(ambientLight, directionalLight);

    document.body.appendChild(renderer.domElement);

    sceneMutation.subscribe(mutation => {       
        console.log(mutation?.object);
        
        if (mutation && mutation.action === "add")
            scene.add(mutation.object);

        if (mutation && mutation.action === "remove")
            scene.remove(mutation.object);
    })

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }, false)

    const render = () => {
        requestAnimationFrame(render);
        renderer.render(scene, camera);
        controls.update();
        // stats.update();

        renderEvents();
    }

    return { render }
}