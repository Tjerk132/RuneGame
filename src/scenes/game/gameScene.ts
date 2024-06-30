// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
// import Stats from 'three/examples/jsm/libs/stats.module';
import { useGameRenderScene } from './useGameRenderScene';

export const gameScene = () => {

    const render = () => {
        const cubesize = 30;
        const landscape_width = 30;
        const landscape_length = 30;
        const camera_offset = cubesize * landscape_width * 1;
        const camera_height = cubesize * landscape_width / 3;

        const { render: renderGame } = useGameRenderScene(
            cubesize,
            landscape_width,
            landscape_length,
            camera_offset,
            camera_height
        );

        renderGame();
    }

    return { render }
}