import { useState } from 'react'

const NOTICES = [
  { id: 1, title: '오픈 기념 뽑기 재화 3,000 지급', date: '03.29', isNew: true },
  { id: 2, title: '제1장 퀘스트 "잊혀진 마을" 오픈', date: '03.29', isNew: true },
  { id: 3, title: '길드 <어설픈 용맹> 첫 번째 시즌 시작', date: '03.29', isNew: false },
]

const MISSIONS = [
  { id: 1, title: '첫 뽑기 도전', desc: '단뽑 1회 진행', reward: '💎 50', done: false },
  { id: 2, title: '캐릭터 레벨업', desc: '캐릭터 1명 레벨업', reward: '🪙 100', done: false },
  { id: 3, title: '파티 편성', desc: '파티에 캐릭터 1명 이상 편성', reward: '💎 30', done: false },
]

export default function HomePage({ onNavigate, ownedCount = 0, partyCount = 0 }) {
  const [modal, setModal] = useState(null) // 'notice' | 'mission' | 'attendance'

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* 배경 */}
      <div className="absolute inset-0"
        style={{ background: 'linear-gradient(135deg, #0f0728 0%, #1a0f3a 40%, #0d1b3e 100%)' }} />
      <div className="absolute inset-0 opacity-25"
        style={{ backgroundImage: 'radial-gradient(ellipse at 70% 50%, #4a90d9 0%, transparent 60%)' }} />
      <div className="absolute inset-0 opacity-10"
        style={{ backgroundImage: 'radial-gradient(ellipse at 30% 80%, #9b6fd9 0%, transparent 50%)' }} />

      {/* 환영 메시지 */}
      <div className="absolute rounded-2xl px-8 py-5 text-center"
        style={{
          top: '50%', left: '50%', transform: 'translate(-20%, -60%)',
          background: 'rgba(0,0,0,0.45)',
          border: '1px solid rgba(245,197,24,0.3)',
          backdropFilter: 'blur(8px)',
          minWidth: 280,
        }}>
        <div className="text-2xl font-bold text-white mb-1">환영합니다, 사령관님</div>
        <div className="text-sm" style={{ color: 'var(--text-muted)' }}>오늘도 위대한 모험이 당신을 기다립니다</div>
        <div className="flex gap-4 justify-center mt-3 text-xs" style={{ color: 'var(--text-dim)' }}>
          <span>보유 캐릭터 <strong className="text-white">{ownedCount}명</strong></span>
          <span>파티 편성 <strong className="text-white">{partyCount}명</strong></span>
        </div>
      </div>

      {/* 좌측 퀵버튼 */}
      <div className="absolute left-6 top-1/2 -translate-y-1/2 flex flex-col gap-3">
        {[
          { label: '공지사항', icon: '📢', badge: 2,  key: 'notice' },
          { label: '일일 미션', icon: '🎯', badge: 3,  key: 'mission' },
          { label: '출석 체크', icon: '📅', badge: 1,  key: 'attendance' },
        ].map(btn => (
          <button
            key={btn.key}
            onClick={() => setModal(btn.key)}
            className="relative flex items-center gap-3 px-4 py-3 rounded-2xl text-left transition-all hover:brightness-110 active:scale-95"
            style={{
              background: 'rgba(26,15,58,0.85)',
              border: '1px solid rgba(255,255,255,0.12)',
              backdropFilter: 'blur(6px)',
              minWidth: 160,
            }}
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
              style={{ background: 'rgba(245,197,24,0.15)' }}>
              {btn.icon}
            </div>
            <span className="text-white font-semibold text-sm">{btn.label}</span>
            {btn.badge > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center"
                style={{ background: '#ef4444', color: '#fff' }}>{btn.badge}</span>
            )}
          </button>
        ))}
      </div>

      {/* 우측 하단: 이벤트 배너 */}
      <button
        onClick={() => onNavigate('event')}
        className="absolute bottom-6 right-6 flex items-center gap-3 px-5 py-3.5 rounded-2xl transition-all hover:brightness-110 active:scale-95"
        style={{
          background: 'linear-gradient(135deg, rgba(74,144,217,0.3), rgba(155,111,217,0.3))',
          border: '1px solid rgba(245,197,24,0.4)',
          backdropFilter: 'blur(8px)',
        }}
      >
        <span className="text-2xl">🌸</span>
        <div className="text-left">
          <div className="text-xs font-bold" style={{ color: 'var(--gold)' }}>봄맞이 이벤트</div>
          <div className="text-white font-bold text-sm">봄맞이 특별 픽업</div>
        </div>
        <span className="text-gray-400 text-lg ml-2">›</span>
      </button>

      {/* ───── 공지사항 모달 ───── */}
      {modal === 'notice' && (
        <div className="popup-overlay" onClick={() => setModal(null)}>
          <div className="popup-panel" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white font-bold text-lg">📢 공지사항</h2>
              <button onClick={() => setModal(null)} className="text-gray-400 hover:text-white text-xl">✕</button>
            </div>
            <div className="flex flex-col gap-2">
              {NOTICES.map(n => (
                <div key={n.id} className="flex items-start gap-3 rounded-xl p-3"
                  style={{ background: n.isNew ? 'rgba(245,197,24,0.08)' : 'rgba(255,255,255,0.04)', border: '1px solid var(--border)' }}>
                  {n.isNew && <span className="text-xs px-1.5 py-0.5 rounded font-bold shrink-0 mt-0.5"
                    style={{ background: '#ef4444', color: '#fff' }}>NEW</span>}
                  <div className="flex-1">
                    <div className="text-white text-sm">{n.title}</div>
                    <div className="text-xs mt-0.5" style={{ color: 'var(--text-dim)' }}>{n.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ───── 일일 미션 모달 ───── */}
      {modal === 'mission' && (
        <div className="popup-overlay" onClick={() => setModal(null)}>
          <div className="popup-panel" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white font-bold text-lg">🎯 일일 미션</h2>
              <button onClick={() => setModal(null)} className="text-gray-400 hover:text-white text-xl">✕</button>
            </div>
            <div className="flex flex-col gap-2">
              {MISSIONS.map(m => (
                <div key={m.id} className="flex items-center gap-3 rounded-xl p-3"
                  style={{ background: m.done ? 'rgba(107,203,119,0.08)' : 'rgba(255,255,255,0.04)', border: '1px solid var(--border)', opacity: m.done ? 0.6 : 1 }}>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                    style={{ background: m.done ? '#6BCB77' : 'rgba(255,255,255,0.1)' }}>
                    <span className="text-sm">{m.done ? '✓' : '○'}</span>
                  </div>
                  <div className="flex-1">
                    <div className="text-white text-sm font-semibold">{m.title}</div>
                    <div className="text-xs" style={{ color: 'var(--text-dim)' }}>{m.desc}</div>
                  </div>
                  <div className="text-sm font-bold" style={{ color: 'var(--gold)' }}>{m.reward}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ───── 출석 체크 모달 ───── */}
      {modal === 'attendance' && (
        <div className="popup-overlay" onClick={() => setModal(null)}>
          <div className="popup-panel" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white font-bold text-lg">📅 출석 체크</h2>
              <button onClick={() => setModal(null)} className="text-gray-400 hover:text-white text-xl">✕</button>
            </div>
            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: 28 }).map((_, i) => {
                const day = i + 1
                const isToday = day === 1
                const isPast  = day < 1
                const reward  = day % 7 === 0 ? '💎 160' : day % 3 === 0 ? '🪙 50' : '🪙 20'
                return (
                  <div key={i} className="flex flex-col items-center gap-1 rounded-xl p-2"
                    style={{
                      background: isToday ? 'rgba(245,197,24,0.2)' : isPast ? 'rgba(107,203,119,0.1)' : 'rgba(255,255,255,0.04)',
                      border: `1px solid ${isToday ? 'var(--gold)' : 'var(--border)'}`,
                    }}>
                    <div className="text-xs font-bold" style={{ color: isToday ? 'var(--gold)' : 'var(--text-dim)' }}>{day}</div>
                    <div className="text-xs text-center" style={{ color: 'var(--text-muted)', fontSize: 9 }}>{reward}</div>
                    {isPast && <span className="text-xs">✓</span>}
                  </div>
                )
              })}
            </div>
            <button className="btn-gold w-full py-2.5 mt-4 text-sm font-bold rounded-xl">
              오늘 출석 체크
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
