import { scene, camera, renderer } from './scene/scene-setup.js';
import { ambientLight, directionalLight } from './scene/lighting.js';
import { controls } from './controls/orbit-controls.js';
import { createGrid } from './ui/grid-renderer.js';
import { createQuoteForm } from './ui/quote-form.js';
import { initModuleSelector } from './ui/module-selector.js';

scene.add(ambientLight);
scene.add(directionalLight);
createGrid();
createQuoteForm();
initModuleSelector();

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}
animate();

console.log('✓ Configurator klaar');
