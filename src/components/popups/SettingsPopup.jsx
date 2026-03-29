import { useState } from 'react'

export default function SettingsPopup({ onClose, onReset }) {
  const [bgm, setBgm] = useState(80)
  const [sfx, setSfx] = useState(100)
  const [showResetConfirm, setShowResetConfirm] = useState(false)

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-panel" onClick={e => e.stopPropagation()}>
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-white font-bold text-lg">⚙️ 설정</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-xl leading-none">✕</button>
        </div>

        <div className="flex flex-col gap-5">
          {/* BGM */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-white text-sm font-semibold">🎵 BGM</span>
              <span className="text-sm" style={{ color: 'var(--gold)' }}>{bgm}%</span>
            </div>
            <input
              type="range" min={0} max={100} value={bgm}
              onChange={e => setBgm(Number(e.target.value))}
              className="w-full accent-yellow-400"
            />
          </div>

          {/* SFX */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-white text-sm font-semibold">🔊 효과음</span>
              <span className="text-sm" style={{ color: 'var(--gold)' }}>{sfx}%</span>
            </div>
            <input
              type="range" min={0} max={100} value={sfx}
              onChange={e => setSfx(Number(e.target.value))}
              className="w-full accent-yellow-400"
            />
          </div>

          <div className="border-t" style={{ borderColor: 'var(--border)' }} />

          {/* 데이터 초기화 */}
          {!showResetConfirm ? (
            <button
              onClick={() => setShowResetConfirm(true)}
              className="w-full py-2.5 rounded-xl text-sm font-semibold"
              style={{ background: 'rgba(239,68,68,0.15)', color: '#f87171', border: '1px solid rgba(239,68,68,0.3)' }}
            >
              데이터 초기화
            </button>
          ) : (
            <div className="rounded-xl p-3 text-center flex flex-col gap-3" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}>
              <p className="text-sm" style={{ color: '#f87171' }}>정말 초기화하시겠습니까?<br/>모든 데이터가 삭제됩니다.</p>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="flex-1 py-2 rounded-lg text-sm font-semibold"
                  style={{ background: 'rgba(255,255,255,0.1)', color: '#fff' }}
                >취소</button>
                <button
                  onClick={() => { onReset(); onClose() }}
                  className="flex-1 py-2 rounded-lg text-sm font-semibold"
                  style={{ background: '#ef4444', color: '#fff' }}
                >초기화</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
