import { useState } from 'react'
import { CHARACTER_POOL, RARITY_COLOR, ELEMENT_COLOR, ROLE_LABEL, ROLE_COLOR } from '../data/characters'

const MAX_PARTY = 4

export default function PartyPage({ party, ownedCharacters, onUpdateParty }) {
  const [showPicker, setShowPicker] = useState(null) // 슬롯 인덱스

  const ownedList = CHARACTER_POOL.filter(c => ownedCharacters[c.id])

  function pickCharacter(charId) {
    if (showPicker === null) return
    const newParty = [...party]
    // 이미 다른 슬롯에 있으면 제거
    const existingIdx = newParty.indexOf(charId)
    if (existingIdx !== -1) newParty[existingIdx] = null

    newParty[showPicker] = charId
    onUpdateParty(newParty.filter(Boolean))
    setShowPicker(null)
  }

  function removeFromSlot(idx) {
    const newParty = party.filter((_, i) => {
      const slotChar = party[idx]
      return party[i] !== slotChar
    })
    onUpdateParty(newParty)
  }

  return (
    <div className="flex flex-col h-full p-4 gap-4">
      {/* 타이틀 */}
      <div className="shrink-0">
        <h2 className="text-white font-bold text-lg">파티 편성</h2>
        <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>최대 {MAX_PARTY}명까지 편성 가능</p>
      </div>

      {/* 파티 슬롯 */}
      <div className="flex gap-4 shrink-0 justify-center">
        {Array.from({ length: MAX_PARTY }).map((_, i) => {
          const charId = party[i]
          const char   = charId ? CHARACTER_POOL.find(c => c.id === charId) : null
          const owned  = char ? ownedCharacters[char.id] : null
          const isActive = showPicker === i

          return (
            <div key={i} className="flex flex-col items-center gap-2" style={{ width: 160 }}>
              <button
                onClick={() => setShowPicker(isActive ? null : i)}
                className="relative rounded-2xl overflow-hidden transition-all hover:brightness-110"
                style={{
                  width: 160, height: 200,
                  background: char ? 'var(--card)' : 'rgba(255,255,255,0.04)',
                  border: `2px solid ${isActive ? 'var(--gold)' : char ? RARITY_COLOR[char.rarity] + '66' : 'rgba(255,255,255,0.1)'}`,
                  boxShadow: isActive ? '0 0 16px rgba(245,197,24,0.4)' : 'none',
                }}
              >
                {char ? (
                  <>
                    <img
                      src={char.image} alt={char.name}
                      className="w-full h-full object-cover"
                      onError={e => { e.target.style.display = 'none' }}
                    />
                    {/* 그라디언트 오버레이 */}
                    <div
                      className="absolute bottom-0 left-0 right-0 px-3 py-2"
                      style={{ background: 'linear-gradient(transparent, rgba(0,0,0,0.85))' }}
                    >
                      <div className="text-white text-sm font-bold">{char.name}</div>
                      <div className="flex items-center justify-between mt-0.5">
                        <span className="text-xs" style={{ color: ROLE_COLOR[char.role] }}>{ROLE_LABEL[char.role]}</span>
                        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Lv.{owned?.level}</span>
                      </div>
                    </div>
                    {/* 레벨 뱃지 */}
                    <div
                      className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-xs font-bold"
                      style={{ background: 'rgba(0,0,0,0.7)', color: '#fff' }}
                    >Lv.{owned?.level}</div>
                    {/* 별 */}
                    <div className="absolute top-2 right-2 flex gap-0.5">
                      {Array.from({ length: char.rarity }).map((_, si) => (
                        <span key={si} style={{ color: 'var(--gold)', fontSize: 10 }}>★</span>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                      style={{ background: 'rgba(255,255,255,0.06)', border: '2px dashed rgba(255,255,255,0.15)' }}
                    >+</div>
                    <span className="text-xs" style={{ color: 'var(--text-dim)' }}>캐릭터 추가</span>
                  </div>
                )}
              </button>

              {/* 제거 버튼 */}
              {char && (
                <button
                  onClick={() => removeFromSlot(i)}
                  className="text-xs px-3 py-1 rounded-lg"
                  style={{ background: 'rgba(239,68,68,0.15)', color: '#f87171' }}
                >제거</button>
              )}
            </div>
          )
        })}
      </div>

      {/* 캐릭터 선택 피커 */}
      {showPicker !== null && (
        <div className="flex-1 flex flex-col gap-2 overflow-hidden">
          <div className="text-sm font-semibold shrink-0" style={{ color: 'var(--text-muted)' }}>
            {showPicker + 1}번 슬롯 — 캐릭터 선택
          </div>
          {ownedList.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center" style={{ color: 'var(--text-dim)' }}>
                <div className="text-3xl mb-2">⚔️</div>
                <div className="text-sm">보유 캐릭터가 없습니다</div>
              </div>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto">
              <div className="flex gap-3 flex-wrap">
                {ownedList.map(char => {
                  const inParty = party.includes(char.id)
                  return (
                    <button
                      key={char.id}
                      onClick={() => pickCharacter(char.id)}
                      className="flex items-center gap-3 rounded-2xl px-4 py-3 transition-all hover:brightness-110"
                      style={{
                        background: inParty ? 'rgba(74,144,217,0.15)' : 'var(--card)',
                        border: `1px solid ${inParty ? 'var(--blue)' : 'var(--border)'}`,
                        width: 200,
                      }}
                    >
                      <div className="w-12 h-12 rounded-xl bg-gray-900 overflow-hidden shrink-0">
                        <img src={char.image} alt={char.name} className="w-full h-full object-cover"
                          onError={e => { e.target.style.display = 'none' }} />
                      </div>
                      <div className="text-left">
                        <div className="text-white text-sm font-bold">{char.name}</div>
                        <div className="flex gap-0.5 mt-0.5">
                          {Array.from({ length: char.rarity }).map((_, i) => (
                            <span key={i} style={{ color: 'var(--gold)', fontSize: 11 }}>★</span>
                          ))}
                        </div>
                      </div>
                      {inParty && <span className="ml-auto text-sm" style={{ color: 'var(--blue-light)' }}>✓</span>}
                    </button>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 편성 완료 버튼 */}
      <button
        className="btn-primary w-full py-3 shrink-0 text-base"
        onClick={() => setShowPicker(null)}
      >
        편성 완료
      </button>
    </div>
  )
}
