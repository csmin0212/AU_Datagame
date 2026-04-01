// ===== 직업군 =====
// striker  - 전위 딜러 (근접/원거리 공격)
// special  - 중위 서포터/버퍼/디버퍼
// support  - 후위 힐러/보조

// ===== 속성 =====
// fire / water / wind / light / dark / earth

// ===== 스킬 타입 =====
// ex      - 필살기 (EX 코스트 소모, 수동/AUTO 발동)
// auto    - 쿨타임마다 자동 발동
// passive - 항상 적용되는 패시브

// ===== 장비 슬롯 (6칸) =====
// weapon / armor / helmet / boots / accessory1 / accessory2

// ===== 레벨별 스탯 배율 =====
export function getStatAtLevel(baseStat, level) {
  return Math.floor(baseStat * (1 + (level - 1) * 0.05))
}

// ===== 캐릭터 이미지 경로 헬퍼 =====
// portrait : 1:1 카드용   → /characters/{id}_portrait.png
// fullbody : 상세 전신용  → /characters/{id}_fullbody.png
// 파일이 없으면 fallback으로 image 경로 사용
export function getCharacterImage(char, type = 'portrait') {
  if (type === 'fullbody') return char.fullbody  || char.image
  return char.portrait || char.image
}

// ===== 빈 장비 슬롯 기본값 =====
export const EMPTY_EQUIPMENT = {
  weapon:     null,
  armor:      null,
  helmet:     null,
  boots:      null,
  accessory1: null,
  accessory2: null,
}

export const EQUIPMENT_SLOT_LABEL = {
  weapon:     '무기',
  armor:      '갑옷',
  helmet:     '투구',
  boots:      '신발',
  accessory1: '장신구 1',
  accessory2: '장신구 2',
}

export const EQUIPMENT_SLOT_ICON = {
  weapon:     '⚔️',
  armor:      '🛡️',
  helmet:     '⛑️',
  boots:      '👢',
  accessory1: '💍',
  accessory2: '📿',
}

// ===================================================
// 캐릭터 풀
// ===================================================
export const CHARACTER_POOL = [

  // ──────────────────────────────
  // ★★★ 3성
  // ──────────────────────────────

  {
    id: 'char_muriel',
    name: '뮤리엘',
    rarity: 3,
    element: 'water',
    role: 'striker',
    image: '/characters/char_muriel.png',
    description: '바다를 반평생 누빈 전직 뱃사람. 자신의 몸만 한 할버드를 거침없이 휘두르며, 오늘도 맛있는 한 끼를 위해 싸운다. 음식을 버리면 파도 같은 분노가 찾아온다.',
    job: '바이킹',
    race: '인간',
    lore: '배신의 쓰라림을 겪고 목숨만 겨우 부지한 뮤리엘은 "마지막 만찬"을 위해 찾은 고급 식당에서 삶의 이유를 발견했다. 이후 세계를 떠돌며 의뢰를 해결하고 각 지역의 음식을 기록하는 미식 사전을 완성 중이다.',
    baseStats: { hp: 2200, atk: 360, def: 180, speed: 1.1 },
    skills: {
      ex: {
        name: '파도 참격',
        description: '할버드를 대기 중에 크게 휘둘러 전방의 적 전체에게 ATK × 5.5 의 수속성 피해를 입히고, 명중한 적의 방어력을 10초간 20% 감소시킨다.',
        cost: 4,
        type: 'ex',
        effect: { type: 'damage', target: 'all_enemy', multiplier: 5.5, secondary: { type: 'debuff', stat: 'def', amount: -0.20, duration: 10 } },
      },
      skill1: {
        name: '살을 내어주고 뼈를 취한다',
        description: '자신이 피격되는 것을 허용하여 반격 시 ATK × 3.0 의 피해를 입힌다. 발동 시 자신의 방어력이 8초간 30% 감소한다.',
        type: 'auto',
        cooldown: 14,
        effect: { type: 'damage', target: 'attacker', multiplier: 3.0 },
      },
      skill2: {
        name: '바다 같은 마음',
        description: '전투 중 처음 받는 치명타 1회를 무효화한다. 이후 HP 회복량이 15% 증가한다.',
        type: 'passive',
        effect: { type: 'buff', target: 'self', stat: 'healReceive', amount: 0.15, duration: Infinity },
      },
    },
  },

  {
    id: 'char_sean',
    name: '션',
    rarity: 3,
    element: 'dark',
    role: 'striker',
    image: '/characters/char_sean.png',
    description: '전 로얄가드 출신의 거한 용병. 208cm의 위압적인 체구와 달리 평소엔 유머러스하다. 마나·신성력·흑마법을 모두 튕겨내는 신비 저항 체질로, 마도구는 사용 불가.',
    job: '용병',
    race: '인간',
    lore: '북부 험지 헬그린두르의 몰락 귀족 출신. 9살에 가족을 잃고 홀로 대도시에 내려와 로얄가드까지 오른 입지전적 인물. 자살 임무에서 살아 돌아온 뒤 대륙을 누비며 괴물 사냥으로 생계를 이어가다 길드에 합류했다.',
    baseStats: { hp: 2800, atk: 420, def: 220, speed: 0.9 },
    skills: {
      ex: {
        name: '철벽 분쇄',
        description: '적으로 판단한 대상 1명에게 ATK × 7.0 의 암속성 피해를 입힌다. 이 공격은 방어력을 40% 무시하며, 마법 방어 버프를 강제 해제한다.',
        cost: 5,
        type: 'ex',
        effect: { type: 'damage', target: 'single_enemy', multiplier: 7.0, defPen: 0.40, dispel: true },
      },
      skill1: {
        name: '사냥꾼의 본능',
        description: '적 1명에게 ATK × 2.5 의 피해를 2회 입힌다. 대상이 디버프 상태일 경우 각 타격 피해가 30% 증가한다.',
        type: 'auto',
        cooldown: 10,
        effect: { type: 'damage', target: 'single_enemy', multiplier: 2.5, hits: 2 },
      },
      skill2: {
        name: '신비 저항',
        description: '마법·신성력·흑마법 계열 피해를 25% 감소시킨다. 상태이상 저항률이 항상 30% 증가한다.',
        type: 'passive',
        effect: { type: 'buff', target: 'self', stat: 'magicRes', amount: 0.25, duration: Infinity },
      },
    },
  },

  {
    id: 'char_caprizze',
    name: '카프리제',
    rarity: 3,
    element: 'fire',
    role: 'support',
    image: '/characters/char_caprizze.png',
    description: '260년을 살아온 순혈 엘프 주방장. 불의 정령과 소통하며 요리에 정령의 힘을 깃들게 한다. 씩씩하고 호탕해 길드원들에게 "형"이라 불린다.',
    job: '주방장',
    race: '순혈 엘프',
    lore: '엘프 왕국 재건을 위해 엘라이 의회가 타종족과의 관계 형성 차원에서 파견했다. 타종족 요리에 관심이 많아 스스로 자원했다. 수많은 단명종들과의 이별을 겪어 가까이 다가오면 살짝 밀어내는 모습도 있다.',
    baseStats: { hp: 1600, atk: 240, def: 160, speed: 1.0 },
    skills: {
      ex: {
        name: '신성한 불꽃 요리',
        description: '정령의 힘을 담은 황금빛 꽃 모양 음식을 아군 전체에게 나눠준다. 아군 전체의 ATK·DEF를 20초간 25% 증가시키고 HP를 ATK × 2.0 만큼 회복시킨다.',
        cost: 5,
        type: 'ex',
        effect: { type: 'buff', target: 'all_ally', stat: 'atk', amount: 0.25, duration: 20, secondary: { type: 'heal', multiplier: 2.0 } },
      },
      skill1: {
        name: '적정열',
        description: '아군 중 HP가 가장 낮은 1명에게 정령의 불꽃 온기를 불어넣어 ATK × 2.2 만큼 회복하고 방어력을 10초간 15% 증가시킨다.',
        type: 'auto',
        cooldown: 12,
        effect: { type: 'heal', target: 'lowest_hp_ally', multiplier: 2.2 },
      },
      skill2: {
        name: '열의 유지',
        description: '아군 전체의 HP 자연 회복량이 5% 증가한다. 전투 시작 시 아군 전체의 방어력이 10% 증가한다.',
        type: 'passive',
        effect: { type: 'buff', target: 'all_ally', stat: 'def', amount: 0.10, duration: Infinity },
      },
    },
  },

  {
    id: 'char_polaris',
    name: '폴라리스',
    rarity: 3,
    element: 'light',
    role: 'special',
    image: '/characters/char_polaris.png',
    description: '256년을 살아온 엘프 이야기꾼. 핑크빛 머리와 당돌한 눈매가 인상적이며, 노래와 이야기로 아군을 고무시킨다. "폴라리스"는 이름을 이어받은 것.',
    job: '이야기꾼',
    race: '엘프',
    lore: '어린 시절 악인의 실험실에 갇혔을 때, 벽 너머에서 세상의 아름다움을 이야기해주던 소년 "폴라리스"가 폭동을 이끌다 목숨을 잃었다. 그의 이름을 이어받아 세계에 영웅의 이야기를 노래하며 다닌다. 폴라리스라는 이름을 모르는 사람이 없도록 하는 것이 목표.',
    baseStats: { hp: 1400, atk: 300, def: 140, speed: 1.2 },
    skills: {
      ex: {
        name: '영웅의 서사시',
        description: '아군 전체에게 영웅의 노래를 들려준다. 20초간 ATK 30% 증가, EX 스킬 코스트를 1 감소시킨다. 적 전체에겐 ATK × 2.0 의 광속성 피해를 입힌다.',
        cost: 4,
        type: 'ex',
        effect: { type: 'buff', target: 'all_ally', stat: 'atk', amount: 0.30, duration: 20 },
      },
      skill1: {
        name: '용기의 멜로디',
        description: '아군 1명(랜덤)에게 10초간 공격 속도 20% 증가 버프를 부여하고 HP를 ATK × 1.5 만큼 회복한다.',
        type: 'auto',
        cooldown: 11,
        effect: { type: 'buff', target: 'random_ally', stat: 'speed', amount: 0.20, duration: 10 },
      },
      skill2: {
        name: '이야기의 힘',
        description: '아군이 적을 처치할 때마다 EX 코스트를 0.5 추가 획득한다. 자신이 전장에 있는 한 아군 전체의 사기가 오른다.',
        type: 'passive',
        effect: { type: 'special', trigger: 'on_kill', exCostBonus: 0.5 },
      },
    },
  },

  // ──────────────────────────────
  // ★★ 2성
  // ──────────────────────────────

  {
    id: 'char_maria',
    name: '마리아',
    rarity: 2,
    element: 'light',
    role: 'support',
    image: '/characters/char_maria.png',
    description: '라운데라 신과 샤덴프로이데 신 두 신을 섬기는 성직자. 돈에 집착하며 말투는 틱틱거리지만, 위기의 순간엔 누구보다 믿음직한 치유를 선보인다.',
    job: '성직자',
    race: '인간',
    lore: '버려진 채 뒷골목에서 자라났으나, 검은 머리와 루비빛 눈을 가진 정인을 만나 삶의 방향이 바뀌었다. 그가 일찍 세상을 떠나자, 그가 보지 못한 세상의 아름다움을 찾고 언젠가 되살리겠다는 맹세를 가슴에 품고 있다.',
    baseStats: { hp: 1500, atk: 200, def: 150, speed: 0.95 },
    skills: {
      ex: {
        name: '이중 신의 기적',
        description: '라운데라의 빛과 샤덴프로이데의 가호를 동시에 내려, 아군 전체의 HP를 ATK × 4.0 만큼 회복하고 적 전체에게 ATK × 2.0 의 광속성 피해를 입힌다.',
        cost: 5,
        type: 'ex',
        effect: { type: 'heal', target: 'all_ally', multiplier: 4.0 },
      },
      skill1: {
        name: '탐욕의 축복',
        description: '아군 1명에게 ATK × 2.5 의 치유를 제공하고, 치유량의 10%를 골드로 전환한다(전투 후 보상 증가).',
        type: 'auto',
        cooldown: 10,
        effect: { type: 'heal', target: 'lowest_hp_ally', multiplier: 2.5 },
      },
      skill2: {
        name: '신의 가호',
        description: '아군이 치명적인 피해를 받아 HP가 0이 될 때, 1회 한해 HP 1로 생존시키고 ATK × 1.0 만큼 즉시 회복시킨다. 15초 쿨타임.',
        type: 'passive',
        effect: { type: 'special', trigger: 'on_fatal', reviveHp: 1, cooldown: 15 },
      },
    },
  },

  {
    id: 'char_shon',
    name: '숀',
    rarity: 2,
    element: 'wind',
    role: 'striker',
    image: '/characters/char_shon.png',
    description: '쥐 데미간 마을 마우스가드 출신의 래트형 수인 모험가. 135cm의 작은 체구에 파란 비늘 갑옷을 입고 60cm 남짓의 짧은 한손검을 휘두른다.',
    job: '모험가',
    race: '데미간 (쥐)',
    lore: '고향 마우스가드를 떠나 더 큰 세계와 더 큰 모험을 찾아왔다. 스텔라 스타라이트의 추천으로 길드에 합류했으며, 위대한 모험가가 되는 것이 꿈이다. 올곧고 성실한 성격으로 동료들에게 신뢰를 받는다.',
    baseStats: { hp: 1100, atk: 290, def: 110, speed: 1.4 },
    skills: {
      ex: {
        name: '마우스가드 돌격',
        description: '순간적으로 적진에 돌진하여 적 1~3명에게 각각 ATK × 3.5 의 바람 속성 피해를 입힌다. 소형 체구를 이용해 회피율이 20% 상승한다.',
        cost: 3,
        type: 'ex',
        effect: { type: 'damage', target: 'front_enemy', multiplier: 3.5 },
      },
      skill1: {
        name: '재빠른 찌르기',
        description: '빠른 속도로 적 1명을 3회 찌른다. 각 타격은 ATK × 1.2 의 피해를 입힌다.',
        type: 'auto',
        cooldown: 8,
        effect: { type: 'damage', target: 'single_enemy', multiplier: 1.2, hits: 3 },
      },
      skill2: {
        name: '모험가의 기개',
        description: '파티 내에서 자신이 가장 낮은 레벨일 경우, 공격력과 방어력이 각각 15% 증가한다.',
        type: 'passive',
        effect: { type: 'buff', target: 'self', stat: 'atk', amount: 0.15, condition: 'lowest_level', duration: Infinity },
      },
    },
  },

  {
    id: 'char_mona',
    name: '모나',
    rarity: 2,
    element: 'wind',
    role: 'special',
    image: '/characters/char_mona.png',
    description: '"민들레 홀씨 모나 델핀". 바람처럼 가볍게 흩어지다 어느새 자리를 잡는 특이한 존재감을 가졌다.',
    job: '방랑자',
    race: '인간',
    lore: '민들레 홀씨처럼 어디서든 떨어져 뿌리를 내리는 방랑자. 그녀가 어디서 왔는지, 어디로 가는지 아는 사람은 많지 않다. 바람이 이끄는 대로 길드에 흘러들었다.',
    baseStats: { hp: 1000, atk: 260, def: 120, speed: 1.3 },
    skills: {
      ex: {
        name: '홀씨 폭풍',
        description: '민들레 홀씨를 폭발적으로 방출하여 적 전체에게 ATK × 2.8 의 바람 속성 피해를 입히고 5초간 시야를 차단하는 디버프를 부여한다.',
        cost: 4,
        type: 'ex',
        effect: { type: 'damage', target: 'all_enemy', multiplier: 2.8 },
      },
      skill1: {
        name: '바람의 발걸음',
        description: '자신의 이동 속도를 높여 적 1명에게 ATK × 2.0 의 피해를 입히고 다음 공격의 회피율을 25% 증가시킨다.',
        type: 'auto',
        cooldown: 9,
        effect: { type: 'damage', target: 'single_enemy', multiplier: 2.0 },
      },
      skill2: {
        name: '뿌리내리기',
        description: '전투 시작 5초 후 자신의 공격력이 10% 증가하고, 매 10초마다 추가로 5% 증가한다 (최대 25%).',
        type: 'passive',
        effect: { type: 'buff', target: 'self', stat: 'atk', amount: 0.10, stackable: true, duration: Infinity },
      },
    },
  },

  {
    id: 'char_marius',
    name: '마리우스',
    rarity: 2,
    element: 'earth',
    role: 'striker',
    image: '/characters/char_marius.png',
    description: '"삼색성의 강철 마리우스". 세 가지 빛깔의 성좌를 지닌 강인한 전사. 두꺼운 갑옷과 육중한 무기로 전선을 지탱한다.',
    job: '중갑전사',
    race: '인간',
    lore: '삼색성(三色星)이라 불리는 특이한 운명의 별자리 아래 태어났다. 강철처럼 단단한 의지로 전선의 방패 역할을 자처한다. 길드에서 그의 과거를 아는 사람은 손에 꼽는다.',
    baseStats: { hp: 2400, atk: 280, def: 260, speed: 0.8 },
    skills: {
      ex: {
        name: '삼색성의 강타',
        description: '세 방향으로 강력한 일격을 가해 전방 적 전체에게 ATK × 4.0 의 대지 속성 피해를 입히고 10초간 이동 불가 상태로 만든다.',
        cost: 4,
        type: 'ex',
        effect: { type: 'damage', target: 'all_enemy', multiplier: 4.0 },
      },
      skill1: {
        name: '철벽 방어',
        description: '방패를 세워 다음 피격 1회를 완전 차단하고, 공격한 적에게 ATK × 1.5 의 반격 피해를 입힌다.',
        type: 'auto',
        cooldown: 12,
        effect: { type: 'special', trigger: 'on_hit', block: true, counterMultiplier: 1.5 },
      },
      skill2: {
        name: '강철 의지',
        description: 'HP가 30% 이하일 때 방어력이 40% 증가하고 받는 피해가 20% 감소한다.',
        type: 'passive',
        effect: { type: 'buff', target: 'self', stat: 'def', amount: 0.40, condition: 'hp_below_30', duration: Infinity },
      },
    },
  },

  // ──────────────────────────────
  // ★ 1성
  // ──────────────────────────────

  {
    id: 'char_torben',
    name: '토르번',
    rarity: 1,
    element: 'dark',
    role: 'special',
    image: '/characters/char_torben.png',
    description: '"시린 눈 토르번 팔켄하인". 차갑고 날카로운 시선만큼이나 냉정한 분석가. 전장을 읽는 능력이 뛰어나다.',
    job: '정찰병',
    race: '인간',
    lore: '팔켄하인이라는 이름에 걸맞은 매서운 눈매를 가졌다. 아직 알려진 것이 많지 않으며, 길드에서도 조용히 자신의 역할만 수행하는 타입이다.',
    baseStats: { hp: 950, atk: 220, def: 100, speed: 1.2 },
    skills: {
      ex: {
        name: '시린 눈의 분석',
        description: '적 전체의 약점을 파악하여 15초간 아군 전체의 피해량을 15% 증가시키고 적의 회피율을 20% 감소시킨다.',
        cost: 3,
        type: 'ex',
        effect: { type: 'debuff', target: 'all_enemy', stat: 'evasion', amount: -0.20, duration: 15 },
      },
      skill1: {
        name: '냉철한 일격',
        description: '적 1명의 방어력을 무시하고 ATK × 2.2 의 암속성 피해를 입힌다.',
        type: 'auto',
        cooldown: 10,
        effect: { type: 'damage', target: 'single_enemy', multiplier: 2.2, defPen: 1.0 },
      },
      skill2: {
        name: '냉기 적응',
        description: '자신의 명중률이 항상 15% 증가하며 암속성 피해가 10% 증가한다.',
        type: 'passive',
        effect: { type: 'buff', target: 'self', stat: 'accuracy', amount: 0.15, duration: Infinity },
      },
    },
  },

  {
    id: 'char_jon',
    name: '존',
    rarity: 1,
    element: 'earth',
    role: 'striker',
    image: '/characters/char_jon.png',
    description: '"벙거지 존시". 항상 낡은 벙거지 모자를 쓰고 다니는 평범해 보이는 청년. 하지만 그 평범함 뒤에 무언가가 숨어 있을지도.',
    job: '용사',
    race: '인간',
    lore: '언제나 낡은 벙거지 모자를 눌러쓰고 나타난다. 자신에 대해 잘 말하지 않지만, 힘든 상황에서도 포기하지 않는 끈기가 있다.',
    baseStats: { hp: 1200, atk: 210, def: 130, speed: 1.0 },
    skills: {
      ex: {
        name: '벙거지 전술',
        description: '모자를 투척하여 적 전체의 주의를 분산시키고 ATK × 3.0 의 대지 속성 피해를 입힌다. 이후 자신의 공격력이 10초간 20% 증가한다.',
        cost: 3,
        type: 'ex',
        effect: { type: 'damage', target: 'all_enemy', multiplier: 3.0 },
      },
      skill1: {
        name: '끈질긴 일격',
        description: '적 1명에게 ATK × 1.8 의 피해를 입힌다. 적의 HP가 50% 이하일 경우 피해가 30% 증가한다.',
        type: 'auto',
        cooldown: 9,
        effect: { type: 'damage', target: 'single_enemy', multiplier: 1.8 },
      },
      skill2: {
        name: '포기하지 않는 의지',
        description: 'HP가 10% 이하로 떨어지면 공격력이 25% 증가하고 매초 HP가 1% 회복된다.',
        type: 'passive',
        effect: { type: 'buff', target: 'self', stat: 'atk', amount: 0.25, condition: 'hp_below_10', duration: Infinity },
      },
    },
  },

  {
    id: 'char_luce',
    name: '루체',
    rarity: 1,
    element: 'light',
    role: 'support',
    image: '/characters/char_luce.png',
    description: '"신복(神福)의 말괄량이 루체 루멘". 신의 축복을 한 몸에 받았다는 소문이 있는 활기찬 소녀. 폴라리스와 함께 행동하는 경우가 많다.',
    job: '신관',
    race: '인간',
    lore: '신의 축복이라 불리는 특별한 기운을 타고났다. 에너지가 넘치고 말괄량이 기질이 있지만, 아군을 돕는 일에 있어서는 진지하다. 폴라리스와는 오래된 인연이 있다.',
    baseStats: { hp: 1100, atk: 180, def: 140, speed: 1.1 },
    skills: {
      ex: {
        name: '신복의 빛',
        description: '신의 축복을 아군 전체에 내려 HP를 ATK × 3.0 만큼 회복하고 10초간 받는 피해를 15% 감소시킨다.',
        cost: 3,
        type: 'ex',
        effect: { type: 'heal', target: 'all_ally', multiplier: 3.0 },
      },
      skill1: {
        name: '활기찬 응원',
        description: '아군 1명에게 ATK × 1.5 의 치유를 제공하고 8초간 공격 속도를 10% 증가시킨다.',
        type: 'auto',
        cooldown: 8,
        effect: { type: 'heal', target: 'lowest_hp_ally', multiplier: 1.5 },
      },
      skill2: {
        name: '신의 가호',
        description: '폴라리스가 파티에 있을 때 자신과 폴라리스의 모든 스킬 효과가 15% 증가한다.',
        type: 'passive',
        effect: { type: 'buff', target: 'self', stat: 'skillEffect', amount: 0.15, condition: 'polaris_in_party', duration: Infinity },
      },
    },
  },
]

// ===== 상수 =====

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

export const RARITY_LABEL = {
  3: '★★★',
  2: '★★',
  1: '★',
}

export const ELEMENT_COLOR = {
  fire:  '#FF6B35',
  water: '#4FC3F7',
  wind:  '#81C784',
  light: '#FFF176',
  dark:  '#CE93D8',
  earth: '#D4A96A',
}

export const ELEMENT_LABEL = {
  fire:  '화염',
  water: '수류',
  wind:  '바람',
  light: '광명',
  dark:  '암흑',
  earth: '대지',
}

export const ROLE_LABEL = {
  striker: '전위',
  special: '중위',
  support: '후위',
}

export const ROLE_COLOR = {
  striker: '#FF6B6B',
  special: '#FFD93D',
  support: '#6BCB77',
}
