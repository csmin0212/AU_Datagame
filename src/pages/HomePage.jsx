import { useState } from 'react'

const NOTICES = [
  {
    id: 1,
    tag: 'NEW',
    tagColor: '#ef4444',
    title: '오픈 기념 뽑기 재화 3,000 지급',
    body: '게임 정식 오픈을 기념하여 모든 사령관에게 💎 젬 3,000을 지급합니다. 우편함에서 수령해 주세요.',
    date: '2025.03.29',
  },
  {
    id: 2,
    tag: 'NEW',
    tagColor: '#ef4444',
    title: '제1장 퀘스트 "잊혀진 마을" 오픈',
    body: '메인 퀘스트 제1장이 오픈되었습니다. 임무 탭에서 스테이지를 진행해 보세요.',
    date: '2025.03.29',
  },
  {
    id: 3,
    tag: '공지',
    tagColor: '#4a90d9',
    title: '길드 <어설픈 용맹> 첫 번째 시즌 시작',
    body: '길드 시즌 1이 개막되었습니다. 이번 시즌은 2025년 5월 31일까지 진행됩니다.',
    date: '2025.03.29',
  },
]

const MISSIONS = [
  { id: 1, title: '첫 뽑기 도전',   desc: '단뽑 1회 진행',            reward: '💎 50',  done: false, progress: '0/1' },
  { id: 2, title: '캐릭터 레벨업',  desc: '캐릭터 1명을 레벨업',      reward: '🪙 100', done: false, progress: '0/1' },
  { id: 3, title: '파티 편성',      desc: '파티에 캐릭터 1명 이상 편성', reward: '💎 30',  done: false, progress: '0/1' },
  { id: 4, title: '임무 클리어',    desc: '스테이지 1개 클리어',       reward: '💎 30',  done: false, progress: '0/1' },
  { id: 5, title: '일일 접속',      desc: '오늘 게임 접속',            reward: '🪙 200', done: true,  progress: '1/1' },
]

const ATTENDANCE_REWARDS = [
  '🪙 200', '🪙 200', '💎 20', '🪙 500', '🪙 200', '🪙 200', '💎 80',
  '🪙 200', '💎 20',  '🪙 500', '🪙 200', '🪙 200', '💎 20', '💎 160',
  '🪙 200', '🪙 200', '💎 20',  '🪙 500', '🪙 200', '💎 40', '🪙 1000',
  '🪙 200', '🪙 200', '💎 20',  '🪙 500', '🪙 200', '💎 80',  '💎 500 + 🪙 3,000',
]

export default function HomePage({ onNavigate, ownedCount = 0, partyCount = 0 }) {
  const [modal,          setModal]         = useState(null)  // 'notice' | 'mission' | 'attendance'
  const [noticeSelected, setNoticeSelected] = useState(null)
  const [todayChecked,   setTodayChecked]   = useState(false)

  const TODAY_DAY = 1 // TODO: 실제 출석 일수를 state에서 가져오기

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
          { label: '공지사항', icon: '📢', badge: NOTICES.filter(n => n.tag === 'NEW').length, key: 'notice' },
          { label: '일일 미션', icon: '🎯', badge: MISSIONS.filter(m => !m.done).length,       key: 'mission' },
          { label: '출석 체크', icon: '📅', badge: todayChecked ? 0 : 1,                        key: 'attendance' },
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

      {/* ═══════════════════ 공지사항 모달 ═══════════════════ */}
      {modal === 'notice' && (
        <div className="popup-overlay" onClick={() => { setModal(null); setNoticeSelected(null) }}>
          <div className="popup-panel-wide" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-white font-bold text-xl">📢 공지사항</h2>
              <button onClick={() => { setModal(null); setNoticeSelected(null) }}
                className="text-gray-400 hover:text-white text-2xl leading-none">✕</button>
            </div>

            <div className="flex gap-4" style={{ minHeight: 300 }}>
              {/* 목록 */}
              <div className="flex flex-col gap-2 w-64 shrink-0">
                {NOTICES.map(n => (
                  <button
                    key={n.id}
                    onClick={() => setNoticeSelected(n.id)}
                    className="flex items-start gap-3 p-3 rounded-xl text-left transition-all hover:brightness-110"
                    style={{
                      background: noticeSelected === n.id
                        ? 'rgba(245,197,24,0.12)'
                        : n.tag === 'NEW' ? 'rgba(245,197,24,0.07)' : 'rgba(255,255,255,0.04)',
                      border: `1px solid ${noticeSelected === n.id ? 'rgba(245,197,24,0.4)' : 'var(--border)'}`,
                    }}>
                    <span className="text-xs px-1.5 py-0.5 rounded font-bold shrink-0 mt-0.5"
                      style={{ background: n.tagColor + '30', color: n.tagColor }}>
                      {n.tag}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="text-white text-sm leading-snug">{n.title}</div>
                      <div className="text-xs mt-1" style={{ color: 'var(--text-dim)' }}>{n.date}</div>
                    </div>
                  </button>
                ))}
              </div>

              {/* 본문 */}
              <div className="flex-1 rounded-2xl p-4"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)' }}>
                {noticeSelected ? (() => {
                  const n = NOTICES.find(x => x.id === noticeSelected)
                  return (
                    <>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-xs px-2 py-0.5 rounded font-bold"
                          style={{ background: n.tagColor + '30', color: n.tagColor }}>{n.tag}</span>
                        <span className="text-xs" style={{ color: 'var(--text-dim)' }}>{n.date}</span>
                      </div>
                      <h3 className="text-white font-bold text-base mb-3">{n.title}</h3>
                      <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{n.body}</p>
                    </>
                  )
                })() : (
                  <div className="flex items-center justify-center h-full text-center">
                    <div>
                      <div className="text-3xl mb-2 opacity-30">📄</div>
                      <div className="text-sm" style={{ color: 'var(--text-dim)' }}>공지를 선택하세요</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════ 일일 미션 모달 ═══════════════════ */}
      {modal === 'mission' && (
        <div className="popup-overlay" onClick={() => setModal(null)}>
          <div className="popup-panel-wide" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-white font-bold text-xl">🎯 일일 미션</h2>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-dim)' }}>
                  완료 {MISSIONS.filter(m => m.done).length} / 전체 {MISSIONS.length} · 매일 00:00 초기화
                </p>
              </div>
              <button onClick={() => setModal(null)} className="text-gray-400 hover:text-white text-2xl">✕</button>
            </div>

            {/* 진행도 바 */}
            <div className="rounded-xl px-4 py-3 mb-4"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)' }}>
              <div className="flex justify-between text-xs mb-2" style={{ color: 'var(--text-muted)' }}>
                <span>일일 미션 달성도</span>
                <span style={{ color: 'var(--gold)' }}>
                  {MISSIONS.filter(m => m.done).length}/{MISSIONS.length}
                </span>
              </div>
              <div className="w-full h-2.5 rounded-full" style={{ background: 'rgba(255,255,255,0.1)' }}>
                <div className="h-2.5 rounded-full transition-all"
                  style={{
                    width: `${(MISSIONS.filter(m => m.done).length / MISSIONS.length) * 100}%`,
                    background: 'linear-gradient(90deg, var(--blue), #6BCB77)',
                  }} />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              {MISSIONS.map(m => (
                <div key={m.id}
                  className="flex items-center gap-4 rounded-xl p-4"
                  style={{
                    background: m.done ? 'rgba(107,203,119,0.08)' : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${m.done ? 'rgba(107,203,119,0.25)' : 'var(--border)'}`,
                    opacity: m.done ? 0.7 : 1,
                  }}>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-base"
                    style={{ background: m.done ? '#6BCB77' : 'rgba(255,255,255,0.1)' }}>
                    {m.done ? '✓' : '○'}
                  </div>
                  <div className="flex-1">
                    <div className="text-white font-semibold text-base">{m.title}</div>
                    <div className="text-sm mt-0.5" style={{ color: 'var(--text-dim)' }}>{m.desc}</div>
                  </div>
                  <div className="text-sm font-bold shrink-0" style={{ color: 'var(--text-dim)' }}>{m.progress}</div>
                  <div className="text-base font-bold shrink-0" style={{ color: 'var(--gold)' }}>{m.reward}</div>
                  <button
                    disabled={m.done || m.progress.split('/')[0] !== m.progress.split('/')[1]}
                    className="shrink-0 px-4 py-2 rounded-xl text-sm font-bold disabled:opacity-40"
                    style={{ background: m.done ? 'rgba(255,255,255,0.08)' : 'var(--blue)', color: '#fff' }}>
                    {m.done ? '완료' : '수령'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════ 출석 체크 모달 ═══════════════════ */}
      {modal === 'attendance' && (
        <div className="popup-overlay" onClick={() => setModal(null)}>
          <div className="popup-panel-wide" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-white font-bold text-xl">📅 출석 체크</h2>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-dim)' }}>28일 연속 출석 시 특별 보상 지급</p>
              </div>
              <button onClick={() => setModal(null)} className="text-gray-400 hover:text-white text-2xl">✕</button>
            </div>

            <div className="grid grid-cols-7 gap-2 mb-4">
              {ATTENDANCE_REWARDS.map((reward, i) => {
                const day    = i + 1
                const isPast = day < TODAY_DAY
                const isToday = day === TODAY_DAY
                const isFuture = day > TODAY_DAY
                const isSpecial = day % 7 === 0
                return (
                  <div key={i}
                    className="flex flex-col items-center gap-1.5 rounded-xl p-2.5"
                    style={{
                      background: isPast
                        ? 'rgba(107,203,119,0.12)'
                        : isToday
                        ? 'rgba(245,197,24,0.18)'
                        : 'rgba(255,255,255,0.04)',
                      border: `1px solid ${
                        isToday
                          ? 'rgba(245,197,24,0.6)'
                          : isSpecial
                          ? 'rgba(192,132,252,0.35)'
                          : 'var(--border)'}`,
                    }}>
                    <div className="text-xs font-bold"
                      style={{ color: isToday ? 'var(--gold)' : isPast ? '#6BCB77' : 'var(--text-dim)' }}>
                      {day}일
                    </div>
                    <div className="text-center leading-tight"
                      style={{ fontSize: 11, color: isSpecial ? '#c084fc' : 'var(--text-muted)' }}>
                      {reward}
                    </div>
                    {isPast && <span style={{ fontSize: 14, color: '#6BCB77' }}>✓</span>}
                    {isToday && !todayChecked && <span style={{ fontSize: 10, color: 'var(--gold)', fontWeight: 'bold' }}>TODAY</span>}
                  </div>
                )
              })}
            </div>

            <button
              onClick={() => { setTodayChecked(true); setModal(null) }}
              disabled={todayChecked}
              className="w-full py-3 rounded-2xl text-base font-bold disabled:opacity-40"
              style={{ background: todayChecked ? '#374151' : 'linear-gradient(135deg, var(--gold), #fbbf24)', color: '#1a0f3a' }}>
              {todayChecked ? '오늘 출석 완료 ✓' : '오늘 출석 체크 (🪙 200)'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
