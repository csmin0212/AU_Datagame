import { useState } from 'react'
import {
  CHARACTER_POOL, RARITY_COLOR, ELEMENT_COLOR, ELEMENT_LABEL,
  ROLE_LABEL, ROLE_COLOR, getStatAtLevel,
  EQUIPMENT_SLOT_LABEL, EQUIPMENT_SLOT_ICON,
} from '../data/characters'

const FILTERS = [
  { id: 'all',     label: '전체' },
  { id: 'striker', label: '전위' },
  { id: 'special', label: '중위' },
  { id: 'support', label: '후위' },
]

const EXP_PER_LEVEL = 100

export default function CharactersPage({ ownedCharacters, onLevelUp, growthCurrency, onEquip }) {
  const [filter,   setFilter]   = useState('all')
  const [selected, setSelected] = useState(null)
  const [tab,      setTab]      = useState('info') // 'info' | 'skills' | 'equip'

  const filtered      = CHARACTER_POOL.filter(c => filter === 'all' || c.role === filter)
  const selectedChar  = selected ? CHARACTER_POOL.find(c => c.id === selected) : null
  const selectedOwned = selectedChar ? ownedCharacters[selectedChar.id] : null

  return (
    <div className="flex h-full">

      {/* ── 좌: 캐릭터 목록 ── */}
      <div className="flex-1 flex flex-col overflow-hidden p-4 gap-3">
        {/* 헤더 */}
        <div className="flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-white font-bold text-lg">캐릭터 목록</h2>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
              보유 {Object.keys(ownedCharacters).length} / 전체 {CHARACTER_POOL.length}명
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
                  color:      filter === f.id ? '#fff' : 'var(--text-muted)',
                  border:     `1px solid ${filter === f.id ? 'var(--blue)' : 'transparent'}`,
                }}
              >{f.label}</button>
            ))}
          </div>
        </div>

        {/* 카드 그리드 */}
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-5 gap-3 pb-2">
            {filtered.map(char => {
              const owned      = ownedCharacters[char.id]
              const isSelected = selected === char.id
              return (
                <button
                  key={char.id}
                  onClick={() => { setSelected(char.id); setTab('info') }}
                  className="flex flex-col rounded-2xl overflow-hidden transition-all text-left"
                  style={{
                    border:    `2px solid ${isSelected ? 'var(--gold)' : RARITY_COLOR[char.rarity] + '44'}`,
                    opacity:   owned ? 1 : 0.35,
                    boxShadow: isSelected ? '0 0 16px rgba(245,197,24,0.4)' : 'none',
                  }}
                >
                  {/* 이미지 */}
                  <div className="relative w-full aspect-square bg-gray-900 overflow-hidden">
                    <img src={char.image} alt={char.name}
                      className="w-full h-full object-cover"
                      onError={e => { e.target.style.display = 'none' }} />
                    {owned && (
                      <div className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-full text-xs font-bold"
                        style={{ background: 'rgba(0,0,0,0.75)', color: '#fff' }}>
                        Lv.{owned.level}
                      </div>
                    )}
                    <div className="absolute top-1.5 right-1.5 flex gap-0.5">
                      {Array.from({ length: char.rarity }).map((_, i) => (
                        <span key={i} style={{ color: 'var(--gold)', fontSize: 11 }}>★</span>
                      ))}
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 h-0.5"
                      style={{ background: ELEMENT_COLOR[char.element] }} />
                  </div>
                  {/* 이름 */}
                  <div className="px-2 py-1.5" style={{ background: 'rgba(255,255,255,0.06)' }}>
                    <div className="text-white text-xs font-semibold truncate">{char.name}</div>
                    <div className="text-xs mt-0.5" style={{ color: ROLE_COLOR[char.role] }}>{ROLE_LABEL[char.role]}</div>
                    {/* EXP 바 */}
                    <div className="w-full h-1 rounded-full mt-1.5" style={{ background: 'rgba(255,255,255,0.1)' }}>
                      <div className="h-1 rounded-full" style={{
                        width: owned ? `${Math.min(((owned.exp % EXP_PER_LEVEL) / EXP_PER_LEVEL) * 100, 100)}%` : '0%',
                        background: 'var(--blue-light)',
                      }} />
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* ── 우: 상세 패널 ── */}
      <aside className="w-72 shrink-0 flex flex-col overflow-hidden"
        style={{ borderLeft: '1px solid var(--border)' }}>

        {!selectedChar ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-2">
            <div className="text-3xl opacity-30">⚔️</div>
            <div className="text-sm" style={{ color: 'var(--text-dim)' }}>캐릭터를 선택하세요</div>
          </div>
        ) : (
          <>
            {/* 캐릭터 이미지 + 기본 정보 */}
            <div className="relative shrink-0" style={{ height: 180 }}>
              <div className="w-full h-full bg-gray-900 overflow-hidden">
                <img src={selectedChar.image} alt={selectedChar.name}
                  className="w-full h-full object-cover object-top"
                  onError={e => { e.target.style.display = 'none' }} />
              </div>
              <div className="absolute inset-0 flex flex-col justify-end px-3 pb-2"
                style={{ background: 'linear-gradient(transparent 30%, rgba(0,0,0,0.85))' }}>
                <div className="flex items-end justify-between">
                  <div>
                    <div className="text-white font-black text-xl leading-tight">{selectedChar.name}</div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                        style={{ background: ROLE_COLOR[selectedChar.role] + '33', color: ROLE_COLOR[selectedChar.role] }}>
                        {ROLE_LABEL[selectedChar.role]}
                      </span>
                      <span className="text-xs" style={{ color: ELEMENT_COLOR[selectedChar.element] }}>
                        {ELEMENT_LABEL[selectedChar.element]}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex gap-0.5 justify-end">
                      {Array.from({ length: selectedChar.rarity }).map((_, i) => (
                        <span key={i} style={{ color: 'var(--gold)', fontSize: 14 }}>★</span>
                      ))}
                    </div>
                    <div className="text-xs mt-0.5" style={{ color: 'var(--text-dim)' }}>{selectedChar.job}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* 미보유 안내 */}
            {!selectedOwned && (
              <div className="flex-1 flex flex-col items-center justify-center gap-2 p-4">
                <div className="text-3xl">🔒</div>
                <div className="text-white font-semibold">미보유 캐릭터</div>
                <p className="text-xs text-center leading-relaxed" style={{ color: 'var(--text-dim)' }}>
                  {selectedChar.description}
                </p>
              </div>
            )}

            {/* 보유 시 탭 패널 */}
            {selectedOwned && (
              <>
                {/* 탭 버튼 */}
                <div className="flex shrink-0 border-b" style={{ borderColor: 'var(--border)' }}>
                  {[['info','기본 정보'],['skills','스킬'],['equip','장비']].map(([id, label]) => (
                    <button key={id} onClick={() => setTab(id)}
                      className="flex-1 py-2 text-xs font-semibold transition-all"
                      style={{
                        color:        tab === id ? 'var(--gold)' : 'var(--text-dim)',
                        borderBottom: tab === id ? '2px solid var(--gold)' : '2px solid transparent',
                      }}>
                      {label}
                    </button>
                  ))}
                </div>

                {/* 탭 컨텐츠 */}
                <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-3">

                  {/* ── 기본 정보 탭 ── */}
                  {tab === 'info' && (
                    <>
                      {/* 레벨 + EXP */}
                      <div className="game-card p-3">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xs font-bold" style={{ color: 'var(--text-muted)' }}>레벨</span>
                          <span className="text-white font-bold">Lv. {selectedOwned.level}</span>
                        </div>
                        <div className="w-full h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.1)' }}>
                          <div className="h-2 rounded-full transition-all" style={{
                            width: `${Math.min(((selectedOwned.exp % EXP_PER_LEVEL) / EXP_PER_LEVEL) * 100, 100)}%`,
                            background: 'var(--blue)',
                          }} />
                        </div>
                        {selectedOwned.copies > 1 && (
                          <div className="text-xs mt-2" style={{ color: 'var(--gold)' }}>
                            중복 보유 +{selectedOwned.copies - 1}
                          </div>
                        )}
                      </div>

                      {/* 스탯 */}
                      <div className="game-card p-3">
                        <div className="text-xs font-bold mb-2" style={{ color: 'var(--text-muted)' }}>스탯</div>
                        <div className="grid grid-cols-2 gap-y-2 gap-x-3">
                          {[
                            ['HP', 'hp', '#6BCB77'],
                            ['공격력', 'atk', '#FF6B6B'],
                            ['방어력', 'def', '#4FC3F7'],
                            ['속도', 'speed', '#FFD93D'],
                          ].map(([label, key, color]) => (
                            <div key={key}>
                              <div className="text-xs mb-0.5" style={{ color: 'var(--text-dim)' }}>{label}</div>
                              <div className="font-bold" style={{ color }}>
                                {key === 'speed'
                                  ? selectedChar.baseStats.speed.toFixed(1)
                                  : getStatAtLevel(selectedChar.baseStats[key], selectedOwned.level).toLocaleString()
                                }
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* 배경 스토리 */}
                      <div className="game-card p-3">
                        <div className="text-xs font-bold mb-2" style={{ color: 'var(--text-muted)' }}>배경</div>
                        <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                          {selectedChar.lore}
                        </p>
                      </div>

                      {/* 레벨업 버튼 */}
                      <button
                        onClick={() => onLevelUp(selectedChar.id, EXP_PER_LEVEL)}
                        disabled={growthCurrency < EXP_PER_LEVEL}
                        className="w-full py-2.5 rounded-xl text-sm font-bold transition-all disabled:opacity-40"
                        style={{
                          background: growthCurrency >= EXP_PER_LEVEL ? 'var(--blue)' : '#374151',
                          color: '#fff',
                        }}
                      >
                        레벨업 <span style={{ color: 'var(--gold-light)' }}>🪙 {EXP_PER_LEVEL}</span>
                        {growthCurrency < EXP_PER_LEVEL && (
                          <span className="text-xs ml-1 opacity-70">(보유: {growthCurrency})</span>
                        )}
                      </button>
                    </>
                  )}

                  {/* ── 스킬 탭 ── */}
                  {tab === 'skills' && (
                    <div className="flex flex-col gap-3">
                      {Object.entries(selectedChar.skills).map(([key, skill]) => (
                        <div key={key} className="game-card p-3">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-black shrink-0"
                              style={{
                                background: key === 'ex'
                                  ? 'linear-gradient(135deg, #7c3aed, #c084fc)'
                                  : key === 'skill1'
                                  ? 'rgba(74,144,217,0.3)'
                                  : 'rgba(255,255,255,0.1)',
                                color: key === 'ex' ? '#fff' : 'var(--text-muted)',
                                border: key === 'ex' ? '1px solid #c084fc' : '1px solid var(--border)',
                              }}>
                              {key === 'ex' ? 'EX' : key === 'skill1' ? 'S1' : 'S2'}
                            </div>
                            <div className="flex-1">
                              <div className="text-white font-semibold text-sm">{skill.name}</div>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-xs" style={{ color: 'var(--text-dim)' }}>
                                  {skill.type === 'ex' ? `코스트 ${skill.cost}` : skill.type === 'auto' ? `쿨타임 ${skill.cooldown}s` : '패시브'}
                                </span>
                              </div>
                            </div>
                          </div>
                          <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                            {skill.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* ── 장비 탭 ── */}
                  {tab === 'equip' && (
                    <div className="flex flex-col gap-2">
                      <p className="text-xs" style={{ color: 'var(--text-dim)' }}>장비 6칸 (추후 아이템 시스템 연동 예정)</p>
                      <div className="grid grid-cols-3 gap-2">
                        {Object.entries(EQUIPMENT_SLOT_LABEL).map(([slot, label]) => {
                          const equipped = selectedOwned.equipment?.[slot]
                          return (
                            <div key={slot} className="game-card p-2 flex flex-col items-center gap-1.5 cursor-pointer hover:brightness-125 transition-all"
                              style={{ border: equipped ? '1px solid var(--gold)' : '1px solid var(--border)', minHeight: 80 }}>
                              <div className="text-2xl">{EQUIPMENT_SLOT_ICON[slot]}</div>
                              <div className="text-xs text-center" style={{ color: equipped ? 'var(--gold)' : 'var(--text-dim)' }}>
                                {equipped ? equipped : label}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}

                </div>
              </>
            )}
          </>
        )}
      </aside>
    </div>
  )
}
