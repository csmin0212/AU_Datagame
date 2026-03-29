export default function TopBar({ currency, playerLevel = 1, playerName = '플레이어', onOpenPopup }) {
  const stamina = { current: 80, max: 120 }

  return (
    <header
      className="flex items-center justify-between px-4 shrink-0 z-10"
      style={{ height: 'var(--topbar-h)', background: 'rgba(15,7,40,0.95)', borderBottom: '1px solid var(--border)' }}
    >
      {/* 좌: 플레이어 정보 */}
      <button
        className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        onClick={() => onOpenPopup('profile')}
      >
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shrink-0"
          style={{ background: 'linear-gradient(135deg, #7c3aed, #4a90d9)', border: '2px solid rgba(255,255,255,0.3)' }}
        >
          {playerName[0]}
        </div>
        <div className="text-left leading-none">
          <div className="text-white text-sm font-bold">{playerName}</div>
          <div className="text-xs mt-0.5" style={{ color: 'var(--gold)' }}>Lv. {playerLevel}</div>
        </div>
      </button>

      {/* 중앙: 재화 */}
      <div className="flex items-center gap-2">
        {/* 스태미나 */}
        <div className="currency-pill">
          <span className="text-base">⚡</span>
          <span style={{ color: 'var(--gold)' }}>{stamina.current}/{stamina.max}</span>
          <button
            className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ml-1 hover:opacity-80"
            style={{ background: 'var(--gold)', color: '#1a0f3a' }}
          >+</button>
        </div>

        {/* 골드 */}
        <div className="currency-pill">
          <span className="text-base">🪙</span>
          <span style={{ color: '#fde68a' }}>{currency.growth.toLocaleString()}</span>
          <button
            className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ml-1 hover:opacity-80"
            style={{ background: '#fde68a', color: '#1a0f3a' }}
          >+</button>
        </div>

        {/* 뽑기 재화 */}
        <div className="currency-pill">
          <span className="text-base">💎</span>
          <span style={{ color: '#c084fc' }}>{currency.gacha.toLocaleString()}</span>
          <button
            className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ml-1 hover:opacity-80"
            style={{ background: '#c084fc', color: '#1a0f3a' }}
          >+</button>
        </div>
      </div>

      {/* 우: 아이콘 버튼들 */}
      <div className="flex items-center gap-1">
        <IconBtn icon="✉️" label="우편" badge={3} onClick={() => onOpenPopup('mail')} />
        <IconBtn icon="⚙️" label="설정" onClick={() => onOpenPopup('settings')} />
      </div>
    </header>
  )
}

function IconBtn({ icon, label, badge, onClick }) {
  return (
    <button
      onClick={onClick}
      className="relative flex items-center justify-center w-9 h-9 rounded-xl hover:opacity-80 transition-opacity"
      style={{ background: 'rgba(255,255,255,0.07)' }}
      title={label}
    >
      <span className="text-lg">{icon}</span>
      {badge > 0 && (
        <span
          className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-xs font-bold flex items-center justify-center"
          style={{ background: '#ef4444', color: '#fff', fontSize: '10px' }}
        >{badge}</span>
      )}
    </button>
  )
}
