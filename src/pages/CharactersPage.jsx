import { useState } from 'react'
import {
  CHARACTER_POOL, RARITY_COLOR, ELEMENT_COLOR, ELEMENT_LABEL,
  ROLE_LABEL, ROLE_COLOR, getStatAtLevel, getCharacterImage,
  EQUIPMENT_SLOT_LABEL, EQUIPMENT_SLOT_ICON,
} from '../data/characters'

const FILTERS = [
  { id: 'all',     label: '전체' },
  { id: 'striker', label: '전위' },
  { id: 'special', label: '중위' },
  { id: 'support', label: '후위' },
]

const EXP_PER_LEVEL = 100

// ────────────────────────────────────────────────────
// 캐릭터 목록 페이지
// ────────────────────────────────────────────────────
function CharacterList({ ownedCharacters, onSelect }) {
  const [filter, setFilter] = useState('all')
  const filtered = CHARACTER_POOL.filter(c => filter === 'all' || c.role === filter)

  return (
    <div className="flex flex-col h-full p-4 gap-3">
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
            const owned = ownedCharacters[char.id]
            return (
              <button
                key={char.id}
                onClick={() => onSelect(char.id)}
                className="flex flex-col rounded-2xl overflow-hidden transition-all text-left hover:scale-105 active:scale-95"
                style={{
                  border:   `2px solid ${RARITY_COLOR[char.rarity] + '55'}`,
                  opacity:  owned ? 1 : 0.35,
                }}
              >
                {/* 이미지 */}
                <div className="relative w-full aspect-square bg-gray-900 overflow-hidden">
                  <img
                    src={getCharacterImage(char, 'portrait')}
                    alt={char.name}
                    className="w-full h-full object-cover"
                    onError={e => { e.target.style.display = 'none' }}
                  />
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
  )
}

// ────────────────────────────────────────────────────
// 캐릭터 상세 페이지 (블루 아카이브 스타일)
// ────────────────────────────────────────────────────
function CharacterDetail({ charId, ownedCharacters, onBack, onLevelUp, growthCurrency, onEquip }) {
  const [tab, setTab] = useState('info') // 'info' | 'skills' | 'equip'

  const char  = CHARACTER_POOL.find(c => c.id === charId)
  const owned = ownedCharacters[charId]

  if (!char) return null

  const level   = owned?.level ?? 1
  const expPct  = owned ? Math.min(((owned.exp % EXP_PER_LEVEL) / EXP_PER_LEVEL) * 100, 100) : 0
  const elemColor = ELEMENT_COLOR[char.element]
  const roleColor = ROLE_COLOR[char.role]

  return (
    <div className="relative w-full h-full overflow-hidden" style={{ background: 'var(--bg)' }}>

      {/* ── 배경: 전신 일러스트 전체 블러 버전 ── */}
      <div className="absolute inset-0 overflow-hidden">
        <img
          src={getCharacterImage(char, 'fullbody')}
          alt=""
          className="w-full h-full object-cover object-top"
          style={{ filter: 'blur(24px) brightness(0.25)', transform: 'scale(1.1)' }}
          onError={e => { e.target.style.display = 'none' }}
        />
        {/* 배경 그라디언트 오버레이 */}
        <div className="absolute inset-0"
          style={{ background: `linear-gradient(135deg, ${elemColor}18 0%, transparent 50%)` }} />
      </div>

      {/* ── 뒤로 가기 버튼 ── */}
      <button
        onClick={onBack}
        className="absolute top-4 left-4 z-20 flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm transition-all hover:brightness-125"
        style={{ background: 'rgba(0,0,0,0.55)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff' }}
      >
        ← 목록으로
      </button>

      {/* ── 메인 레이아웃 ── */}
      <div className="relative z-10 flex h-full pt-14 pb-2">

        {/* 좌: 전신 일러스트 */}
        <div className="relative flex-shrink-0 flex items-end justify-center"
          style={{ width: '45%' }}>
          <img
            src={getCharacterImage(char, 'fullbody')}
            alt={char.name}
            className="h-full w-full object-contain object-bottom"
            style={{ maxHeight: 'calc(100% - 8px)' }}
            onError={e => {
              // fallback: 이미지 없으면 이름 표시
              e.target.style.display = 'none'
            }}
          />
          {/* 하단 그라디언트 페이드 */}
          <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
            style={{ background: 'linear-gradient(transparent, var(--bg))' }} />

          {/* 캐릭터 이름 & 기본 정보 (좌하단) */}
          <div className="absolute bottom-4 left-6 right-4">
            {/* 직업 뱃지 */}
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs px-2.5 py-1 rounded-full font-bold"
                style={{ background: roleColor + '33', color: roleColor, border: `1px solid ${roleColor}55` }}>
                {ROLE_LABEL[char.role]}
              </span>
              <span className="text-xs font-semibold" style={{ color: elemColor }}>
                ◆ {ELEMENT_LABEL[char.element]}
              </span>
              <span className="text-xs" style={{ color: 'var(--text-dim)' }}>{char.job}</span>
            </div>

            {/* 이름 + 별 */}
            <div className="flex items-end gap-3 mb-2">
              <h1 className="text-white font-black text-3xl leading-tight drop-shadow-lg">{char.name}</h1>
              <div className="flex gap-0.5 pb-1">
                {Array.from({ length: char.rarity }).map((_, i) => (
                  <span key={i} style={{ color: 'var(--gold)', fontSize: 18 }}>★</span>
                ))}
              </div>
            </div>

            {/* 레벨 바 */}
            {owned ? (
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold" style={{ color: 'var(--gold)' }}>Lv.{level}</span>
                <div className="flex-1 h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.15)' }}>
                  <div className="h-2 rounded-full transition-all" style={{
                    width: `${expPct}%`,
                    background: `linear-gradient(90deg, var(--blue), var(--blue-light))`,
                  }} />
                </div>
                <span className="text-xs" style={{ color: 'var(--text-dim)' }}>
                  {owned.exp % EXP_PER_LEVEL}/{EXP_PER_LEVEL}
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-2xl">🔒</span>
                <span className="text-sm font-semibold" style={{ color: 'var(--text-muted)' }}>미보유</span>
              </div>
            )}
          </div>
        </div>

        {/* 우: 정보 패널 */}
        <div className="flex-1 flex flex-col overflow-hidden pr-4 pl-2 pb-4">

          {/* 탭 바 */}
          <div className="flex shrink-0 mb-4 gap-1">
            {[['info','기본 정보'], ['skills','스킬'], ['equip','장비']].map(([id, label]) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className="px-5 py-2 rounded-xl text-sm font-bold transition-all"
                style={{
                  background: tab === id ? 'var(--gold)' : 'rgba(255,255,255,0.07)',
                  color:      tab === id ? '#1a0f3a' : 'var(--text-muted)',
                }}
              >{label}</button>
            ))}
          </div>

          {/* 탭 컨텐츠 (스크롤) */}
          <div className="flex-1 overflow-y-auto flex flex-col gap-3">

            {/* ── 기본 정보 ── */}
            {tab === 'info' && (
              <>
                {/* 스탯 카드 */}
                <div className="game-card p-4">
                  <div className="text-xs font-bold mb-3" style={{ color: 'var(--text-muted)' }}>기본 능력치</div>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                    {[
                      ['최대 체력', 'hp',    '#6BCB77'],
                      ['공격력',   'atk',   '#FF6B6B'],
                      ['방어력',   'def',   '#4FC3F7'],
                      ['속도',     'speed', '#FFD93D'],
                    ].map(([label, key, color]) => (
                      <div key={key} className="flex items-center justify-between">
                        <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{label}</span>
                        <span className="font-bold text-lg" style={{ color }}>
                          {key === 'speed'
                            ? char.baseStats.speed.toFixed(1)
                            : getStatAtLevel(char.baseStats[key], owned?.level ?? 1).toLocaleString()
                          }
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 역할 / 속성 */}
                <div className="game-card p-4">
                  <div className="text-xs font-bold mb-3" style={{ color: 'var(--text-muted)' }}>캐릭터 정보</div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span style={{ color: 'var(--text-dim)' }}>직업</span>
                      <div className="text-white font-semibold mt-0.5">{char.job}</div>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-dim)' }}>종족</span>
                      <div className="text-white font-semibold mt-0.5">{char.race}</div>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-dim)' }}>속성</span>
                      <div className="font-semibold mt-0.5" style={{ color: elemColor }}>
                        {ELEMENT_LABEL[char.element]}
                      </div>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-dim)' }}>포지션</span>
                      <div className="font-semibold mt-0.5" style={{ color: roleColor }}>
                        {ROLE_LABEL[char.role]}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 소개 / 스토리 */}
                <div className="game-card p-4">
                  <div className="text-xs font-bold mb-2" style={{ color: 'var(--text-muted)' }}>소개</div>
                  <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-muted)' }}>
                    {char.description}
                  </p>
                  <div className="text-xs font-bold mb-2" style={{ color: 'var(--text-muted)' }}>배경 스토리</div>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-dim)' }}>
                    {char.lore}
                  </p>
                </div>

                {/* 레벨업 버튼 */}
                {owned && (
                  <button
                    onClick={() => onLevelUp(char.id, EXP_PER_LEVEL)}
                    disabled={growthCurrency < EXP_PER_LEVEL}
                    className="w-full py-3 rounded-2xl text-base font-bold transition-all disabled:opacity-40"
                    style={{
                      background: growthCurrency >= EXP_PER_LEVEL
                        ? 'linear-gradient(135deg, #4a90d9, #7bb3e8)'
                        : '#374151',
                      color: '#fff',
                    }}
                  >
                    레벨업{' '}
                    <span style={{ color: 'var(--gold-light)' }}>🪙 {EXP_PER_LEVEL}</span>
                    {growthCurrency < EXP_PER_LEVEL && (
                      <span className="text-xs ml-1 opacity-60">(부족: 보유 {growthCurrency})</span>
                    )}
                  </button>
                )}

                {/* 중복 보유 표시 */}
                {owned?.copies > 1 && (
                  <div className="game-card p-3 flex items-center gap-3">
                    <span className="text-2xl">✨</span>
                    <div>
                      <div className="text-sm font-bold" style={{ color: 'var(--gold)' }}>중복 보유 +{owned.copies - 1}</div>
                      <div className="text-xs mt-0.5" style={{ color: 'var(--text-dim)' }}>각성 재료로 활용 가능 (추후 구현)</div>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* ── 스킬 탭 ── */}
            {tab === 'skills' && (
              <div className="flex flex-col gap-3">
                {Object.entries(char.skills).map(([key, skill]) => {
                  const isEx = key === 'ex'
                  const isS1 = key === 'skill1'
                  return (
                    <div key={key} className="game-card p-4">
                      <div className="flex items-center gap-3 mb-3">
                        {/* 스킬 아이콘 */}
                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-black shrink-0"
                          style={{
                            background: isEx
                              ? 'linear-gradient(135deg, #7c3aed, #c084fc)'
                              : isS1
                              ? 'rgba(74,144,217,0.25)'
                              : 'rgba(255,255,255,0.08)',
                            border: isEx
                              ? '1px solid #c084fc'
                              : '1px solid var(--border)',
                            color: isEx ? '#fff' : 'var(--text-muted)',
                            fontSize: isEx ? 14 : 12,
                          }}>
                          {isEx ? 'EX' : isS1 ? 'S1' : 'S2'}
                        </div>
                        <div className="flex-1">
                          <div className="text-white font-bold text-base">{skill.name}</div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs px-2 py-0.5 rounded-full"
                              style={{
                                background: isEx ? 'rgba(192,132,252,0.15)' : 'rgba(255,255,255,0.07)',
                                color: isEx ? '#c084fc' : 'var(--text-dim)',
                              }}>
                              {skill.type === 'ex'
                                ? `필살기 · 코스트 ${skill.cost}`
                                : skill.type === 'auto'
                                ? `자동 · 쿨타임 ${skill.cooldown}s`
                                : '패시브'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                        {skill.description}
                      </p>
                    </div>
                  )
                })}
              </div>
            )}

            {/* ── 장비 탭 ── */}
            {tab === 'equip' && (
              <>
                <div className="game-card p-4">
                  <div className="text-xs font-bold mb-3" style={{ color: 'var(--text-muted)' }}>장비 슬롯</div>
                  {!owned && (
                    <p className="text-sm mb-3" style={{ color: 'var(--text-dim)' }}>캐릭터를 보유해야 장비를 장착할 수 있습니다.</p>
                  )}
                  <div className="grid grid-cols-3 gap-3">
                    {Object.entries(EQUIPMENT_SLOT_LABEL).map(([slot, label]) => {
                      const equipped = owned?.equipment?.[slot]
                      return (
                        <div
                          key={slot}
                          className="flex flex-col items-center gap-2 rounded-2xl p-3 transition-all"
                          style={{
                            background: equipped ? 'rgba(245,197,24,0.1)' : 'rgba(255,255,255,0.04)',
                            border: `1px solid ${equipped ? 'rgba(245,197,24,0.4)' : 'var(--border)'}`,
                            cursor: owned ? 'pointer' : 'default',
                            minHeight: 90,
                          }}
                        >
                          <div className="text-2xl">{EQUIPMENT_SLOT_ICON[slot]}</div>
                          <div className="text-xs text-center font-semibold"
                            style={{ color: equipped ? 'var(--gold)' : 'var(--text-dim)' }}>
                            {equipped ?? label}
                          </div>
                          {equipped && (
                            <div className="text-xs px-2 py-0.5 rounded-full"
                              style={{ background: 'rgba(245,197,24,0.2)', color: 'var(--gold)' }}>장착 중</div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                  <p className="text-xs mt-3 text-center" style={{ color: 'var(--text-dim)' }}>
                    아이템 시스템은 추후 업데이트 예정입니다
                  </p>
                </div>
              </>
            )}

          </div>
        </div>
      </div>
    </div>
  )
}

// ────────────────────────────────────────────────────
// 메인 export (라우터 역할)
// ────────────────────────────────────────────────────
export default function CharactersPage({ ownedCharacters, onLevelUp, growthCurrency, onEquip }) {
  const [selected, setSelected] = useState(null)

  if (selected) {
    return (
      <CharacterDetail
        charId={selected}
        ownedCharacters={ownedCharacters}
        onBack={() => setSelected(null)}
        onLevelUp={onLevelUp}
        growthCurrency={growthCurrency}
        onEquip={onEquip}
      />
    )
  }

  return (
    <CharacterList
      ownedCharacters={ownedCharacters}
      onSelect={setSelected}
    />
  )
}
