import * as THREE from 'three';

// --- Omgevingslicht: verlicht alle objecten gelijkmatig zonder schaduw ---
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);

// --- Directioneel licht: simuleert zonlicht met richting en schaduw ---
const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
directionalLight.position.set(5, 10, 5);

// Schaduwen inschakelen (klaar voor 3D-modellen)
directionalLight.castShadow = true;

// Schaduwcamera instellen zodat schaduwen goed vallen over het scène-gebied
directionalLight.shadow.camera.near = 0.1;
directionalLight.shadow.camera.far = 50;
directionalLight.shadow.camera.left = -10;
directionalLight.shadow.camera.right = 10;
directionalLight.shadow.camera.top = 10;
directionalLight.shadow.camera.bottom = -10;

// Hogere resolutie voor scherpere schaduwen
directionalLight.shadow.mapSize.width = 2048;
directionalLight.shadow.mapSize.height = 2048;

export { ambientLight, directionalLight };
