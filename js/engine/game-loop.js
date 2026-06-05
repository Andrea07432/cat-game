export class GameLoop {
  constructor(onTick, onRender) {
    this.onTick = onTick;
    this.onRender = onRender;
    this.lastTimestamp = 0;
    this.accumulated = 0;
    this.tickRate = 1000;
    this.running = false;
    this.tickCount = 0;
    this._frame = this._frame.bind(this);
  }

  start() {
    this.running = true;
    this.lastTimestamp = performance.now();
    requestAnimationFrame(this._frame);
  }

  stop() {
    this.running = false;
  }

  _frame(timestamp) {
    if (!this.running) return;

    const delta = timestamp - this.lastTimestamp;
    this.lastTimestamp = timestamp;
    this.accumulated += delta;

    while (this.accumulated >= this.tickRate) {
      this.tickCount++;
      this.onTick(this.tickCount);
      this.accumulated -= this.tickRate;
    }

    this.onRender(delta);
    requestAnimationFrame(this._frame);
  }
}
