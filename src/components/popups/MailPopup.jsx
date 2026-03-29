const MOCK_MAILS = [
  { id: 1, title: '오픈 기념 뽑기 재화 지급', from: '운영팀', reward: '💎 3,000', date: '03.29', isNew: true },
  { id: 2, title: '첫 접속 보상',             from: '시스템',  reward: '💎 500',   date: '03.29', isNew: true },
  { id: 3, title: '업데이트 보상',             from: '운영팀', reward: '🪙 50,000', date: '03.28', isNew: false },
]

export default function MailPopup({ onClose, onClaim }) {
  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-panel" onClick={e => e.stopPropagation()}>
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white font-bold text-lg">✉️ 우편함</h2>
          <div className="flex gap-2">
            <button
              className="text-xs px-3 py-1.5 rounded-lg font-semibold"
              style={{ background: 'var(--gold)', color: '#1a0f3a' }}
              onClick={onClaim}
            >전체 수령</button>
            <button onClick={onClose} className="text-gray-400 hover:text-white text-xl leading-none">✕</button>
          </div>
        </div>

        {/* 메일 목록 */}
        <div className="flex flex-col gap-2">
          {MOCK_MAILS.map(mail => (
            <div
              key={mail.id}
              className="flex items-center gap-3 rounded-xl p-3"
              style={{ background: mail.isNew ? 'rgba(245,197,24,0.08)' : 'rgba(255,255,255,0.04)', border: `1px solid ${mail.isNew ? 'rgba(245,197,24,0.2)' : 'var(--border)'}` }}
            >
              {mail.isNew && (
                <div className="w-2 h-2 rounded-full shrink-0" style={{ background: '#ef4444' }} />
              )}
              <div className="flex-1 min-w-0">
                <div className="text-white text-sm font-semibold truncate">{mail.title}</div>
                <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{mail.from} · {mail.date}</div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-sm" style={{ color: 'var(--gold)' }}>{mail.reward}</span>
                <button
                  className="text-xs px-2.5 py-1 rounded-lg font-semibold"
                  style={{ background: mail.isNew ? 'var(--blue)' : 'rgba(255,255,255,0.1)', color: '#fff' }}
                >수령</button>
              </div>
            </div>
          ))}
        </div>

        <p className="text-xs mt-4 text-center" style={{ color: 'var(--text-dim)' }}>
          만료된 우편은 자동 삭제됩니다.
        </p>
      </div>
    </div>
  )
}
