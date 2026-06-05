export class StateManager {
  constructor() {
    this.state = {
      home: [],
      backyard: [],
      villa: [],
      traveling: [],
      fled: [],
      player: {
        coins: 0,
        postcards: [],
        items: []
      }
    };
    this.listeners = new Map();
  }

  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  emit(event, data) {
    const callbacks = this.listeners.get(event) || [];
    callbacks.forEach(cb => cb(data));
  }

  getState() {
    return this.state;
  }

  getHomeCats() {
    return this.state.home;
  }

  getBackyardCats() {
    return this.state.backyard;
  }

  getVillaCats() {
    return this.state.villa;
  }

  addCatHome(cat) {
    if (this.state.home.length >= 5) return false;
    cat.status = 'home';
    this.state.home.push(cat);
    this.emit('cat-adopted', cat);
    return true;
  }

  addCatBackyard(cat) {
    if (this.state.backyard.length >= 10) return false;
    cat.status = 'stray';
    this.state.backyard.push(cat);
    this.emit('cat-spawned', cat);
    return true;
  }

  removeCatBackyard(catId) {
    const idx = this.state.backyard.findIndex(c => c.id === catId);
    if (idx !== -1) {
      this.state.backyard.splice(idx, 1);
    }
  }

  removeCatHome(catId) {
    const idx = this.state.home.findIndex(c => c.id === catId);
    if (idx !== -1) {
      const cat = this.state.home.splice(idx, 1)[0];
      return cat;
    }
    return null;
  }

  sendToVilla(catId) {
    const cat = this.removeCatHome(catId);
    if (cat) {
      cat.status = 'villa';
      this.state.villa.push(cat);
      this.emit('cat-to-villa', cat);
    }
  }

  bringHomeFromVilla(catId) {
    const idx = this.state.villa.findIndex(c => c.id === catId);
    if (idx !== -1) {
      const cat = this.state.villa.splice(idx, 1)[0];
      cat.status = 'home';
      cat.position = { x: 100 + Math.random() * 600, y: 80 + Math.random() * 250 };
      this.state.home.push(cat);
      this.emit('cat-from-villa', cat);
    }
  }

  catFled(catId) {
    const cat = this.removeCatHome(catId);
    if (cat) {
      cat.status = 'fled';
      cat.fledAt = Date.now();
      this.state.fled.push(cat);
      this.emit('cat-fled', cat);
    }
  }

  catStartTravel(catId, destination) {
    const cat = this.removeCatHome(catId);
    if (cat) {
      cat.status = 'traveling';
      cat.travelStarted = Date.now();
      cat.travelDestination = destination;
      this.state.traveling.push(cat);
      this.emit('travel-started', cat);
    }
  }

  addCoins(amount) {
    this.state.player.coins += amount;
    this.emit('coins-changed', this.state.player.coins);
  }

  spendCoins(amount) {
    if (this.state.player.coins >= amount) {
      this.state.player.coins -= amount;
      this.emit('coins-changed', this.state.player.coins);
      return true;
    }
    return false;
  }
}
