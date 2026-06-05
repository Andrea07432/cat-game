import { BREEDS } from './breeds.js';
import { getBackstory, getRandomBackstoryId } from '../data/backstories.js';

let nextId = 1;

export class Cat {
  constructor({ id, name, breed, hunger, mood, health, affinity, status, position,
    animation, lastFed, lastPetted, lastPlayed, lastSlept, adoptedAt, fledAt,
    travelStarted, travelDestination, angryStartedAt, behaviorState, behaviorTimer,
    backstoryId }) {

    this.id = id || `cat_${nextId++}`;
    this.name = name;
    this.breed = breed;
    this.personality = BREEDS[breed].personality;
    this.backstoryId = backstoryId ?? getRandomBackstoryId(breed);

    this.hunger = hunger ?? BREEDS[breed].baseStats.hunger;
    this.mood = mood ?? BREEDS[breed].baseStats.mood;
    this.health = health ?? BREEDS[breed].baseStats.health;
    this.affinity = affinity ?? 0;

    this.status = status || 'stray';
    this.animation = animation || 'idle';
    this.position = position || { x: 100 + Math.random() * 600, y: 80 + Math.random() * 250 };

    this.lastFed = lastFed || 0;
    this.lastPetted = lastPetted || 0;
    this.lastPlayed = lastPlayed || 0;
    this.lastSlept = lastSlept || 0;
    this.adoptedAt = adoptedAt || null;
    this.fledAt = fledAt || null;
    this.travelStarted = travelStarted || null;
    this.travelDestination = travelDestination || null;
    this.angryStartedAt = angryStartedAt || null;
    this.behaviorState = behaviorState || null;
    this.behaviorTimer = behaviorTimer || 0;
  }

  getBreedData() {
    return BREEDS[this.breed];
  }

  getVisibleBackstory() {
    if (this.status === 'stray') return null;
    const story = getBackstory(this.breed, this.backstoryId);
    if (!story) return null;

    const result = {};
    result.stage1 = story.stage1;
    if (this.affinity >= 0.5) result.stage2 = story.stage2;
    if (this.affinity >= 0.8) result.stage3 = story.stage3;
    if (this.affinity >= 1.0) result.stage4 = story.stage4;
    return result;
  }

  tick(now) {
    if (this.status === 'traveling' || this.status === 'fled') return;

    const breedData = this.getBreedData();
    const baseDecay = 0.0002;

    let hungerDecay = baseDecay * breedData.decayRates.hunger;
    let moodDecay = baseDecay * breedData.decayRates.mood;
    let healthDecay = baseDecay * breedData.decayRates.health * 0.3;

    if (this.personality === 'clingy' && now - this.lastPetted > 300000) {
      moodDecay *= 1.5;
    }
    if (this.personality === 'gluttonous') {
      hungerDecay *= 1.3;
    }
    if (this.personality === 'playful' && now - this.lastPlayed > 600000) {
      moodDecay *= 1.3;
    }
    if (this.personality === 'timid') {
      moodDecay *= 1.2;
    }

    this.hunger = Math.max(0, this.hunger - hungerDecay);
    this.mood = Math.max(0, this.mood - moodDecay);
    this.health = Math.max(0, this.health - healthDecay);

    this.updateBehavior();
    this.updateStatus(now);
  }

  updateBehavior() {
    if (this.status !== 'home') return;
    if (this.animation === 'angry' || this.animation === 'sleeping') return;

    if (this.behaviorState) {
      this.behaviorTimer--;
      if (this.behaviorTimer <= 0) {
        this.behaviorState = null;
        this.animation = 'idle';
      }
      return;
    }

    if (Math.random() > 0.002) return;

    const behaviors = ['cuddly', 'rubbing', 'zoomies', 'staring', 'kneading'];
    const weights = this.getBehaviorWeights();
    const roll = Math.random();
    let sum = 0;
    for (let i = 0; i < behaviors.length; i++) {
      sum += weights[i];
      if (roll < sum) {
        this.behaviorState = behaviors[i];
        this.behaviorTimer = 20 + Math.floor(Math.random() * 40);
        if (behaviors[i] === 'zoomies') this.animation = 'happy';
        return;
      }
    }
  }

  getBehaviorWeights() {
    if (this.personality === 'clingy') return [0.35, 0.3, 0.1, 0.1, 0.15];
    if (this.personality === 'playful') return [0.1, 0.15, 0.4, 0.15, 0.2];
    if (this.personality === 'aloof') return [0.05, 0.1, 0.15, 0.5, 0.2];
    if (this.personality === 'gluttonous') return [0.2, 0.3, 0.15, 0.15, 0.2];
    if (this.personality === 'timid') return [0.15, 0.1, 0.05, 0.4, 0.3];
    return [0.2, 0.2, 0.2, 0.2, 0.2];
  }

  updateStatus(now) {
    if (this.status === 'stray') return;

    const isLow = this.hunger < 0.2 || this.mood < 0.2 || this.health < 0.2;

    if (isLow && this.status !== 'angry') {
      if (!this.angryStartedAt) {
        this.angryStartedAt = now;
      } else if (now - this.angryStartedAt > 300000) {
        this.status = 'angry';
        this.animation = 'angry';
      }
    } else if (!isLow) {
      this.angryStartedAt = null;
      if (this.status === 'angry') {
        this.status = 'home';
        this.animation = 'idle';
      }
    }

    return null;
  }

  feed(now) {
    const cooldown = this.status === 'stray' ? 10000 : 30000;
    if (now - this.lastFed < cooldown) return { success: false, reason: 'cooldown' };
    if (this.status === 'angry' && this.personality === 'aloof') {
      return { success: false, reason: 'angry' };
    }

    let hungerGain = 0.3;
    let affinityGain = 0.05;

    if (this.personality === 'gluttonous') {
      hungerGain = 0.4;
      affinityGain = 0.08;
    }

    this.hunger = Math.min(1, this.hunger + hungerGain);
    this.affinity = Math.min(1, this.affinity + affinityGain);
    this.lastFed = now;
    this.animation = 'eating';
    setTimeout(() => { if (this.animation === 'eating') this.animation = 'idle'; }, 3000);

    return { success: true, animation: 'eating' };
  }

  pet(now) {
    if (now - this.lastPetted < 15000) return { success: false, reason: 'cooldown' };
    if (this.status === 'angry') return { success: false, reason: 'angry' };

    let moodGain = 0.2;
    let affinityGain = 0.03;

    if (this.personality === 'clingy') {
      moodGain = 0.3;
      affinityGain = 0.06;
    }
    if (this.behaviorState === 'cuddly' || this.behaviorState === 'rubbing') {
      affinityGain *= 2;
      moodGain *= 1.5;
    }

    this.mood = Math.min(1, this.mood + moodGain);
    this.affinity = Math.min(1, this.affinity + affinityGain);
    this.lastPetted = now;
    this.animation = 'happy';
    this.behaviorState = null;
    this.behaviorTimer = 0;
    setTimeout(() => { if (this.animation === 'happy') this.animation = 'idle'; }, 2000);

    return { success: true, animation: 'happy' };
  }

  play(now) {
    if (now - this.lastPlayed < 45000) return { success: false, reason: 'cooldown' };
    if (this.status === 'angry') return { success: false, reason: 'angry' };

    let moodGain = 0.25;
    let affinityGain = 0.04;

    if (this.personality === 'playful') {
      affinityGain = 0.08;
    }
    if (this.behaviorState === 'zoomies') {
      affinityGain *= 2;
      moodGain *= 1.5;
    }

    this.mood = Math.min(1, this.mood + moodGain);
    this.hunger = Math.max(0, this.hunger - 0.05);
    this.affinity = Math.min(1, this.affinity + affinityGain);
    this.lastPlayed = now;
    this.animation = 'happy';
    this.behaviorState = null;
    this.behaviorTimer = 0;
    setTimeout(() => { if (this.animation === 'happy') this.animation = 'idle'; }, 3000);

    return { success: true, animation: 'happy' };
  }

  sleep(now) {
    if (now - this.lastSlept < 300000) return { success: false, reason: 'cooldown' };

    this.mood = Math.min(1, this.mood + 0.1);
    this.health = Math.min(1, this.health + 0.05);
    this.lastSlept = now;
    this.animation = 'sleeping';
    setTimeout(() => { if (this.animation === 'sleeping') this.animation = 'idle'; }, 60000);

    return { success: true, animation: 'sleeping' };
  }

  visitVet(now) {
    this.health = 1.0;
    this.mood = Math.max(0, this.mood - 0.1);
    this.animation = 'idle';
    return { success: true, cost: 10 };
  }

  canAdopt() {
    return this.status === 'stray' && this.affinity >= 0.3;
  }

  serialize() {
    return {
      id: this.id, name: this.name, breed: this.breed,
      hunger: this.hunger, mood: this.mood, health: this.health, affinity: this.affinity,
      status: this.status, animation: this.animation, position: this.position,
      lastFed: this.lastFed, lastPetted: this.lastPetted, lastPlayed: this.lastPlayed,
      lastSlept: this.lastSlept, adoptedAt: this.adoptedAt, fledAt: this.fledAt,
      travelStarted: this.travelStarted, travelDestination: this.travelDestination,
      angryStartedAt: this.angryStartedAt,
      behaviorState: this.behaviorState, behaviorTimer: this.behaviorTimer,
      backstoryId: this.backstoryId
    };
  }

  static deserialize(data) {
    return new Cat(data);
  }
}

export function setNextId(id) {
  nextId = id;
}
