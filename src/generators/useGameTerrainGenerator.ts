import { BoxGeometry, Mesh, MeshPhongMaterial, Object3D } from "three";
import { randomInt } from "../extensions";

export const useGameTerrainGenerator = (cubesize: number, landscape_width: number, landscape_length: number) => {
    //make this adjustable per game?
    const seed = 1;

    Math.random = randomInt(seed);

    const generateTerrain = () => {
        const cubes = new Object3D();

        const geometry = new BoxGeometry(cubesize, cubesize, cubesize);

        const xoff = landscape_width * cubesize / 2;
        const yoff = landscape_length * cubesize / 2;

        const heights: number[] = [];
        for (let width = 0; width < landscape_width; width++) heights[width] = 0;
        for (let length = 0; length < landscape_length; length++) heights[length] = 0;

        for (let width = 1; width < landscape_width; width++) {
            for (let length = 1; length < landscape_length; length++) {
                var rand = Math.random();
                if (heights[length] == heights[length - 1]) { // level ground, go up dn or stay
                    if (rand < 0.33)
                        heights[length] = heights[length] - cubesize;
                    else if (rand > 0.66)
                        heights[length] = heights[length] + cubesize;
                    else
                        heights[length] = heights[length];
                }
                else if (Math.abs(heights[length] - heights[length - 1]) > cubesize) { // two edges are wide apart, split the difference
                    heights[length] = (heights[length] + heights[length - 1]) / 2;
                }
                else {
                    if (rand > 0.5)
                        heights[length] = heights[length];
                    else
                        heights[length] = heights[length - 1];
                }

                const
                    grayness = Math.random() * 0.5 + 0.25,
                    mat = new MeshPhongMaterial(),
                    cube = new Mesh(geometry, mat);

                mat.color.setRGB(0, grayness, 0);
                cube.position.set(width * cubesize - xoff, length * cubesize - yoff, heights[length]);
                cubes.add(cube);
            }
        }
        return cubes;
    }

    const terrain = generateTerrain();

    return { terrain }
}