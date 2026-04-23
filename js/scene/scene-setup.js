import * as THREE from 'three';

// --- Scene ---
const scene = new THREE.Scene();
scene.background = new THREE.Color('#f0f0f0');

// --- Camera ---
// Verhouding 16:9 als startwaarde; wordt bijgewerkt bij resize
const camera = new THREE.PerspectiveCamera(75, 16 / 9, 0.1, 1000);
camera.position.set(0, 5, 8);
camera.lookAt(0, 0, 0);

// --- Renderer ---
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// Schaduwen inschakelen op de renderer
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// Canvas koppelen aan de container in de HTML
const container = document.getElementById('canvas-container');
container.appendChild(renderer.domElement);

// --- Resize handler ---
// Past camera aspect-ratio en renderer afmetingen aan bij vensterwijziging
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
});

export { scene, camera, renderer };
