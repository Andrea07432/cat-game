export class Home {
  constructor(stateManager) {
    this.stateManager = stateManager;
    this.coinTickCounter = 0;
  }

  tick() {
    const now = Date.now();
    const cats = this.stateManager.getHomeCats();

    for (const cat of cats) {
      cat.tick(now);
    }

    this.coinTickCounter++;
    if (this.coinTickCounter >= 60) {
      this.coinTickCounter = 0;
      this.generateCoins(cats);
    }
  }

  generateCoins(cats) {
    let coins = 0;
    for (const cat of cats) {
      coins += cat.affinity > 0.7 ? 2 : 1;
    }
    if (coins > 0) {
      this.stateManager.addCoins(coins);
    }
  }
}
