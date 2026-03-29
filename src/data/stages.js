// 스테이지 구성
// 각 스테이지는 wave 배열로 구성 (wave당 적 목록)
// 적은 간단한 스탯 + 역할만 정의 (캐릭터 데이터 재활용 없이 별도 정의)

export const CHAPTERS = [
  {
    id: 'ch_01',
    title: '제1장',
    subtitle: '잊혀진 마을',
    stages: [
      {
        id: 'ch_01_01',
        title: '1-1',
        subtitle: '마을 입구',
        staminaCost: 6,
        recommendedPower: 800,
        rewards: { exp: 50, growth: 30, gacha: 0 },
        waves: [
          {
            enemies: [
              { id: 'goblin', name: '고블린', hp: 600, atk: 80, def: 40, speed: 1.0, image: '/enemies/goblin.png' },
              { id: 'goblin', name: '고블린', hp: 600, atk: 80, def: 40, speed: 1.0, image: '/enemies/goblin.png' },
            ],
          },
        ],
      },
      {
        id: 'ch_01_02',
        title: '1-2',
        subtitle: '부서진 다리',
        staminaCost: 6,
        recommendedPower: 1000,
        rewards: { exp: 60, growth: 35, gacha: 0 },
        waves: [
          {
            enemies: [
              { id: 'goblin', name: '고블린', hp: 600, atk: 80, def: 40, speed: 1.0, image: '/enemies/goblin.png' },
              { id: 'goblin_archer', name: '고블린 궁수', hp: 500, atk: 110, def: 30, speed: 0.9, image: '/enemies/goblin_archer.png' },
            ],
          },
          {
            enemies: [
              { id: 'orc', name: '오크', hp: 1200, atk: 130, def: 80, speed: 0.8, image: '/enemies/orc.png' },
            ],
          },
        ],
      },
      {
        id: 'ch_01_03',
        title: '1-3 (보스)',
        subtitle: '마을 광장',
        staminaCost: 8,
        recommendedPower: 1400,
        rewards: { exp: 100, growth: 60, gacha: 160 },
        isBoss: true,
        waves: [
          {
            enemies: [
              { id: 'goblin', name: '고블린', hp: 600, atk: 80, def: 40, speed: 1.0, image: '/enemies/goblin.png' },
              { id: 'orc', name: '오크', hp: 1200, atk: 130, def: 80, speed: 0.8, image: '/enemies/orc.png' },
            ],
          },
          {
            enemies: [
              {
                id: 'goblin_king',
                name: '고블린 왕',
                hp: 5000,
                atk: 200,
                def: 120,
                speed: 0.9,
                image: '/enemies/goblin_king.png',
                isBoss: true,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'ch_02',
    title: '제2장',
    subtitle: '어둠의 숲',
    locked: true, // 1장 클리어 후 해금
    stages: [
      {
        id: 'ch_02_01',
        title: '2-1',
        subtitle: '숲의 입구',
        staminaCost: 8,
        recommendedPower: 2000,
        rewards: { exp: 100, growth: 60, gacha: 0 },
        waves: [
          {
            enemies: [
              { id: 'dark_wolf', name: '어둠 늑대', hp: 900, atk: 150, def: 60, speed: 1.3, image: '/enemies/dark_wolf.png' },
              { id: 'dark_wolf', name: '어둠 늑대', hp: 900, atk: 150, def: 60, speed: 1.3, image: '/enemies/dark_wolf.png' },
            ],
          },
        ],
      },
    ],
  },
]

// 클리어 기록 키: stageId → { cleared: bool, stars: 1~3 }
export const STAGE_STORAGE_KEY = 'au_stage_clear'
