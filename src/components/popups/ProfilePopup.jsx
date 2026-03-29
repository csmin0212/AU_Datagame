export default function ProfilePopup({ onClose, playerName = '플레이어', playerLevel = 1, ownedCharacters = {} }) {
  const ownedCount = Object.keys(ownedCharacters).length

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-panel" onClick={e => e.stopPropagation()}>
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-white font-bold text-lg">👤 프로필</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-xl leading-none">✕</button>
        </div>

        {/* 아바타 */}
        <div className="flex flex-col items-center gap-3 mb-6">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #4a90d9)', border: '3px solid rgba(255,255,255,0.2)' }}
          >
            {playerName[0]}
          </div>
          <div className="text-center">
            <div className="text-white font-bold text-xl">{playerName}</div>
            <div className="text-sm mt-0.5" style={{ color: 'var(--gold)' }}>Lv. {playerLevel}</div>
          </div>
        </div>

        {/* 스탯 */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: '보유 캐릭터', value: `${ownedCount}명` },
            { label: '클리어 스테이지', value: '0' },
            { label: '총 뽑기 횟수', value: '0' },
            { label: '최고 전투력', value: '0' },
          ].map(stat => (
            <div
              key={stat.label}
              className="rounded-xl p-3 text-center"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)' }}
            >
              <div className="text-white font-bold text-lg">{stat.value}</div>
              <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
