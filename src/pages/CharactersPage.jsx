import { useState } from 'react'
import { CHARACTER_POOL, RARITY_COLOR, ELEMENT_COLOR, ROLE_LABEL, ROLE_COLOR, getStatAtLevel } from '../data/characters'

const FILTERS = [
  { id: 'all',      label: '전체' },
  { id: 'striker',  label: '전위' },
  { id: 'special',  label: '중위' },
  { id: 'support',  label: '후위' },
]

const EXP_PER_LEVEL = 100

export default function CharactersPage({ ownedCharacters, onLevelUp, growthCurrency }) {
  const [filter, setFilter] = useState('all')
  const [selected, setSelected] = useState(null)

  const filtered = CHARACTER_POOL.filter(c => filter === 'all' || c.role === filter)
  const selectedChar = selected ? CHARACTER_POOL.find(c => c.id === selected) : null
  const selectedOwned = selectedChar ? ownedCharacters[selectedChar.id] : null

  return (
    <div className="flex h-full">
      {/* 좌: 목록 */}
      <div className="flex-1 flex flex-col overflow-hidden p-4 gap-3">
        {/* 타이틀 + 필터 */}
        <div className="flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-white font-bold text-lg">캐릭터 목록</h2>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
              보유 캐릭터: {Object.keys(ownedCharacters).length}명
            </p>
          </div>
          <div className="flex gap-1.5">
            {FILTERS.map(f => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className="px-4 py-1.5 rounded-lg text-sm font-semibold transition-all"
                style={{
                  background: filter === f.id ? 'var(--blue)' : 'rgba(255,255,255,0.07)',
                  color: filter === f.id ? '#fff' : 'var(--text-muted)',
                  border: `1px solid ${filter === f.id ? 'var(--blue)' : 'transparent'}`,
                }}
              >{f.label}</button>
            ))}
          </div>
        </div>

        {/* 카드 그리드 */}
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-5 gap-3 pb-2">
            {filtered.map(char => {
              const owned = ownedCharacters[char.id]
              const isSelected = selected === char.id
              return (
                <button
                  key={char.id}
                  onClick={() => setSelected(char.id)}
                  className="flex flex-col rounded-2xl overflow-hidden transition-all text-left"
                  style={{
                    border: `2px solid ${isSelected ? 'var(--gold)' : RARITY_COLOR[char.rarity] + '44'}`,
                    opacity: owned ? 1 : 0.35,
                    boxShadow: isSelected ? `0 0 16px rgba(245,197,24,0.4)` : 'none',
                  }}
                >
                  {/* 이미지 영역 */}
                  <div
                    className="relative w-full aspect-square bg-gray-900 overflow-hidden"
                  >
                    <img
                      src={char.image} alt={char.name}
                      className="w-full h-full object-cover"
                      onError={e => { e.target.style.display = 'none' }}
                    />
                    {/* 레벨 배지 */}
                    {owned && (
                      <div
                        className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-full text-xs font-bold"
                        style={{ background: 'rgba(0,0,0,0.75)', color: '#fff' }}
                      >Lv.{owned.level}</div>
                    )}
                    {/* 희귀도 별 */}
                    <div className="absolute top-1.5 right-1.5">
                      <div className="flex gap-0.5">
                        {Array.from({ length: char.rarity }).map((_, i) => (
                          <span key={i} style={{ color: 'var(--gold)', fontSize: 11 }}>★</span>
                        ))}
                      </div>
                    </div>
                    {/* 엘리먼트 컬러 바 */}
                    <div
                      className="absolute bottom-0 left-0 right-0 h-0.5"
                      style={{ background: ELEMENT_COLOR[char.element] }}
                    />
                  </div>

                  {/* 이름 영역 */}
                  <div
                    className="px-2 py-1.5"
                    style={{ background: 'rgba(255,255,255,0.07)' }}
                  >
                    <div className="text-white text-xs font-semibold truncate">{char.name}</div>
                    {/* EXP 바 */}
                    <div className="w-full h-1 rounded-full mt-1.5" style={{ background: 'rgba(255,255,255,0.1)' }}>
                      <div
                        className="h-1 rounded-full"
                        style={{ width: owned ? '40%' : '0%', background: 'var(--blue-light)' }}
                      />
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* 우: 상세 패널 */}
      <aside
        className="w-64 shrink-0 flex flex-col gap-3 p-4 overflow-y-auto"
        style={{ borderLeft: '1px solid var(--border)' }}
      >
        {selectedChar ? (
          <>
            {/* 캐릭터 이미지 */}
            <div
              className="rounded-2xl overflow-hidden flex items-center justify-center relative"
              style={{ background: '#111', height: 180, border: `1px solid ${RARITY_COLOR[selectedChar.rarity]}44` }}
            >
              <img
                src={selectedChar.image} alt={selectedChar.name}
                className="h-full object-contain"
                onError={e => { e.target.style.display = 'none' }}
              />
              <div
                className="absolute bottom-0 left-0 right-0 px-3 py-2"
                style={{ background: 'linear-gradient(transparent, rgba(0,0,0,0.8))' }}
              >
                <div className="text-white font-bold">{selectedChar.name}</div>
                <div className="flex gap-1 mt-0.5">
                  {Array.from({ length: selectedChar.rarity }).map((_, i) => (
                    <span key={i} style={{ color: 'var(--gold)', fontSize: 12 }}>★</span>
                  ))}
                </div>
              </div>
            </div>

            {/* 역할/속성 태그 */}
            <div className="flex gap-2">
              <span className="text-xs px-2.5 py-1 rounded-lg font-semibold"
                style={{ background: ROLE_COLOR[selectedChar.role] + '22', color: ROLE_COLOR[selectedChar.role] }}>
                {ROLE_LABEL[selectedChar.role]}
              </span>
              <span className="text-xs px-2.5 py-1 rounded-lg font-semibold"
                style={{ background: ELEMENT_COLOR[selectedChar.element] + '22', color: ELEMENT_COLOR[selectedChar.element] }}>
                {selectedChar.element}
              </span>
            </div>

            {selectedOwned ? (
              <>
                {/* 스탯 */}
                <div className="game-card p-3">
                  <div className="text-xs font-bold mb-2" style={{ color: 'var(--text-muted)' }}>스탯 · Lv.{selectedOwned.level}</div>
                  <div className="grid grid-cols-2 gap-y-1.5 gap-x-2">
                    {Object.entries(selectedChar.baseStats).map(([stat, base]) => (
                      <div key={stat} className="flex justify-between text-xs">
                        <span style={{ color: 'var(--text-muted)' }}>{stat.toUpperCase()}</span>
                        <span className="text-white font-bold">{getStatAtLevel(base, selectedOwned.level).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 스킬 */}
                <div className="game-card p-3">
                  <div className="text-xs font-bold mb-2" style={{ color: 'var(--text-muted)' }}>스킬</div>
                  <div className="flex flex-col gap-2">
                    {Object.entries(selectedChar.skills).map(([key, skill]) => (
                      <div key={key} className="flex gap-2">
                        <div
                          className="w-8 h-8 rounded-lg shrink-0 flex items-center justify-center text-xs font-black"
                          style={{
                            background: key === 'ex' ? 'linear-gradient(135deg, #7c3aed, #c084fc)' : 'rgba(255,255,255,0.1)',
                            color: key === 'ex' ? '#fff' : 'var(--text-muted)',
                          }}
                        >{key === 'ex' ? 'EX' : key === 'skill1' ? 'S1' : 'S2'}</div>
                        <div>
                          <div className="text-white text-xs font-semibold">{skill.name}</div>
                          <div className="text-xs mt-0.5 leading-tight" style={{ color: 'var(--text-dim)' }}>{skill.description}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 레벨업 */}
                <button
                  onClick={() => onLevelUp(selectedChar.id, EXP_PER_LEVEL)}
                  disabled={growthCurrency < EXP_PER_LEVEL}
                  className="w-full py-2.5 rounded-xl text-sm font-bold transition-all disabled:opacity-40"
                  style={{ background: growthCurrency >= EXP_PER_LEVEL ? 'var(--blue)' : '#374151', color: '#fff' }}
                >
                  레벨업 <span style={{ color: 'var(--gold-light)' }}>🪙 {EXP_PER_LEVEL}</span>
                </button>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center gap-2 py-8">
                <div className="text-3xl">🔒</div>
                <div className="text-sm text-white">미보유 캐릭터</div>
                <div className="text-xs text-center" style={{ color: 'var(--text-dim)' }}>뽑기로 획득해보세요!</div>
              </div>
            )}
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center gap-2">
            <div className="text-3xl opacity-30">⚔️</div>
            <div className="text-sm" style={{ color: 'var(--text-dim)' }}>캐릭터를 선택하세요</div>
          </div>
        )}
      </aside>
    </div>
  )
}
