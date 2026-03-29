const TABS = [
  { id: 'home',       label: '홈',     icon: '🏠' },
  { id: 'characters', label: '캐릭터', icon: '⚔️' },
  { id: 'quest',      label: '임무',   icon: '🗺️' },
  { id: 'party',      label: '편성',   icon: '👥' },
  { id: 'gacha',      label: '뽑기',   icon: '✨' },
  { id: 'event',      label: '이벤트', icon: '🎁' },
  { id: 'shop',       label: '상점',   icon: '🛒' },
]

export default function Nav({ current, onNavigate }) {
  return (
    <nav
      className="flex items-center justify-around px-2 shrink-0"
      style={{ height: 'var(--nav-h)', background: 'rgba(15,7,40,0.98)', borderTop: '1px solid var(--border)' }}
    >
      {TABS.map(tab => {
        const isActive = current === tab.id
        return (
          <button
            key={tab.id}
            onClick={() => onNavigate(tab.id)}
            className="flex flex-col items-center justify-center gap-1 flex-1 transition-all"
            style={{ height: '100%' }}
          >
            <div
              className="flex items-center justify-center rounded-full transition-all"
              style={{
                width: 40,
                height: 40,
                background: isActive ? 'var(--gold)' : 'rgba(255,255,255,0.07)',
                boxShadow: isActive ? '0 0 12px rgba(245,197,24,0.5)' : 'none',
              }}
            >
              <span style={{ fontSize: 18 }}>{tab.icon}</span>
            </div>
            <span
              className="text-xs font-semibold leading-none"
              style={{ color: isActive ? 'var(--gold)' : 'var(--text-dim)' }}
            >
              {tab.label}
            </span>
          </button>
        )
      })}
    </nav>
  )
}
