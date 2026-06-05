import { Cat } from '../models/cat.js';
import { getRandomBreed, BREED_KEYS } from '../models/breeds.js';
import { getRandomName } from '../data/names.js';

const SPAWN_MIN = 20;
const SPAWN_MAX = 40;
const STRAY_TIMEOUT = 1800;

export class Backyard {
  constructor(stateManager) {
    this.stateManager = stateManager;
    this.nextSpawnTick = this.randomSpawnDelay();
    this.tickCounter = 0;
    this.strayTimers = new Map();
  }

  randomSpawnDelay() {
    return SPAWN_MIN + Math.floor(Math.random() * (SPAWN_MAX - SPAWN_MIN));
  }

  tick() {
    this.tickCounter++;

    if (this.tickCounter >= this.nextSpawnTick) {
      this.trySpawn();
      this.tickCounter = 0;
      this.nextSpawnTick = this.randomSpawnDelay();
    }

    this.updateStrayTimers();
  }

  trySpawn() {
    const strays = this.stateManager.getBackyardCats();
    if (strays.length >= 10) return;

    this.spawnStray();
  }

  getAvailableBreed() {
    const strays = this.stateManager.getBackyardCats();
    const usedBreeds = new Set(strays.map(c => c.breed));
    const available = BREED_KEYS.filter(b => !usedBreeds.has(b));
    if (available.length === 0) return null;
    return available[Math.floor(Math.random() * available.length)];
  }

  spawnStray() {
    const breed = this.getAvailableBreed();
    if (!breed) return;

    const name = getRandomName();
    const cat = new Cat({
      name,
      breed,
      status: 'stray',
      affinity: 0,
      position: {
        x: 50 + Math.random() * 680,
        y: 60 + Math.random() * 280
      }
    });

    if (this.stateManager.addCatBackyard(cat)) {
      this.strayTimers.set(cat.id, 0);
    }
  }

  updateStrayTimers() {
    const toRemove = [];
    this.strayTimers.forEach((time, catId) => {
      this.strayTimers.set(catId, time + 1);
      if (time + 1 > STRAY_TIMEOUT) {
        toRemove.push(catId);
      }
    });

    for (const catId of toRemove) {
      const cats = this.stateManager.getBackyardCats();
      const cat = cats.find(c => c.id === catId);
      if (cat && cat.affinity < 0.3) {
        this.stateManager.removeCatBackyard(catId);
        this.strayTimers.delete(catId);
      }
    }
  }

  forceSpawn() {
    this.spawnStray();
  }
}
