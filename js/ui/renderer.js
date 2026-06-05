export class Renderer {
  constructor(stateManager) {
    this.stateManager = stateManager;
    this.homeScene = document.getElementById('scene-home');
    this.backyardScene = document.getElementById('scene-backyard');
    this.villaScene = document.getElementById('scene-villa');
    this.catElements = new Map();
  }

  createCatElement(cat) {
    const el = document.createElement('div');
    el.className = 'cat-sprite';
    el.dataset.id = cat.id;
    el.dataset.breed = cat.breed;
    el.dataset.animation = cat.animation;

    el.innerHTML = `
      <div class="cat-body">
        <div class="cat-eyes">
          <div class="cat-eye"></div>
          <div class="cat-eye"></div>
        </div>
        <div class="cat-tail"></div>
      </div>
    `;

    el.style.left = `${cat.position.x}px`;
    el.style.top = `${cat.position.y}px`;

    this.catElements.set(cat.id, el);
    return el;
  }

  getContainerForScene(sceneName) {
    if (sceneName === 'home') return this.homeScene;
    if (sceneName === 'villa') return this.villaScene;
    return this.backyardScene;
  }

  getCatsForScene(sceneName) {
    if (sceneName === 'home') return this.stateManager.getHomeCats();
    if (sceneName === 'villa') return this.stateManager.getVillaCats();
    return this.stateManager.getBackyardCats();
  }

  renderScene(sceneName) {
    const container = this.getContainerForScene(sceneName);
    const cats = this.getCatsForScene(sceneName);

    const currentIds = new Set(cats.map(c => c.id));

    this.catElements.forEach((el, id) => {
      if (!currentIds.has(id) && el.parentElement === container) {
        container.removeChild(el);
        this.catElements.delete(id);
      }
    });

    for (const cat of cats) {
      let el = this.catElements.get(cat.id);
      if (!el) {
        el = this.createCatElement(cat);
        container.appendChild(el);
      }
      el.dataset.animation = cat.animation;
      el.style.left = `${cat.position.x}px`;
      el.style.top = `${cat.position.y}px`;
    }
  }

  selectCat(catId) {
    this.catElements.forEach((el) => el.classList.remove('selected'));
    const el = this.catElements.get(catId);
    if (el) el.classList.add('selected');
  }

  deselectAll() {
    this.catElements.forEach((el) => el.classList.remove('selected'));
  }

  removeCatElement(catId) {
    const el = this.catElements.get(catId);
    if (el && el.parentElement) {
      el.parentElement.removeChild(el);
    }
    this.catElements.delete(catId);
  }

  showReaction(catId, emoji) {
    const el = this.catElements.get(catId);
    if (!el) return;

    const reaction = document.createElement('div');
    reaction.className = 'cat-reaction';
    reaction.textContent = emoji;
    el.appendChild(reaction);

    setTimeout(() => {
      if (reaction.parentElement) reaction.parentElement.removeChild(reaction);
    }, 1500);
  }
}
