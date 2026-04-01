import { useState, useEffect } from 'react'
import { setVolume } from '../../utils/audio'

export default function SettingsPopup({ onClose, onReset, settings = {}, onSettingsChange }) {
  const [bgm, setBgm]               = useState(Math.round((settings.bgmVolume ?? 0.5) * 100))
  const [sfx, setSfx]               = useState(Math.round((settings.sfxVolume ?? 0.7) * 100))
  const [showResetConfirm, setShow] = useState(false)

  useEffect(() => {
    setVolume('bgm', bgm / 100)
    onSettingsChange?.('bgmVolume', bgm / 100)
  }, [bgm])

  useEffect(() => {
    setVolume('sfx', sfx / 100)
    onSettingsChange?.('sfxVolume', sfx / 100)
  }, [sfx])

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-panel" style={{ maxWidth: 440 }} onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-white font-bold text-xl">⚙️ 설정</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl leading-none">✕</button>
        </div>

        <div className="flex flex-col gap-5">
          {/* BGM */}
          <div className="game-card p-4">
            <div className="flex justify-between items-center mb-3">
              <span className="text-white font-semibold">🎵 BGM 볼륨</span>
              <span className="text-sm font-bold" style={{ color: 'var(--gold)' }}>{bgm}%</span>
            </div>
            <input
              type="range" min={0} max={100} value={bgm}
              onChange={e => setBgm(Number(e.target.value))}
              className="w-full accent-yellow-400"
            />
            <div className="flex justify-between text-xs mt-1" style={{ color: 'var(--text-dim)' }}>
              <span>0%</span><span>100%</span>
            </div>
          </div>

          {/* SFX */}
          <div className="game-card p-4">
            <div className="flex justify-between items-center mb-3">
              <span className="text-white font-semibold">🔊 효과음 볼륨</span>
              <span className="text-sm font-bold" style={{ color: 'var(--gold)' }}>{sfx}%</span>
            </div>
            <input
              type="range" min={0} max={100} value={sfx}
              onChange={e => setSfx(Number(e.target.value))}
              className="w-full accent-yellow-400"
            />
            <div className="flex justify-between text-xs mt-1" style={{ color: 'var(--text-dim)' }}>
              <span>0%</span><span>100%</span>
            </div>
          </div>

          {/* 게임 정보 */}
          <div className="game-card p-4">
            <div className="text-sm font-bold mb-3" style={{ color: 'var(--text-muted)' }}>게임 정보</div>
            <div className="flex flex-col gap-2 text-sm" style={{ color: 'var(--text-dim)' }}>
              <div className="flex justify-between">
                <span>버전</span>
                <span className="text-white">v0.1.0</span>
              </div>
              <div className="flex justify-between">
                <span>저장 방식</span>
                <span className="text-white">로컬 저장소</span>
              </div>
            </div>
          </div>

          <div className="border-t" style={{ borderColor: 'var(--border)' }} />

          {/* 데이터 초기화 */}
          {!showResetConfirm ? (
            <button
              onClick={() => setShow(true)}
              className="w-full py-3 rounded-xl text-sm font-semibold"
              style={{ background: 'rgba(239,68,68,0.15)', color: '#f87171', border: '1px solid rgba(239,68,68,0.3)' }}
            >
              데이터 초기화
            </button>
          ) : (
            <div className="rounded-2xl p-4 text-center flex flex-col gap-3"
              style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}>
              <p className="text-sm leading-relaxed" style={{ color: '#f87171' }}>
                정말 초기화하시겠습니까?<br />
                <strong>모든 데이터가 영구 삭제됩니다.</strong>
              </p>
              <div className="flex gap-3">
                <button onClick={() => setShow(false)}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold"
                  style={{ background: 'rgba(255,255,255,0.1)', color: '#fff' }}>취소</button>
                <button onClick={() => { onReset(); onClose() }}
                  className="flex-1 py-2.5 rounded-xl text-sm font-bold"
                  style={{ background: '#ef4444', color: '#fff' }}>초기화</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
