import ModelLoader from '../loaders/model-loader.js';
import { scene } from '../scene/scene-setup.js';

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
        model.scale.setScalar(mod.scale ?? 1);
        // Spreid geplaatste modellen uit zodat ze niet overlappen
        model.position.set(placedModels.length * 1.5, 0, 0);
        model.userData = { id: mod.id, name: mod.name };
        scene.add(model);

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

export { initModuleSelector };
