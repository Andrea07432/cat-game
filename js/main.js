import { StateManager } from './engine/state-manager.js';
import { GameLoop } from './engine/game-loop.js';
import { TimeSystem } from './engine/time-system.js';
import { SaveLoad } from './data/save-load.js';
import { Renderer } from './ui/renderer.js';
import { HUD } from './ui/hud.js';
import { Interactions } from './ui/interactions.js';
import { SceneManager } from './scenes/scene-manager.js';
import { Backyard } from './scenes/backyard.js';
import { Home } from './scenes/home.js';
import { Cat } from './models/cat.js';
import { getRandomBreed } from './models/breeds.js';
import { getRandomName } from './data/names.js';

const stateManager = new StateManager();
const saveLoad = new SaveLoad(stateManager);
const timeSystem = new TimeSystem(stateManager);
const renderer = new Renderer(stateManager);
const hud = new HUD(stateManager);
const interactions = new Interactions(stateManager, renderer, hud);
const sceneManager = new SceneManager(stateManager, renderer);
const backyard = new Backyard(stateManager);
const home = new Home(stateManager);

function init() {
  const lastSaved = saveLoad.load();

  if (lastSaved) {
    timeSystem.setLastSaved(lastSaved);
    const offlineResult = timeSystem.processOfflineTime();
    if (offlineResult && offlineResult.minutes > 1) {
      hud.notify(`你离开了${offlineResult.minutes}分钟，猫咪们等你好久了~`);
    }
  } else {
    initNewGame();
  }

  sceneManager.switchTo('home');
  hud.updateCoins(stateManager.getState().player.coins);

  stateManager.on('cat-fled', (cat) => {
    renderer.removeCatElement(cat.id);
    interactions.deselect();
  });

  stateManager.on('cat-spawned', () => {
    if (sceneManager.getCurrentScene() === 'backyard') {
      renderer.renderScene('backyard');
    }
  });

  stateManager.on('scene-changed', () => {
    interactions.deselect();
  });

  const gameLoop = new GameLoop(onTick, onRender);
  gameLoop.start();
}

function initNewGame() {
  const breed = getRandomBreed();
  const name = getRandomName();
  const starterCat = new Cat({
    name,
    breed,
    status: 'home',
    affinity: 0.3,
    hunger: 0.8,
    mood: 0.8,
    health: 0.9,
    adoptedAt: Date.now(),
    position: { x: 350, y: 180 }
  });
  stateManager.addCatHome(starterCat);
  stateManager.addCoins(20);

  for (let i = 0; i < 2; i++) {
    backyard.forceSpawn();
  }

  hud.notify('欢迎！你收养了第一只猫咪~');
}

function onTick(tickCount) {
  home.tick();
  backyard.tick();
  saveLoad.autoSaveTick();
  interactions.update();
}

function onRender(delta) {
  const scene = sceneManager.getCurrentScene();
  renderer.renderScene(scene);
}

init();
