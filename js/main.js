import * as THREE from 'three';
import { scene, camera, renderer } from './scene/scene-setup.js';
import { ambientLight, directionalLight } from './scene/lighting.js';
import { controls } from './controls/orbit-controls.js';
import { createGrid } from './ui/grid-renderer.js';
import { createQuoteForm } from './ui/quote-form.js';

console.log('✓ Scene initialized');

// --- Verlichting toevoegen aan de scène ---
scene.add(ambientLight);
scene.add(directionalLight);

console.log('✓ Lighting setup complete');

// --- Grid toevoegen aan de scène ---
createGrid();

// --- Offerteformulier initialiseren in #quote-form-container ---
createQuoteForm();
console.log('✓ Quote form loaded');

// --- TIJDELIJK: test-kubus om OrbitControls te testen ---
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshStandardMaterial({ color: 0xff0000 });
const testCube = new THREE.Mesh(geometry, material);
scene.add(testCube);

// --- Animatieloop ---
function animate() {
    requestAnimationFrame(animate);

    // Damping vereist dat controls elke frame bijgewerkt worden
    controls.update();

    renderer.render(scene, camera);
}

// Meteen starten zodra de pagina laadt
animate();

console.log('✓ Animation loop running');
