import { useState } from 'react'
import { CHAPTERS } from '../data/stages'

// 스테이지 노드 위치 (맵 내 상대 좌표 %)
const STAGE_POSITIONS = [
  { x: 8,  y: 50 },
  { x: 23, y: 32 },
  { x: 38, y: 52 },
  { x: 53, y: 30 },
  { x: 68, y: 55 },
  { x: 83, y: 35 },
]

export default function QuestPage({ clearedStages = {}, onSelectStage }) {
  const [selectedChapter, setSelectedChapter] = useState(CHAPTERS[0])

  const stages = selectedChapter.stages

  return (
    <div className="flex h-full">
      {/* 좌: 챕터 목록 */}
      <aside
        className="flex flex-col gap-2 p-3 overflow-y-auto shrink-0"
        style={{ width: 180, borderRight: '1px solid var(--border)' }}
      >
        <div className="text-xs font-bold px-1 mb-1" style={{ color: 'var(--text-dim)' }}>챕터 선택</div>
        {CHAPTERS.map((chapter, ci) => {
          const isSelected = selectedChapter.id === chapter.id
          const isLocked = chapter.locked
          const chapterStars = chapter.stages.reduce((acc, s) => acc + (clearedStages[s.id]?.stars || 0), 0)
          const maxStars = chapter.stages.length * 3

          return (
            <button
              key={chapter.id}
              disabled={isLocked}
              onClick={() => !isLocked && setSelectedChapter(chapter)}
              className="w-full text-left rounded-2xl p-3 transition-all"
              style={{
                background: isSelected ? 'rgba(74,144,217,0.2)' : 'rgba(255,255,255,0.04)',
                border: `1px solid ${isSelected ? 'var(--blue)' : 'var(--border)'}`,
                opacity: isLocked ? 0.4 : 1,
                cursor: isLocked ? 'not-allowed' : 'pointer',
              }}
            >
              <div className="text-xs font-bold" style={{ color: isSelected ? 'var(--blue-light)' : 'var(--text-muted)' }}>
                Chapter {ci + 1}
              </div>
              <div className="text-white text-sm font-bold mt-0.5">{chapter.subtitle}</div>
              <div className="flex gap-0.5 mt-1.5">
                {Array.from({ length: 3 }).map((_, i) => (
                  <span key={i} style={{ color: i < Math.round(chapterStars / Math.max(maxStars, 1) * 3) ? 'var(--gold)' : 'var(--text-dim)', fontSize: 12 }}>★</span>
                ))}
              </div>
              {isLocked && <div className="text-xs mt-1" style={{ color: 'var(--text-dim)' }}>🔒 잠금</div>}
            </button>
          )
        })}
      </aside>

      {/* 우: 맵 */}
      <main className="flex-1 relative overflow-hidden">
        {/* 배경 */}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(135deg, #0d1b3e 0%, #0f2a1a 50%, #1a1a0d 100%)' }}
        />
        <div className="absolute inset-0 opacity-30"
          style={{ backgroundImage: 'radial-gradient(ellipse at 30% 60%, #1a4a2a 0%, transparent 50%)' }} />

        {/* SVG 연결선 */}
        <svg className="absolute inset-0 w-full h-full" style={{ pointerEvents: 'none' }}>
          {stages.map((stage, i) => {
            if (i === 0) return null
            const from = STAGE_POSITIONS[i - 1] || { x: 0, y: 50 }
            const to   = STAGE_POSITIONS[i]     || { x: 0, y: 50 }
            const cleared = clearedStages[stages[i - 1]?.id]
            return (
              <line
                key={stage.id}
                x1={`${from.x + 4}%`} y1={`${from.y}%`}
                x2={`${to.x - 4}%`}   y2={`${to.y}%`}
                stroke={cleared ? 'rgba(245,197,24,0.6)' : 'rgba(255,255,255,0.15)'}
                strokeWidth="3"
                strokeDasharray="8 5"
              />
            )
          })}
        </svg>

        {/* 스테이지 노드 */}
        {stages.map((stage, i) => {
          const pos     = STAGE_POSITIONS[i] || { x: 50, y: 50 }
          const cleared = clearedStages[stage.id]
          const isNext  = !cleared && (i === 0 || clearedStages[stages[i - 1]?.id])
          const isLocked = i > 0 && !clearedStages[stages[i - 1]?.id] && !cleared

          return (
            <div
              key={stage.id}
              className="absolute flex flex-col items-center"
              style={{ left: `${pos.x}%`, top: `${pos.y}%`, transform: 'translate(-50%, -50%)' }}
            >
              {/* 스태미나 배지 */}
              <div
                className="px-2 py-0.5 rounded-full text-xs font-bold mb-1.5 flex items-center gap-1"
                style={{ background: 'rgba(0,0,0,0.6)', color: 'var(--gold)', border: '1px solid rgba(245,197,24,0.3)' }}
              >
                ⚡ {stage.staminaCost}
              </div>

              {/* NEXT 배지 */}
              {isNext && (
                <div
                  className="absolute -top-7 px-2 py-0.5 rounded-full text-xs font-black"
                  style={{ background: '#ef4444', color: '#fff' }}
                >NEXT</div>
              )}

              {/* 노드 버튼 */}
              <button
                disabled={isLocked}
                onClick={() => !isLocked && onSelectStage && onSelectStage(stage)}
                className="flex items-center justify-center rounded-full font-black text-lg transition-all hover:scale-110"
                style={{
                  width: 72, height: 72,
                  background: isLocked
                    ? 'rgba(100,100,100,0.4)'
                    : cleared
                    ? 'linear-gradient(135deg, #16a34a, #22c55e)'
                    : isNext
                    ? 'linear-gradient(135deg, #f5c518, #fbbf24)'
                    : 'linear-gradient(135deg, #f5c518, #fbbf24)',
                  border: `3px solid ${isLocked ? 'rgba(255,255,255,0.1)' : cleared ? '#22c55e' : 'rgba(255,255,255,0.5)'}`,
                  boxShadow: isNext ? '0 0 20px rgba(245,197,24,0.6)' : cleared ? '0 0 12px rgba(34,197,94,0.4)' : 'none',
                  cursor: isLocked ? 'not-allowed' : 'pointer',
                  color: isLocked ? 'rgba(255,255,255,0.3)' : '#1a0f3a',
                }}
              >
                {isLocked ? '🔒' : cleared ? '✓' : stage.title}
              </button>

              {/* 별 평점 */}
              <div className="flex gap-0.5 mt-1.5">
                {Array.from({ length: 3 }).map((_, si) => (
                  <span key={si} style={{ color: si < (cleared?.stars || 0) ? 'var(--gold)' : 'rgba(255,255,255,0.2)', fontSize: 12 }}>★</span>
                ))}
              </div>

              {/* 보스 표시 */}
              {stage.isBoss && (
                <div className="text-xs mt-0.5 font-bold" style={{ color: '#f87171' }}>BOSS</div>
              )}
            </div>
          )
        })}
      </main>
    </div>
  )
}
