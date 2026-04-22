import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

class ModelLoader {
    constructor() {
        this.loader = new GLTFLoader();
        // Cache: pad → Three.js Group, zodat hetzelfde model niet twee keer geladen wordt
        this.cache = new Map();
    }

    // Laad een GLB-bestand en geef de scene-group terug als Promise
    loadModel(path) {
        if (this.cache.has(path)) {
            console.log(`✓ Model uit cache: ${path}`);
            // Kloon zodat elke aanroep een onafhankelijk object terugkrijgt
            return Promise.resolve(this.cache.get(path).clone());
        }

        return new Promise((resolve, reject) => {
            console.log(`⏳ Model laden: ${path}`);

            this.loader.load(
                path,
                (gltf) => {
                    console.log(`✓ Model geladen: ${path}`);
                    this.cache.set(path, gltf.scene);
                    resolve(gltf.scene.clone());
                },
                (progress) => {
                    if (progress.total > 0) {
                        const pct = Math.round((progress.loaded / progress.total) * 100);
                        console.log(`  → ${path}: ${pct}%`);
                    }
                },
                (error) => {
                    console.error(`✗ Model laad-fout: ${path}`, error);
                    reject(error);
                }
            );
        });
    }
}

export default ModelLoader;
