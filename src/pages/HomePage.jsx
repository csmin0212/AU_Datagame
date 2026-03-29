const QUICK_BUTTONS = [
  { label: '공지사항', icon: '📢', badge: 2 },
  { label: '일일 미션', icon: '🎯', badge: 5 },
  { label: '출석 체크', icon: '📅', badge: 1 },
]

export default function HomePage({ onNavigate }) {
  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* 배경 */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, #0f0728 0%, #1a0f3a 40%, #0d1b3e 100%)',
        }}
      />
      {/* 배경 장식 */}
      <div className="absolute inset-0 opacity-20"
        style={{ backgroundImage: 'radial-gradient(ellipse at 70% 50%, #4a90d9 0%, transparent 60%)' }} />
      <div className="absolute inset-0 opacity-10"
        style={{ backgroundImage: 'radial-gradient(ellipse at 30% 80%, #9b6fd9 0%, transparent 50%)' }} />

      {/* 중앙 환영 메시지 */}
      <div
        className="absolute rounded-2xl px-8 py-5 text-center"
        style={{
          top: '50%', left: '50%', transform: 'translate(-50%, -60%)',
          background: 'rgba(0,0,0,0.45)',
          border: '1px solid rgba(245,197,24,0.3)',
          backdropFilter: 'blur(8px)',
          minWidth: 280,
        }}
      >
        <div className="text-2xl font-bold text-white mb-1">환영합니다, 사령관님</div>
        <div className="text-sm" style={{ color: 'var(--text-muted)' }}>오늘도 위대한 모험이 당신을 기다립니다</div>
      </div>

      {/* 좌측 퀵버튼 */}
      <div className="absolute left-6 top-1/2 -translate-y-1/2 flex flex-col gap-3">
        {QUICK_BUTTONS.map(btn => (
          <button
            key={btn.label}
            className="relative flex items-center gap-3 px-4 py-3 rounded-2xl text-left transition-all hover:brightness-110"
            style={{
              background: 'rgba(26,15,58,0.85)',
              border: '1px solid rgba(255,255,255,0.12)',
              backdropFilter: 'blur(6px)',
              minWidth: 160,
            }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
              style={{ background: 'rgba(245,197,24,0.15)' }}
            >
              {btn.icon}
            </div>
            <span className="text-white font-semibold text-sm">{btn.label}</span>
            {btn.badge > 0 && (
              <span
                className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center"
                style={{ background: '#ef4444', color: '#fff' }}
              >{btn.badge}</span>
            )}
          </button>
        ))}
      </div>

      {/* 우측 하단 이벤트 배너 */}
      <button
        onClick={() => onNavigate('event')}
        className="absolute bottom-6 right-6 flex items-center gap-3 px-5 py-3.5 rounded-2xl transition-all hover:brightness-110"
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
    </div>
  )
}
