// 역할군
// striker  - 딜러 (전방)
// special  - 서포터/버퍼 (후방)
// support  - 힐러/보조 (후방)

// 스킬 타입
// ex      - 필살기 (EX 코스트 소모, 수동/AUTO)
// auto    - 쿨타임마다 자동 발동
// passive - 항상 적용되는 패시브

// 효과 타입
// damage  - 피해 (multiplier: 공격력 배율)
// heal    - 회복 (multiplier: 공격력 배율)
// buff    - 버프 (stat, amount, duration)
// debuff  - 디버프 (stat, amount, duration)

export const CHARACTER_POOL = [
  {
    id: 'char_001',
    name: '아리아',
    rarity: 3,
    element: 'light',
    role: 'support',
    image: '/characters/char_001.png',
    description: '빛을 다루는 신비로운 소녀. 아군을 치유하며 전장을 지원한다.',
    baseStats: { hp: 1800, atk: 220, def: 140, speed: 1.0 },
    skills: {
      ex: {
        name: '성광 치유',
        description: '아군 전체의 HP를 ATK × 3.5 만큼 회복한다.',
        cost: 5,
        type: 'ex',
        effect: { type: 'heal', target: 'all_ally', multiplier: 3.5 },
      },
      skill1: {
        name: '빛의 파동',
        description: '가장 HP가 낮은 아군 1명을 ATK × 1.8 만큼 회복한다.',
        type: 'auto',
        cooldown: 12,
        effect: { type: 'heal', target: 'lowest_hp_ally', multiplier: 1.8 },
      },
      skill2: {
        name: '빛의 가호',
        description: '전투 시작 시 아군 전체 방어력 15% 증가.',
        type: 'passive',
        effect: { type: 'buff', target: 'all_ally', stat: 'def', amount: 0.15, duration: Infinity },
      },
    },
  },
  {
    id: 'char_002',
    name: '레나',
    rarity: 3,
    element: 'fire',
    role: 'striker',
    image: '/characters/char_002.png',
    description: '불꽃처럼 타오르는 전사. 강력한 단일 공격을 자랑한다.',
    baseStats: { hp: 1200, atk: 380, def: 100, speed: 1.2 },
    skills: {
      ex: {
        name: '폭염 참격',
        description: '적 1명에게 ATK × 6.0 의 화염 피해를 입힌다.',
        cost: 4,
        type: 'ex',
        effect: { type: 'damage', target: 'single_enemy', multiplier: 6.0 },
      },
      skill1: {
        name: '연속 베기',
        description: '적 1명에게 ATK × 1.5 의 피해를 2회 입힌다.',
        type: 'auto',
        cooldown: 8,
        effect: { type: 'damage', target: 'single_enemy', multiplier: 1.5, hits: 2 },
      },
      skill2: {
        name: '전투 본능',
        description: 'HP 50% 이하일 때 공격력 20% 증가.',
        type: 'passive',
        effect: { type: 'buff', target: 'self', stat: 'atk', amount: 0.20, condition: 'hp_below_50' },
      },
    },
  },
  {
    id: 'char_003',
    name: '시아',
    rarity: 2,
    element: 'water',
    role: 'special',
    image: '/characters/char_003.png',
    description: '물의 흐름을 자유자재로 다루는 마법사. 적을 둔화시킨다.',
    baseStats: { hp: 1000, atk: 260, def: 120, speed: 0.9 },
    skills: {
      ex: {
        name: '빙결 폭풍',
        description: '적 전체에게 ATK × 2.5 피해 + 5초간 속도 30% 감소.',
        cost: 5,
        type: 'ex',
        effect: {
          type: 'damage',
          target: 'all_enemy',
          multiplier: 2.5,
          secondary: { type: 'debuff', stat: 'speed', amount: -0.30, duration: 5 },
        },
      },
      skill1: {
        name: '물의 채찍',
        description: '적 1명에게 ATK × 2.0 의 피해를 입힌다.',
        type: 'auto',
        cooldown: 10,
        effect: { type: 'damage', target: 'single_enemy', multiplier: 2.0 },
      },
      skill2: {
        name: '흐름의 직관',
        description: '공격 시 10% 확률로 추가 타격 발생.',
        type: 'passive',
        effect: { type: 'proc', chance: 0.10, trigger: 'on_attack', multiplier: 1.0 },
      },
    },
  },
  {
    id: 'char_004',
    name: '루나',
    rarity: 2,
    element: 'wind',
    role: 'striker',
    image: '/characters/char_004.png',
    description: '바람처럼 날렵한 궁수. 빠른 공격 속도가 장점.',
    baseStats: { hp: 900, atk: 280, def: 90, speed: 1.5 },
    skills: {
      ex: {
        name: '폭풍 연사',
        description: '적 전체에게 ATK × 1.8 의 피해를 3회 입힌다.',
        cost: 4,
        type: 'ex',
        effect: { type: 'damage', target: 'all_enemy', multiplier: 1.8, hits: 3 },
      },
      skill1: {
        name: '관통 화살',
        description: '적 1명에게 ATK × 2.2 의 피해를 입힌다. 방어력 무시 20%.',
        type: 'auto',
        cooldown: 9,
        effect: { type: 'damage', target: 'single_enemy', multiplier: 2.2, defPen: 0.20 },
      },
      skill2: {
        name: '질풍 보법',
        description: '공격 속도 항상 10% 증가.',
        type: 'passive',
        effect: { type: 'buff', target: 'self', stat: 'speed', amount: 0.10, duration: Infinity },
      },
    },
  },
  {
    id: 'char_005',
    name: '에리카',
    rarity: 1,
    element: 'dark',
    role: 'striker',
    image: '/characters/char_005.png',
    description: '어둠 속에서 홀로 싸우는 검사.',
    baseStats: { hp: 1100, atk: 200, def: 110, speed: 1.0 },
    skills: {
      ex: {
        name: '암흑 일섬',
        description: '적 1명에게 ATK × 4.5 의 암흑 피해를 입힌다.',
        cost: 3,
        type: 'ex',
        effect: { type: 'damage', target: 'single_enemy', multiplier: 4.5 },
      },
      skill1: {
        name: '그림자 베기',
        description: '적 1명에게 ATK × 1.6 의 피해를 입힌다.',
        type: 'auto',
        cooldown: 10,
        effect: { type: 'damage', target: 'single_enemy', multiplier: 1.6 },
      },
      skill2: {
        name: '어둠의 의지',
        description: '전투 시작 시 공격력 10% 증가.',
        type: 'passive',
        effect: { type: 'buff', target: 'self', stat: 'atk', amount: 0.10, duration: Infinity },
      },
    },
  },
  {
    id: 'char_006',
    name: '미아',
    rarity: 1,
    element: 'fire',
    role: 'special',
    image: '/characters/char_006.png',
    description: '견습 마법사. 아직 배울 게 많지만 열정만큼은 최고.',
    baseStats: { hp: 800, atk: 180, def: 80, speed: 0.85 },
    skills: {
      ex: {
        name: '불꽃 폭발',
        description: '적 전체에게 ATK × 2.0 의 화염 피해를 입힌다.',
        cost: 3,
        type: 'ex',
        effect: { type: 'damage', target: 'all_enemy', multiplier: 2.0 },
      },
      skill1: {
        name: '화염구',
        description: '적 1명에게 ATK × 1.4 의 피해를 입힌다.',
        type: 'auto',
        cooldown: 11,
        effect: { type: 'damage', target: 'single_enemy', multiplier: 1.4 },
      },
      skill2: {
        name: '마법 적성',
        description: '스킬 피해 5% 증가.',
        type: 'passive',
        effect: { type: 'buff', target: 'self', stat: 'skillDmg', amount: 0.05, duration: Infinity },
      },
    },
  },
]

export const RARITY_RATES = {
  3: 0.03,
  2: 0.12,
  1: 0.85,
}

export const RARITY_COLOR = {
  3: '#FFD700',
  2: '#C084FC',
  1: '#60A5FA',
}

export const ELEMENT_COLOR = {
  fire:  '#FF6B35',
  water: '#4FC3F7',
  wind:  '#81C784',
  light: '#FFF176',
  dark:  '#CE93D8',
}

export const ROLE_LABEL = {
  striker: '스트라이커',
  special: '스페셜',
  support: '서포트',
}

export const ROLE_COLOR = {
  striker: '#FF6B6B',
  special: '#FFD93D',
  support: '#6BCB77',
}

// 레벨별 스탯 배율 (레벨 1 기준, 레벨업마다 5% 증가)
export function getStatAtLevel(baseStat, level) {
  return Math.floor(baseStat * (1 + (level - 1) * 0.05))
}
