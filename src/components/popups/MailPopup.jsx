import { useState } from 'react'

const MOCK_MAILS = [
  { id: 1, title: '오픈 기념 뽑기 재화 지급',  from: '운영팀', reward: '💎 3,000', date: '03.29', isNew: true,  expiry: '2025.04.29' },
  { id: 2, title: '첫 접속 보상',              from: '시스템',  reward: '💎 500',   date: '03.29', isNew: true,  expiry: '2025.04.29' },
  { id: 3, title: '업데이트 보상',              from: '운영팀', reward: '🪙 50,000', date: '03.28', isNew: false, expiry: '2025.04.28' },
]

export default function MailPopup({ onClose, onClaim }) {
  const [selected, setSelected] = useState(null)

  const selectedMail = MOCK_MAILS.find(m => m.id === selected)
  const newCount = MOCK_MAILS.filter(m => m.isNew).length

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-panel-wide" onClick={e => e.stopPropagation()}>
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-white font-bold text-xl">✉️ 우편함</h2>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-dim)' }}>
              미수령 {newCount}건 · 만료된 우편은 자동 삭제됩니다
            </p>
          </div>
          <div className="flex gap-2 items-center">
            <button
              className="text-sm px-4 py-2 rounded-xl font-bold"
              style={{ background: 'var(--gold)', color: '#1a0f3a' }}
              onClick={onClaim}
            >전체 수령</button>
            <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl leading-none ml-1">✕</button>
          </div>
        </div>

        <div className="flex gap-4" style={{ minHeight: 280 }}>
          {/* 메일 목록 */}
          <div className="flex flex-col gap-2 w-72 shrink-0">
            {MOCK_MAILS.map(mail => (
              <button
                key={mail.id}
                onClick={() => setSelected(mail.id)}
                className="flex items-center gap-3 rounded-xl p-3.5 text-left transition-all hover:brightness-110"
                style={{
                  background: selected === mail.id
                    ? 'rgba(245,197,24,0.12)'
                    : mail.isNew ? 'rgba(245,197,24,0.07)' : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${selected === mail.id ? 'rgba(245,197,24,0.4)' : mail.isNew ? 'rgba(245,197,24,0.2)' : 'var(--border)'}`,
                }}
              >
                {mail.isNew && (
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ background: '#ef4444' }} />
                )}
                <div className="flex-1 min-w-0">
                  <div className="text-white text-sm font-semibold truncate">{mail.title}</div>
                  <div className="text-xs mt-0.5" style={{ color: 'var(--text-dim)' }}>
                    {mail.from} · {mail.date}
                  </div>
                </div>
                <div className="shrink-0 text-sm font-bold" style={{ color: 'var(--gold)' }}>{mail.reward}</div>
              </button>
            ))}
          </div>

          {/* 메일 상세 */}
          <div className="flex-1 rounded-2xl p-4 flex flex-col"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)' }}>
            {selectedMail ? (
              <>
                <div className="flex items-center gap-2 mb-3">
                  {selectedMail.isNew && (
                    <span className="text-xs px-2 py-0.5 rounded font-bold"
                      style={{ background: 'rgba(239,68,68,0.2)', color: '#ef4444' }}>NEW</span>
                  )}
                  <span className="text-xs" style={{ color: 'var(--text-dim)' }}>
                    발신: {selectedMail.from} · {selectedMail.date}
                  </span>
                </div>
                <h3 className="text-white font-bold text-base mb-4">{selectedMail.title}</h3>
                <div className="flex-1" />
                <div className="rounded-xl p-3 flex items-center justify-between"
                  style={{ background: 'rgba(245,197,24,0.1)', border: '1px solid rgba(245,197,24,0.25)' }}>
                  <div>
                    <div className="text-xs mb-0.5" style={{ color: 'var(--text-dim)' }}>첨부 보상</div>
                    <div className="text-lg font-black" style={{ color: 'var(--gold)' }}>{selectedMail.reward}</div>
                  </div>
                  <div className="text-xs" style={{ color: 'var(--text-dim)' }}>만료: {selectedMail.expiry}</div>
                </div>
                <button
                  className="mt-3 w-full py-2.5 rounded-xl text-sm font-bold"
                  style={{ background: selectedMail.isNew ? 'var(--blue)' : 'rgba(255,255,255,0.1)', color: '#fff' }}>
                  {selectedMail.isNew ? '수령' : '이미 수령됨'}
                </button>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-center">
                <div>
                  <div className="text-3xl mb-2 opacity-30">✉️</div>
                  <div className="text-sm" style={{ color: 'var(--text-dim)' }}>메일을 선택하세요</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
