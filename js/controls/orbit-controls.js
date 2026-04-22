import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { camera, renderer } from '../scene/scene-setup.js';

// --- OrbitControls: muis/touch interactie voor camera ---
const controls = new OrbitControls(camera, renderer.domElement);

// Afstandslimieten (hoe dicht/ver de camera kan zoomen)
controls.minDistance = 2;
controls.maxDistance = 50;

// Auto-rotate uitgeschakeld
controls.autoRotate = false;

// Pan en zoom ingeschakeld (standaard, expliciet voor duidelijkheid)
controls.enablePan = true;
controls.enableZoom = true;

// Smooth damping: camera beweegt vloeiend na loslaten
controls.enableDamping = true;
controls.dampingFactor = 0.05;

console.log('✓ OrbitControls ready');

export { controls };
