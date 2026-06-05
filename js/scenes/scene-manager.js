export class SceneManager {
  constructor(stateManager, renderer) {
    this.stateManager = stateManager;
    this.renderer = renderer;
    this.currentScene = 'home';

    this.tabs = document.querySelectorAll('.tab');
    this.scenes = document.querySelectorAll('.scene');

    this.tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        this.switchTo(tab.dataset.scene);
      });
    });
  }

  switchTo(sceneName) {
    this.currentScene = sceneName;

    this.tabs.forEach(t => t.classList.toggle('active', t.dataset.scene === sceneName));
    this.scenes.forEach(s => {
      const isActive = s.id === `scene-${sceneName}`;
      s.classList.toggle('active', isActive);
      s.style.display = isActive ? 'block' : 'none';
    });

    this.renderer.renderScene(sceneName);
    this.stateManager.emit('scene-changed', sceneName);
  }

  getCurrentScene() {
    return this.currentScene;
  }
}
