import { useState } from 'react'

const EVENTS = [
  {
    id: 'spring2025',
    title: '봄맞이 특별 픽업',
    subtitle: '카프리제 & 폴라리스 픽업 모집',
    tag: '진행 중',
    tagColor: '#6BCB77',
    icon: '🌸',
    period: '2025.04.01 ~ 2025.04.30',
    description: '봄맞이 특별 픽업 모집! 3성 카프리제, 폴라리스의 등장 확률이 2배 증가합니다.',
    missions: [
      { id: 1, title: '픽업 이벤트 단뽑 1회', reward: '💎 30',   done: false },
      { id: 2, title: '픽업 이벤트 10연뽑 1회', reward: '💎 80', done: false },
      { id: 3, title: '이벤트 기간 중 접속 7일', reward: '💎 200 + 🪙 5,000', done: false },
    ],
    rewards: [
      { label: '누적 1회 모집',  reward: '🪙 1,000' },
      { label: '누적 10회 모집', reward: '💎 50' },
      { label: '누적 30회 모집', reward: '💎 100' },
      { label: '누적 60회 모집', reward: '3성 확정 선택권 × 1' },
    ],
  },
  {
    id: 'guild_s1',
    title: '길드 시즌 1 개막',
    subtitle: '어설픈 용맹 길드 첫 번째 시즌',
    tag: '진행 중',
    tagColor: '#6BCB77',
    icon: '⚔️',
    period: '2025.03.29 ~ 2025.05.31',
    description: '길드 시즌 1이 시작되었습니다. 시즌 동안 활동하여 시즌 보상을 획득하세요.',
    missions: [
      { id: 1, title: '길드 미션 첫 완료',     reward: '💎 50',  done: false },
      { id: 2, title: '길드 레이드 참여',       reward: '💎 100', done: false },
      { id: 3, title: '길드원 5명과 협력 전투', reward: '💎 150', done: false },
    ],
    rewards: [
      { label: '시즌 포인트 100',  reward: '💎 30' },
      { label: '시즌 포인트 500',  reward: '💎 100 + 🪙 2,000' },
      { label: '시즌 포인트 1000', reward: '시즌 전용 칭호' },
    ],
  },
]

export default function EventPage() {
  const [selected, setSelected] = useState(EVENTS[0].id)
  const event = EVENTS.find(e => e.id === selected) || EVENTS[0]

  return (
    <div className="flex h-full overflow-hidden">

      {/* 좌: 이벤트 목록 */}
      <div className="flex flex-col w-64 shrink-0 p-3 gap-2 overflow-y-auto"
        style={{ borderRight: '1px solid var(--border)' }}>
        <div className="text-sm font-bold mb-1" style={{ color: 'var(--text-muted)' }}>이벤트 목록</div>
        {EVENTS.map(e => (
          <button
            key={e.id}
            onClick={() => setSelected(e.id)}
            className="flex items-start gap-3 p-3 rounded-2xl text-left transition-all hover:brightness-110"
            style={{
              background: selected === e.id ? 'rgba(245,197,24,0.12)' : 'rgba(255,255,255,0.04)',
              border: `1px solid ${selected === e.id ? 'rgba(245,197,24,0.35)' : 'var(--border)'}`,
            }}
          >
            <div className="text-2xl">{e.icon}</div>
            <div className="flex-1 min-w-0">
              <div className="text-white text-sm font-semibold leading-tight">{e.title}</div>
              <div className="mt-1">
                <span className="text-xs px-1.5 py-0.5 rounded font-bold"
                  style={{ background: e.tagColor + '25', color: e.tagColor }}>
                  {e.tag}
                </span>
              </div>
              <div className="text-xs mt-1" style={{ color: 'var(--text-dim)' }}>{e.period.slice(0, 10)}</div>
            </div>
          </button>
        ))}
      </div>

      {/* 우: 이벤트 상세 */}
      <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4">
        {/* 이벤트 헤더 배너 */}
        <div className="rounded-2xl p-6 relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(74,144,217,0.3), rgba(155,111,217,0.3))',
            border: '1px solid rgba(245,197,24,0.3)',
          }}>
          <div className="absolute top-4 right-4 text-5xl opacity-30">{event.icon}</div>
          <div className="flex items-start gap-3">
            <div className="text-3xl">{event.icon}</div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-white font-black text-xl">{event.title}</h2>
                <span className="text-xs px-2 py-0.5 rounded-full font-bold"
                  style={{ background: event.tagColor + '30', color: event.tagColor }}>
                  {event.tag}
                </span>
              </div>
              <div className="text-sm mb-2" style={{ color: 'var(--text-muted)' }}>{event.subtitle}</div>
              <div className="text-xs" style={{ color: 'var(--text-dim)' }}>📅 {event.period}</div>
            </div>
          </div>
          <p className="mt-4 text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            {event.description}
          </p>
        </div>

        {/* 이벤트 미션 */}
        <div className="game-card p-4">
          <div className="text-sm font-bold mb-3" style={{ color: 'var(--text-muted)' }}>이벤트 미션</div>
          <div className="flex flex-col gap-2">
            {event.missions.map(m => (
              <div key={m.id} className="flex items-center gap-3 p-3 rounded-xl"
                style={{
                  background: m.done ? 'rgba(107,203,119,0.08)' : 'rgba(255,255,255,0.04)',
                  border: '1px solid var(--border)',
                  opacity: m.done ? 0.6 : 1,
                }}>
                <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-sm"
                  style={{ background: m.done ? '#6BCB77' : 'rgba(255,255,255,0.1)' }}>
                  {m.done ? '✓' : '○'}
                </div>
                <div className="flex-1">
                  <div className="text-white text-sm font-semibold">{m.title}</div>
                </div>
                <div className="text-sm font-bold shrink-0" style={{ color: 'var(--gold)' }}>{m.reward}</div>
                <button
                  disabled={m.done}
                  className="text-xs px-3 py-1.5 rounded-lg font-bold shrink-0 disabled:opacity-40"
                  style={{ background: m.done ? 'rgba(255,255,255,0.1)' : 'var(--blue)', color: '#fff' }}>
                  {m.done ? '완료' : '수령'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 누적 보상 */}
        <div className="game-card p-4">
          <div className="text-sm font-bold mb-3" style={{ color: 'var(--text-muted)' }}>누적 보상</div>
          <div className="grid grid-cols-2 gap-2">
            {event.rewards.map((r, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)' }}>
                <div className="text-sm" style={{ color: 'var(--text-muted)' }}>{r.label}</div>
                <div className="text-sm font-bold" style={{ color: 'var(--gold)' }}>{r.reward}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-xs text-center pb-2" style={{ color: 'var(--text-dim)' }}>
          이벤트 기간 종료 후 미수령 보상은 자동 소멸됩니다.
        </div>
      </div>
    </div>
  )
}
