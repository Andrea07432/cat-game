import { Cat, setNextId } from '../models/cat.js';
import { getRandomBackstoryId } from '../data/backstories.js';

const SAVE_KEY = 'cat-game-save';
const BACKUP_KEY = 'cat-game-save-backup';
const CURRENT_VERSION = 2;

export class SaveLoad {
  constructor(stateManager) {
    this.stateManager = stateManager;
    this.autoSaveCounter = 0;

    window.addEventListener('beforeunload', () => this.save());
  }

  save() {
    const state = this.stateManager.getState();
    const data = {
      version: CURRENT_VERSION,
      lastSaved: Date.now(),
      player: { ...state.player },
      cats: {
        home: state.home.map(c => c.serialize()),
        backyard: state.backyard.map(c => c.serialize()),
        villa: state.villa.map(c => c.serialize()),
        traveling: state.traveling.map(c => c.serialize()),
        fled: state.fled.map(c => c.serialize())
      }
    };

    try {
      const json = JSON.stringify(data);
      const existing = localStorage.getItem(SAVE_KEY);
      if (existing) {
        localStorage.setItem(BACKUP_KEY, existing);
      }
      localStorage.setItem(SAVE_KEY, json);
    } catch (e) {
      console.error('Save failed:', e);
    }
  }

  load() {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return null;

      let data = JSON.parse(raw);
      if (data.version < CURRENT_VERSION) {
        data = this.migrate(data);
      }

      const state = this.stateManager.getState();
      state.player = data.player;

      let maxId = 0;
      const deserializeCats = (arr) => arr.map(d => {
        const num = parseInt(d.id.replace('cat_', ''));
        if (num > maxId) maxId = num;
        return Cat.deserialize(d);
      });

      state.home = deserializeCats(data.cats.home);
      state.backyard = deserializeCats(data.cats.backyard);
      state.villa = deserializeCats(data.cats.villa || []);
      state.traveling = deserializeCats(data.cats.traveling);
      state.fled = deserializeCats(data.cats.fled);

      setNextId(maxId + 1);

      return data.lastSaved;
    } catch (e) {
      console.error('Load failed, trying backup:', e);
      return this.loadBackup();
    }
  }

  loadBackup() {
    try {
      const raw = localStorage.getItem(BACKUP_KEY);
      if (!raw) return null;
      const data = JSON.parse(raw);
      localStorage.setItem(SAVE_KEY, raw);
      return this.load();
    } catch (e) {
      console.error('Backup load also failed:', e);
      return null;
    }
  }

  migrate(data) {
    if (data.version < 2) {
      const migrateCatArray = (arr) => {
        if (!arr) return [];
        return arr.map(cat => {
          if (cat.breed === 'scottish_fold') {
            cat.breed = 'american_curl';
          }
          if (cat.backstoryId === undefined || cat.backstoryId === null) {
            cat.backstoryId = getRandomBackstoryId(cat.breed);
          }
          return cat;
        });
      };
      if (data.cats) {
        data.cats.home = migrateCatArray(data.cats.home);
        data.cats.backyard = migrateCatArray(data.cats.backyard);
        data.cats.villa = migrateCatArray(data.cats.villa);
        data.cats.traveling = migrateCatArray(data.cats.traveling);
        data.cats.fled = migrateCatArray(data.cats.fled);
      }
      data.version = 2;
    }
    return data;
  }

  autoSaveTick() {
    this.autoSaveCounter++;
    if (this.autoSaveCounter >= 30) {
      this.save();
      this.autoSaveCounter = 0;
    }
  }
}
