import * as THREE from 'three';

class ConfiguratorCore {
    constructor(scene, loader) {
        this.scene = scene;
        this.loader = loader;
        // Actieve modules: moduleId → { mesh, meta }
        this.modules = new Map();
        this._nextId = 1;
    }

    // Laad een GLB-model en voeg het toe aan de scène op de opgegeven positie/rotatie
    async addModule(type, modelId, position = { x: 0, y: 0, z: 0 }, rotation = { x: 0, y: 0, z: 0 }) {
        const path = `models/${type}/${modelId}.glb`;

        let mesh;
        try {
            mesh = await this.loader.loadModel(path);
        } catch (err) {
            console.error(`✗ addModule mislukt voor "${modelId}":`, err);
            return null;
        }

        mesh.position.set(position.x, position.y, position.z);
        mesh.rotation.set(rotation.x, rotation.y, rotation.z);

        const moduleId = `module_${this._nextId++}`;
        mesh.userData.moduleId = moduleId;

        this.scene.add(mesh);
        this.modules.set(moduleId, {
            mesh,
            meta: { type, modelId, position, rotation }
        });

        console.log(`✓ Module toegevoegd: ${moduleId} (${type}/${modelId})`);
        return moduleId;
    }

    // Verwijder een module op basis van zijn ID
    removeModule(moduleId) {
        const entry = this.modules.get(moduleId);
        if (!entry) {
            console.warn(`✗ removeModule: "${moduleId}" niet gevonden`);
            return false;
        }

        this.scene.remove(entry.mesh);
        this.modules.delete(moduleId);
        console.log(`✓ Module verwijderd: ${moduleId}`);
        return true;
    }

    // Geeft de huidige configuratie terug als JSON-klaar object
    getConfiguration() {
        const modules = [];
        for (const [moduleId, { meta }] of this.modules) {
            modules.push({ moduleId, ...meta });
        }
        return {
            totalModules: modules.length,
            modules
        };
    }

    // Verwijder alle modules uit de scène en reset de state
    clearAll() {
        for (const { mesh } of this.modules.values()) {
            this.scene.remove(mesh);
        }
        this.modules.clear();
        this._nextId = 1;
        console.log('✓ Alle modules verwijderd');
    }
}

export default ConfiguratorCore;
