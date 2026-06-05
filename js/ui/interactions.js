export class Interactions {
  constructor(stateManager, renderer, hud) {
    this.stateManager = stateManager;
    this.renderer = renderer;
    this.hud = hud;
    this.selectedCat = null;
    this.currentScene = 'home';
    this.actionButtonsEl = document.getElementById('action-buttons');

    this.setupClickHandlers();
  }

  setupClickHandlers() {
    const homeScene = document.getElementById('scene-home');
    const backyardScene = document.getElementById('scene-backyard');
    const villaScene = document.getElementById('scene-villa');

    homeScene.addEventListener('click', (e) => this.handleSceneClick(e, 'home'));
    backyardScene.addEventListener('click', (e) => this.handleSceneClick(e, 'backyard'));
    villaScene.addEventListener('click', (e) => this.handleSceneClick(e, 'villa'));
  }

  getCatsForScene(scene) {
    if (scene === 'home') return this.stateManager.getHomeCats();
    if (scene === 'backyard') return this.stateManager.getBackyardCats();
    if (scene === 'villa') return this.stateManager.getVillaCats();
    return [];
  }

  handleSceneClick(e, scene) {
    const catEl = e.target.closest('.cat-sprite');
    if (catEl) {
      const catId = catEl.dataset.id;
      const cats = this.getCatsForScene(scene);
      const cat = cats.find(c => c.id === catId);
      if (cat) this.selectCat(cat, scene);
    } else {
      this.deselect();
    }
  }

  selectCat(cat, scene) {
    this.selectedCat = cat;
    this.currentScene = scene;
    this.renderer.selectCat(cat.id);
    this.hud.showCatInfo(cat);
    this.renderActions(cat, scene);
  }

  deselect() {
    this.selectedCat = null;
    this.renderer.deselectAll();
    this.hud.hideCatInfo();
    this.actionButtonsEl.innerHTML = '';
  }

  renderActions(cat, scene) {
    this.actionButtonsEl.innerHTML = '';
    const now = Date.now();

    if (scene === 'backyard') {
      this.addButton('🍖 喂食', () => this.doFeed(cat), now - cat.lastFed < 10000);
      if (cat.canAdopt()) {
        this.addButton('🏠 带回家', () => this.doAdopt(cat), false);
      } else {
        this.addProgressHint(cat);
      }
    } else if (scene === 'villa') {
      this.addButton('🏠 接回家', () => this.doBringHome(cat),
        this.stateManager.getState().home.length >= 5);
    } else {
      this.addButton('🍖 喂食', () => this.doFeed(cat), now - cat.lastFed < 30000);
      this.addButton('🤚 抚摸', () => this.doPet(cat), now - cat.lastPetted < 15000);
      this.addButton('🎾 玩耍', () => this.doPlay(cat), now - cat.lastPlayed < 45000);
      this.addButton('😴 哄睡', () => this.doSleep(cat), now - cat.lastSlept < 300000);
      this.addButton('🏥 看病 (10🪙)', () => this.doVet(cat),
        this.stateManager.getState().player.coins < 10);
      this.addButton('🏡 送去别墅', () => this.doSendToVilla(cat), cat.affinity < 1.0);
      if (cat.behaviorState) {
        this.showBehaviorHint(cat);
      }
    }
  }

  addProgressHint(cat) {
    const progress = Math.round(cat.affinity / 0.3 * 100);
    const hint = document.createElement('span');
    hint.className = 'adopt-progress';
    hint.textContent = `好感度 ${Math.min(progress, 100)}% — 继续喂食来获取信任~`;
    this.actionButtonsEl.appendChild(hint);
  }

  addButton(label, onClick, disabled) {
    const btn = document.createElement('button');
    btn.className = 'action-btn';
    btn.textContent = label;
    btn.disabled = disabled;
    if (disabled) btn.classList.add('on-cooldown');
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      onClick();
    });
    this.actionButtonsEl.appendChild(btn);
  }

  doFeed(cat) {
    const result = cat.feed(Date.now());
    if (result.success) {
      this.renderer.showReaction(cat.id, '🍖');
      this.hud.notify(`${cat.name} 吃得很开心！`);
      this.afterAction(cat);
    } else if (result.reason === 'cooldown') {
      this.hud.notify('刚喂过，等一会儿再喂吧~');
    } else if (result.reason === 'angry') {
      this.hud.notify(`${cat.name} 正在生气，不想吃东西...`);
    }
  }

  doPet(cat) {
    const result = cat.pet(Date.now());
    if (result.success) {
      this.renderer.showReaction(cat.id, '💕');
      this.hud.notify(`${cat.name} 发出了呼噜声~`);
      this.afterAction(cat);
    } else if (result.reason === 'cooldown') {
      this.hud.notify('刚摸过啦，给它点空间~');
    } else if (result.reason === 'angry') {
      this.hud.notify(`${cat.name} 对你呲牙，现在不想被摸！`);
    }
  }

  doPlay(cat) {
    const result = cat.play(Date.now());
    if (result.success) {
      this.renderer.showReaction(cat.id, '🎾');
      this.hud.notify(`${cat.name} 玩得很开心！`);
      this.afterAction(cat);
    } else if (result.reason === 'cooldown') {
      this.hud.notify('它有点累了，休息一下~');
    } else if (result.reason === 'angry') {
      this.hud.notify(`${cat.name} 不想理你...`);
    }
  }

  doSleep(cat) {
    const result = cat.sleep(Date.now());
    if (result.success) {
      this.renderer.showReaction(cat.id, '💤');
      this.hud.notify(`${cat.name} 打了个哈欠，睡着了 zzz`);
      this.afterAction(cat);
    } else if (result.reason === 'cooldown') {
      this.hud.notify('它还不困，再等等~');
    }
  }

  doVet(cat) {
    if (this.stateManager.spendCoins(10)) {
      cat.visitVet(Date.now());
      this.renderer.showReaction(cat.id, '💊');
      this.hud.notify(`${cat.name} 看完了医生，健康满满！`);
      this.afterAction(cat);
    } else {
      this.hud.notify('金币不够呢...');
    }
  }

  doAdopt(cat) {
    const state = this.stateManager.getState();
    if (state.home.length >= 5) {
      this.hud.notify('家里最多养5只猫哦~');
      return;
    }

    this.stateManager.removeCatBackyard(cat.id);
    this.renderer.removeCatElement(cat.id);
    cat.adoptedAt = Date.now();
    cat.status = 'home';
    cat.position = { x: 100 + Math.random() * 600, y: 80 + Math.random() * 250 };
    this.stateManager.addCatHome(cat);
    this.hud.notify(`${cat.name} 被你带回家啦！`);
    this.deselect();
  }

  doSendToVilla(cat) {
    this.renderer.showReaction(cat.id, '🏡');
    this.stateManager.sendToVilla(cat.id);
    this.renderer.removeCatElement(cat.id);
    this.hud.notify(`${cat.name} 去别墅休息啦，随时可以接回来~`);
    this.deselect();
  }

  doBringHome(cat) {
    const state = this.stateManager.getState();
    if (state.home.length >= 5) {
      this.hud.notify('家里最多养5只猫哦，先送一只去别墅吧~');
      return;
    }
    this.stateManager.bringHomeFromVilla(cat.id);
    this.renderer.removeCatElement(cat.id);
    this.hud.notify(`${cat.name} 回家啦！`);
    this.deselect();
  }

  showBehaviorHint(cat) {
    const hints = {
      cuddly: '💗 正在撒娇求抱抱~',
      rubbing: '🐱 主动来蹭你了！',
      zoomies: '⚡ 突然开始发疯跑酷！',
      staring: '👀 正一动不动地盯着你看...',
      kneading: '🐾 在你腿上踩奶呢~'
    };
    const hint = document.createElement('span');
    hint.className = 'behavior-hint';
    hint.textContent = hints[cat.behaviorState] || '';
    if (hint.textContent) {
      this.actionButtonsEl.appendChild(hint);
    }
  }

  afterAction(cat) {
    this.hud.updateBars(cat);
    this.renderActions(cat, this.currentScene);
  }

  update() {
    if (this.selectedCat) {
      this.hud.updateBars(this.selectedCat);
    }
  }
}
