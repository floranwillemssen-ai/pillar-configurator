import * as THREE from 'three';
import { scene } from '../scene/scene-setup.js';

// Werkruimte-afmetingen in meters
const GRID_WIDTH = 4;   // X-as
const GRID_DEPTH = 6;   // Z-as

// Bouw een rechthoekig grid van 4×6 meter met 1m-cellen
function createGrid() {
    const points = [];

    // Horizontale lijnen (langs de X-as, per meter in Z)
    for (let z = -GRID_DEPTH / 2; z <= GRID_DEPTH / 2; z++) {
        points.push(-GRID_WIDTH / 2, 0, z);
        points.push( GRID_WIDTH / 2, 0, z);
    }

    // Verticale lijnen (langs de Z-as, per meter in X)
    for (let x = -GRID_WIDTH / 2; x <= GRID_WIDTH / 2; x++) {
        points.push(x, 0, -GRID_DEPTH / 2);
        points.push(x, 0,  GRID_DEPTH / 2);
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
        'position',
        new THREE.Float32BufferAttribute(points.flat(), 3)
    );

    // Subtiele grijze kleur die afsteekt tegen de lichte achtergrond
    const material = new THREE.LineBasicMaterial({ color: 0xaaaaaa });

    const grid = new THREE.LineSegments(geometry, material);
    scene.add(grid);

    console.log('✓ Grid ready');
    return grid;
}

export { createGrid };
