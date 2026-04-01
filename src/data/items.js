// ===== 장비 아이템 데이터 =====
// 각 아이템은 슬롯, 희귀도, 스탯 보너스 보유

export const ITEM_RARITY = {
  1: { label: '일반',  color: '#9ca3af' },
  2: { label: '고급',  color: '#6BCB77' },
  3: { label: '희귀',  color: '#4FC3F7' },
  4: { label: '영웅',  color: '#c084fc' },
  5: { label: '전설',  color: '#f5c518' },
}

// 슬롯별 기본 스탯
const SLOT_STAT = {
  weapon:     'atk',
  armor:      'def',
  helmet:     'hp',
  boots:      'speed',
  accessory1: 'atk',
  accessory2: 'hp',
}

export const ITEMS = [
  // ── 무기 ──────────────────────────────────────────
  {
    id: 'iron_sword',
    name: '철제 검',
    slot: 'weapon',
    rarity: 1,
    icon: '⚔️',
    description: '단단하게 벼린 철제 검. 기본적인 공격력을 제공한다.',
    stats: { atk: 30 },
  },
  {
    id: 'silver_sword',
    name: '은제 검',
    slot: 'weapon',
    rarity: 2,
    icon: '⚔️',
    description: '은으로 제작된 검. 마물에게 효과적이다.',
    stats: { atk: 65 },
  },
  {
    id: 'battle_axe',
    name: '전투 도끼',
    slot: 'weapon',
    rarity: 2,
    icon: '🪓',
    description: '전장에서 사용되는 무거운 도끼.',
    stats: { atk: 70, def: -10 },
  },
  {
    id: 'enchanted_blade',
    name: '마력 검',
    slot: 'weapon',
    rarity: 3,
    icon: '⚔️',
    description: '마력이 깃든 검. 공격력이 크게 증가한다.',
    stats: { atk: 120, hp: 50 },
  },
  {
    id: 'hero_spear',
    name: '영웅의 창',
    slot: 'weapon',
    rarity: 4,
    icon: '🗡️',
    description: '과거 영웅이 사용했다는 전설의 창.',
    stats: { atk: 200, def: 20 },
  },

  // ── 갑옷 ──────────────────────────────────────────
  {
    id: 'leather_armor',
    name: '가죽 갑옷',
    slot: 'armor',
    rarity: 1,
    icon: '🛡️',
    description: '가볍고 기동성 좋은 가죽 갑옷.',
    stats: { def: 25 },
  },
  {
    id: 'chain_mail',
    name: '사슬 갑옷',
    slot: 'armor',
    rarity: 2,
    icon: '🛡️',
    description: '금속 고리를 엮어 만든 갑옷.',
    stats: { def: 55, hp: 100 },
  },
  {
    id: 'plate_armor',
    name: '판금 갑옷',
    slot: 'armor',
    rarity: 3,
    icon: '🛡️',
    description: '판금으로 제작된 견고한 갑옷.',
    stats: { def: 100, hp: 250 },
  },
  {
    id: 'guardian_plate',
    name: '수호자의 갑주',
    slot: 'armor',
    rarity: 4,
    icon: '🛡️',
    description: '수호의 정령이 깃든 전설의 갑주.',
    stats: { def: 180, hp: 500 },
  },

  // ── 투구 ──────────────────────────────────────────
  {
    id: 'iron_helm',
    name: '철제 투구',
    slot: 'helmet',
    rarity: 1,
    icon: '⛑️',
    description: '기본적인 방어력을 제공하는 투구.',
    stats: { hp: 120 },
  },
  {
    id: 'battle_helm',
    name: '전투 투구',
    slot: 'helmet',
    rarity: 2,
    icon: '⛑️',
    description: '전투에 특화된 투구.',
    stats: { hp: 280, def: 15 },
  },
  {
    id: 'sage_crown',
    name: '현자의 관',
    slot: 'helmet',
    rarity: 3,
    icon: '👑',
    description: '현자가 사용했다는 지혜의 관.',
    stats: { hp: 400, atk: 30 },
  },

  // ── 신발 ──────────────────────────────────────────
  {
    id: 'traveler_boots',
    name: '여행자 장화',
    slot: 'boots',
    rarity: 1,
    icon: '👢',
    description: '장거리 여행에 적합한 튼튼한 장화.',
    stats: { hp: 80 },
  },
  {
    id: 'swift_boots',
    name: '신속의 장화',
    slot: 'boots',
    rarity: 2,
    icon: '👢',
    description: '착용자의 발놀림을 빠르게 해주는 마법 장화.',
    stats: { hp: 120, atk: 20 },
  },
  {
    id: 'wind_boots',
    name: '바람의 신발',
    slot: 'boots',
    rarity: 3,
    icon: '👢',
    description: '바람의 정령이 깃든 신발. 움직임이 바람처럼 빨라진다.',
    stats: { hp: 200, atk: 40, def: 15 },
  },

  // ── 장신구 ────────────────────────────────────────
  {
    id: 'power_ring',
    name: '힘의 반지',
    slot: 'accessory1',
    rarity: 1,
    icon: '💍',
    description: '착용자의 힘을 높여주는 반지.',
    stats: { atk: 20 },
  },
  {
    id: 'mana_stone',
    name: '마나석 목걸이',
    slot: 'accessory1',
    rarity: 2,
    icon: '💍',
    description: '마나를 응축한 돌이 박힌 목걸이.',
    stats: { atk: 45, hp: 80 },
  },
  {
    id: 'dragon_amulet',
    name: '용의 부적',
    slot: 'accessory1',
    rarity: 4,
    icon: '🔮',
    description: '용족으로부터 전해진 신성한 부적.',
    stats: { atk: 150, hp: 300 },
  },

  // ── 장신구2 ───────────────────────────────────────
  {
    id: 'guard_necklace',
    name: '수호의 목걸이',
    slot: 'accessory2',
    rarity: 1,
    icon: '📿',
    description: '방어력을 높여주는 목걸이.',
    stats: { hp: 150 },
  },
  {
    id: 'spirit_gem',
    name: '정령석 목걸이',
    slot: 'accessory2',
    rarity: 3,
    icon: '📿',
    description: '정령의 힘이 응축된 보석 목걸이.',
    stats: { hp: 350, def: 30 },
  },
]

// 인덱스 (id → item)
export const ITEM_MAP = Object.fromEntries(ITEMS.map(i => [i.id, i]))

// 슬롯별 아이템 목록
export function getItemsBySlot(slot) {
  return ITEMS.filter(i => i.slot === slot)
}

// 장비 스탯 합산 (캐릭터 + 장비 보너스)
export function calcEquipStats(equipment) {
  const bonus = { hp: 0, atk: 0, def: 0 }
  if (!equipment) return bonus
  for (const [, itemId] of Object.entries(equipment)) {
    const item = ITEM_MAP[itemId]
    if (!item) continue
    for (const [stat, val] of Object.entries(item.stats)) {
      if (bonus[stat] !== undefined) bonus[stat] += val
    }
  }
  return bonus
}

// 스테이지 클리어 시 드롭 아이템 (간단한 랜덤 드롭)
export function rollDrops(staminaCost) {
  const pool = ITEMS.filter(i => i.rarity <= Math.ceil(staminaCost / 3))
  if (pool.length === 0) return []
  const drops = []
  if (Math.random() < 0.4) drops.push(pool[Math.floor(Math.random() * pool.length)])
  return drops
}
