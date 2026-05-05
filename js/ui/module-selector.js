import * as THREE from 'three';
import ModelLoader from '../loaders/model-loader.js';
import { scene, camera } from '../scene/scene-setup.js';

const loader = new ModelLoader();
let modules = [];
let placedModels = [];

async function initModuleSelector() {
    const res = await fetch('./data/modules.json');
    modules = await res.json();
    render();
    console.log(`✓ Module selector geladen: ${modules.length} module(s)`);
}

function render() {
    const panel = document.getElementById('module-panel');
    panel.innerHTML = `
        <h3>Modules</h3>
        <div class="module-controls">
            <select id="module-select">
                <option value="">Kies een module...</option>
                ${modules.map(m => `<option value="${m.id}">${m.name}</option>`).join('')}
            </select>
            <button id="module-add-btn">+ Toevoegen</button>
        </div>
        <ul id="placed-list"></ul>
    `;
    document.getElementById('module-add-btn').addEventListener('click', addModule);
}

async function addModule() {
    const select = document.getElementById('module-select');
    const mod = modules.find(m => m.id === select.value);
    if (!mod) return;

    const btn = document.getElementById('module-add-btn');
    btn.textContent = 'Laden…';
    btn.disabled = true;

    try {
        const model = await loader.loadModel(mod.file);

        const s = mod.scale ?? 1;
        model.scale.set(s, s, s);

        const [px, py, pz] = mod.position ?? [0, 0, 0];
        model.position.set(px, py, pz);

        const [rx, ry, rz] = mod.rotation ?? [0, 0, 0];
        model.rotation.set(rx, ry, rz);

        model.traverse(child => {
            if (child.isMesh) {
                if (child.name.includes('PILLAR')) {
                    child.material = new THREE.MeshStandardMaterial({ color: 0xd0d0d0, metalness: 0.7, roughness: 0.2 });
                } else {
                    child.material = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, metalness: 0.3, roughness: 0.7 });
                }
            }
        });
        model.userData = { id: mod.id, name: mod.name };
        scene.add(model);
        fitCameraToModel(model);

        placedModels.push({ mod, model });
        addToPlacedList(mod, placedModels.length - 1);
        console.log(`✓ Module geplaatst: ${mod.name}`);
    } catch (err) {
        console.error(`✗ Module laden mislukt: ${mod.name}`, err);
        alert(`Kon module niet laden: ${mod.name}\nCheck de console voor details.`);
    } finally {
        btn.textContent = '+ Toevoegen';
        btn.disabled = false;
    }
}

function addToPlacedList(mod, index) {
    const list = document.getElementById('placed-list');
    const li = document.createElement('li');
    li.className = 'placed-item';
    li.innerHTML = `
        <span>${mod.name}</span>
        <button class="remove-btn" data-index="${index}">✕</button>
    `;
    li.querySelector('.remove-btn').addEventListener('click', (e) => {
        const i = Number(e.target.dataset.index);
        scene.remove(placedModels[i].model);
        li.remove();
        console.log(`✓ Module verwijderd: ${mod.name}`);
    });
    list.appendChild(li);
}

function applyMaterials(model, defaultColor, materialOverrides) {
    const defaultMat = new THREE.MeshStandardMaterial({ color: defaultColor, metalness: 0.1, roughness: 0.7 });
    model.traverse((child) => {
        if (!child.isMesh) return;
        const override = materialOverrides.find(o => child.name === o.meshName);
        if (override) {
            child.material = new THREE.MeshStandardMaterial({
                color: override.color,
                metalness: override.metalness ?? 0,
                roughness: override.roughness ?? 0.5
            });
        } else {
            child.material = defaultMat;
        }
    });
}

function fitCameraToModel(model) {
    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    const fov = camera.fov * (Math.PI / 180);
    let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2)) * 1.5;
    camera.position.set(center.x, center.y + maxDim * 0.5, center.z + cameraZ);
    camera.lookAt(center);
}

export { initModuleSelector };
