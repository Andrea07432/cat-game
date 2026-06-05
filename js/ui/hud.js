import { BREEDS, PERSONALITIES } from '../models/breeds.js';

export class HUD {
  constructor(stateManager) {
    this.stateManager = stateManager;
    this.catInfo = document.getElementById('cat-info');
    this.catNameEl = document.getElementById('cat-name');
    this.catBreedEl = document.getElementById('cat-breed');
    this.hungerBar = document.getElementById('hunger-bar');
    this.moodBar = document.getElementById('mood-bar');
    this.healthBar = document.getElementById('health-bar');
    this.affinityBar = document.getElementById('affinity-bar');
    this.hungerValue = document.getElementById('hunger-value');
    this.moodValue = document.getElementById('mood-value');
    this.healthValue = document.getElementById('health-value');
    this.affinityValue = document.getElementById('affinity-value');
    this.backstoryEl = document.getElementById('cat-backstory');
    this.coinCountEl = document.getElementById('coin-count');
    this.notificationArea = document.getElementById('notification-area');

    stateManager.on('coins-changed', (coins) => this.updateCoins(coins));
  }

  showCatInfo(cat) {
    this.catInfo.classList.remove('hidden');
    const breed = BREEDS[cat.breed];
    const personality = PERSONALITIES[cat.personality];

    this.catNameEl.textContent = cat.name;
    const statusTag = cat.status === 'villa' ? ' · 💤休息中' : '';
    this.catBreedEl.textContent = `${breed.name} · ${personality.icon}${personality.name}${statusTag}`;

    this.updateBars(cat);
    this.renderBackstory(cat);
  }

  renderBackstory(cat) {
    const backstory = cat.getVisibleBackstory();
    if (!backstory) {
      this.backstoryEl.classList.add('hidden');
      return;
    }

    this.backstoryEl.classList.remove('hidden');
    let html = '';

    if (backstory.stage1) {
      html += `<div class="backstory-stage">`;
      html += `<span class="backstory-label">📋 初印象</span>`;
      html += `<p>性格：${backstory.stage1.personality}</p>`;
      html += `<p>喜欢吃：${backstory.stage1.favoriteFood}</p>`;
      html += `<p>喜欢：${backstory.stage1.favoriteActivity}</p>`;
      html += `</div>`;
    }

    if (backstory.stage2) {
      html += `<div class="backstory-stage stage-unlocked">`;
      html += `<span class="backstory-label">📖 过去的经历</span>`;
      html += `<p>${backstory.stage2.background}</p>`;
      html += `</div>`;
    }

    if (backstory.stage3) {
      html += `<div class="backstory-stage stage-unlocked">`;
      html += `<span class="backstory-label">💛 真实的它</span>`;
      html += `<p>${backstory.stage3.truePersonality}</p>`;
      html += `<p>最喜欢：${backstory.stage3.favoriteHomeActivity}</p>`;
      html += `</div>`;
    }

    if (backstory.stage4) {
      html += `<div class="backstory-stage stage-final">`;
      html += `<span class="backstory-label">💕 对你的看法</span>`;
      html += `<p>${backstory.stage4.opinionOfYou}</p>`;
      html += `</div>`;
    }

    this.backstoryEl.innerHTML = html;
  }

  updateBars(cat) {
    this.hungerBar.style.width = `${cat.hunger * 100}%`;
    this.moodBar.style.width = `${cat.mood * 100}%`;
    this.healthBar.style.width = `${cat.health * 100}%`;
    this.affinityBar.style.width = `${cat.affinity * 100}%`;

    this.hungerValue.textContent = `${Math.round(cat.hunger * 100)}%`;
    this.moodValue.textContent = `${Math.round(cat.mood * 100)}%`;
    this.healthValue.textContent = `${Math.round(cat.health * 100)}%`;
    this.affinityValue.textContent = `${Math.round(cat.affinity * 100)}%`;

    this.hungerBar.style.background = cat.hunger < 0.2 ? '#e94560' : '#e8941a';
    this.moodBar.style.background = cat.mood < 0.2 ? '#e94560' : '#4ecdc4';
    this.healthBar.style.background = cat.health < 0.2 ? '#e94560' : '#45b7d1';
  }

  hideCatInfo() {
    this.catInfo.classList.add('hidden');
    this.backstoryEl.classList.add('hidden');
  }

  updateCoins(coins) {
    this.coinCountEl.textContent = coins;
  }

  notify(message) {
    const el = document.createElement('div');
    el.className = 'notification';
    el.textContent = message;
    this.notificationArea.appendChild(el);
    setTimeout(() => {
      if (el.parentElement) el.parentElement.removeChild(el);
    }, 3000);
  }
}
