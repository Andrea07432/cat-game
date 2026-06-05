const MAX_OFFLINE_MS = 24 * 60 * 60 * 1000;

export class TimeSystem {
  constructor(stateManager) {
    this.stateManager = stateManager;
    this.lastSaved = Date.now();

    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        this.processOfflineTime();
      }
    });
  }

  setLastSaved(timestamp) {
    this.lastSaved = timestamp;
  }

  processOfflineTime() {
    const now = Date.now();
    const elapsed = Math.min(now - this.lastSaved, MAX_OFFLINE_MS);
    if (elapsed < 2000) return null;

    const ticks = Math.floor(elapsed / 1000);
    const state = this.stateManager.getState();

    const allHomeCats = [...state.home];
    for (const cat of allHomeCats) {
      this.applyOfflineDecay(cat, ticks);
    }

    this.lastSaved = now;

    const minutes = Math.floor(elapsed / 60000);
    if (minutes > 0) {
      const coinGain = minutes * state.home.length;
      this.stateManager.addCoins(coinGain);
    }

    return { elapsed, ticks, minutes };
  }

  applyOfflineDecay(cat, ticks) {
    const { decayRates } = cat.getBreedData();
    const baseDecay = 0.0002;

    cat.hunger = Math.max(0, cat.hunger - baseDecay * decayRates.hunger * ticks);
    cat.mood = Math.max(0, cat.mood - baseDecay * decayRates.mood * ticks);
    cat.health = Math.max(0, cat.health - baseDecay * decayRates.health * 0.3 * ticks);
  }
}
