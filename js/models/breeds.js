export const BREEDS = {
  siamese: {
    name: '暹罗猫',
    nameEn: 'Siamese',
    personality: 'clingy',
    baseStats: { hunger: 0.7, mood: 0.5, health: 0.8 },
    decayRates: { hunger: 1.2, mood: 1.5, health: 0.8 },
    travelAffinity: 0.6,
    color: '#f5e6d3',
    description: '话多又粘人，一旦认定主人就会形影不离。'
  },
  calico: {
    name: '三花猫',
    nameEn: 'Calico',
    personality: 'aloof',
    baseStats: { hunger: 0.5, mood: 0.8, health: 0.7 },
    decayRates: { hunger: 0.8, mood: 0.7, health: 1.0 },
    travelAffinity: 0.9,
    color: '#d4a574',
    description: '独立而神秘，来去自如的自由灵魂。'
  },
  american_curl: {
    name: '卷耳猫',
    nameEn: 'American Curl',
    personality: 'playful',
    baseStats: { hunger: 0.6, mood: 0.9, health: 0.7 },
    decayRates: { hunger: 1.0, mood: 1.0, health: 0.9 },
    travelAffinity: 0.4,
    color: '#c0c0c0',
    description: '耳朵可爱地向后卷曲，性格活泼又亲人。'
  },
  orange_tabby: {
    name: '橘猫',
    nameEn: 'Orange Tabby',
    personality: 'gluttonous',
    baseStats: { hunger: 0.3, mood: 0.7, health: 0.9 },
    decayRates: { hunger: 1.8, mood: 0.6, health: 0.7 },
    travelAffinity: 0.3,
    color: '#e8941a',
    description: '永远在吃或者在找吃的路上，脾气倒是很好。'
  },
  tuxedo: {
    name: '礼服猫',
    nameEn: 'Tuxedo',
    personality: 'aloof',
    baseStats: { hunger: 0.6, mood: 0.6, health: 0.8 },
    decayRates: { hunger: 0.9, mood: 1.1, health: 0.9 },
    travelAffinity: 0.8,
    color: '#1a1a1a',
    description: '优雅而独立，喜欢有自己的空间。'
  },
  persian: {
    name: '波斯猫',
    nameEn: 'Persian',
    personality: 'clingy',
    baseStats: { hunger: 0.5, mood: 0.4, health: 0.4 },
    decayRates: { hunger: 1.0, mood: 1.3, health: 1.5 },
    travelAffinity: 0.2,
    color: '#ffffff',
    description: '高贵娇气的大小姐，需要精心照顾。'
  },
  black_cat: {
    name: '黑猫',
    nameEn: 'Black Cat',
    personality: 'playful',
    baseStats: { hunger: 0.6, mood: 0.8, health: 0.8 },
    decayRates: { hunger: 1.0, mood: 0.9, health: 0.8 },
    travelAffinity: 0.7,
    color: '#2d2d2d',
    description: '神秘的夜行者，顽皮又幸运。'
  },
  tabby: {
    name: '狸花猫',
    nameEn: 'Tabby',
    personality: 'aloof',
    baseStats: { hunger: 0.6, mood: 0.7, health: 0.9 },
    decayRates: { hunger: 0.9, mood: 0.8, health: 0.6 },
    travelAffinity: 0.9,
    color: '#8b7355',
    description: '中华田园猫的代表，独立坚强又机灵。'
  },
  singapura: {
    name: '雀猫',
    nameEn: 'Singapura',
    personality: 'timid',
    baseStats: { hunger: 0.6, mood: 0.5, health: 0.7 },
    decayRates: { hunger: 1.0, mood: 1.2, health: 0.9 },
    travelAffinity: 0.3,
    color: '#d4a574',
    description: '世界上最小的猫种之一，害羞但内心温柔。'
  },
  british_shorthair: {
    name: '英短',
    nameEn: 'British Shorthair',
    personality: 'clingy',
    baseStats: { hunger: 0.5, mood: 0.7, health: 0.7 },
    decayRates: { hunger: 1.1, mood: 0.9, health: 0.9 },
    travelAffinity: 0.3,
    color: '#7a8b99',
    description: '圆滚滚的身体，温柔安静的陪伴者。'
  },
  american_shorthair: {
    name: '美短',
    nameEn: 'American Shorthair',
    personality: 'playful',
    baseStats: { hunger: 0.6, mood: 0.8, health: 0.8 },
    decayRates: { hunger: 1.0, mood: 0.8, health: 0.7 },
    travelAffinity: 0.6,
    color: '#b8b8b8',
    description: '银色虎斑花纹，活泼好动的运动健将。'
  },
  russian_blue: {
    name: '蓝猫',
    nameEn: 'Russian Blue',
    personality: 'timid',
    baseStats: { hunger: 0.6, mood: 0.5, health: 0.8 },
    decayRates: { hunger: 0.9, mood: 1.3, health: 0.8 },
    travelAffinity: 0.4,
    color: '#607080',
    description: '安静优雅的绅士，只对信任的人敞开心扉。'
  },
  ragdoll: {
    name: '布偶猫',
    nameEn: 'Ragdoll',
    personality: 'clingy',
    baseStats: { hunger: 0.5, mood: 0.6, health: 0.6 },
    decayRates: { hunger: 1.0, mood: 1.2, health: 1.1 },
    travelAffinity: 0.2,
    color: '#f5f0eb',
    description: '被抱起来就像布偶一样软，超爱撒娇。'
  },
  tortoiseshell: {
    name: '玳瑁猫',
    nameEn: 'Tortoiseshell',
    personality: 'aloof',
    baseStats: { hunger: 0.6, mood: 0.8, health: 0.8 },
    decayRates: { hunger: 0.9, mood: 1.0, health: 0.8 },
    travelAffinity: 0.8,
    color: '#4a3320',
    description: '性格多变像调色盘一样丰富，有自己的主见。'
  },
  white_cat: {
    name: '白猫',
    nameEn: 'White Cat',
    personality: 'timid',
    baseStats: { hunger: 0.6, mood: 0.5, health: 0.7 },
    decayRates: { hunger: 0.9, mood: 1.2, health: 1.0 },
    travelAffinity: 0.4,
    color: '#fafafa',
    description: '像白雪一样纯洁，小心翼翼地靠近你。'
  },
  cream_tabby: {
    name: '奶油猫',
    nameEn: 'Cream Tabby',
    personality: 'gluttonous',
    baseStats: { hunger: 0.4, mood: 0.7, health: 0.8 },
    decayRates: { hunger: 1.5, mood: 0.7, health: 0.8 },
    travelAffinity: 0.4,
    color: '#f5deb3',
    description: '奶油色的毛发配上慵懒的性格，吃饱就睡。'
  },
  silver_tabby: {
    name: '银渐层',
    nameEn: 'Silver Tabby',
    personality: 'playful',
    baseStats: { hunger: 0.6, mood: 0.8, health: 0.7 },
    decayRates: { hunger: 1.0, mood: 0.9, health: 0.9 },
    travelAffinity: 0.5,
    color: '#d8d8d8',
    description: '银灰色渐变毛发闪闪发光，好奇心旺盛。'
  },
  munchkin: {
    name: '矮脚猫',
    nameEn: 'Munchkin',
    personality: 'playful',
    baseStats: { hunger: 0.6, mood: 0.9, health: 0.7 },
    decayRates: { hunger: 1.1, mood: 0.8, health: 1.0 },
    travelAffinity: 0.3,
    color: '#c8a882',
    description: '小短腿跑起来特别可爱，精力充沛的小可爱。'
  }
};

export const BREED_KEYS = Object.keys(BREEDS);

export function getRandomBreed() {
  return BREED_KEYS[Math.floor(Math.random() * BREED_KEYS.length)];
}

export const PERSONALITIES = {
  clingy: { name: '粘人', icon: '💕' },
  aloof: { name: '高冷', icon: '😎' },
  gluttonous: { name: '贪吃', icon: '🍖' },
  playful: { name: '爱玩', icon: '🎾' },
  timid: { name: '胆小', icon: '🫣' }
};
