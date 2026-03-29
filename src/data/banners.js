// 뽑기 재화 소모량
export const PULL_COST = {
  single: 160,
  ten:    1600,
}

export const BANNERS = [
  {
    id: 'banner_muriel',
    name: '뮤리엘 픽업 배너',
    subtitle: '바다를 건너온 미식가',
    featured: ['char_muriel'],
    pool: [
      'char_muriel', 'char_sean', 'char_caprizze', 'char_polaris',  // 3성
      'char_maria', 'char_shon', 'char_mona', 'char_marius',        // 2성
      'char_torben', 'char_jon', 'char_luce',                       // 1성
    ],
    endDate: '2026-05-01',
    costPerPull: 160,
    pityHard: 90,
    softPityStart: 75,
    pityFeaturedRate: 0.5,
    rates: { 3: 0.03, 2: 0.12, 1: 0.85 },
  },
  {
    id: 'banner_standard',
    name: '일반 모집',
    subtitle: '언제든 도전하세요',
    featured: [],
    pool: [
      'char_muriel', 'char_sean', 'char_caprizze', 'char_polaris',
      'char_maria', 'char_shon', 'char_mona', 'char_marius',
      'char_torben', 'char_jon', 'char_luce',
    ],
    endDate: null,
    costPerPull: 160,
    pityHard: 90,
    softPityStart: 75,
    pityFeaturedRate: 0,
    rates: { 3: 0.03, 2: 0.12, 1: 0.85 },
  },
]
