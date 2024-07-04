import { SphereGeometry, Mesh, MeshPhongMaterial } from "three"

export const CharacterMesh = () => {
    
    const geometry = new SphereGeometry(0.25, 24, 24);
    const material = new MeshPhongMaterial({ color: 0xffffff });

    const characterMesh: Mesh<SphereGeometry, MeshPhongMaterial> = new Mesh(geometry, material);

    return characterMesh;
}