export const BANNERS = [
  {
    id: 'banner_pickup_001',
    name: '아리아 픽업 배너',
    subtitle: '빛의 계시',
    featured: ['char_001'],         // 픽업 캐릭터 id
    pool: ['char_001', 'char_002', 'char_003', 'char_004', 'char_005', 'char_006'],
    endDate: '2026-05-01',
    costPerPull: 160,               // 단뽑 재화 소모
    pityHard: 90,                   // 천장
    pityFeaturedRate: 0.5,          // 3성 등장 시 픽업일 확률
    rates: { 3: 0.03, 2: 0.12, 1: 0.85 },
    softPityStart: 75,              // 소프트 천장 시작 (이후 확률 상승)
    image: '/banners/banner_001.png',
  },
]

export const PULL_COST = {
  single: 160,
  ten: 1600,
}
