import { useState } from 'react'
import { BANNERS, PULL_COST } from '../data/banners'
import { CHARACTER_POOL, RARITY_COLOR, ELEMENT_COLOR } from '../data/characters'

function doGacha(banner, pityCount, guaranteeFeatured) {
  let rate3 = banner.rates[3]
  if (pityCount >= banner.softPityStart) {
    rate3 = Math.min(1, rate3 + (pityCount - banner.softPityStart) * 0.06)
  }
  const roll = Math.random()
  let rarity
  if (roll < rate3 || pityCount + 1 >= banner.pityHard) rarity = 3
  else if (roll < rate3 + banner.rates[2]) rarity = 2
  else rarity = 1

  const newPity = rarity === 3 ? 0 : pityCount + 1
  let pool = CHARACTER_POOL.filter(c => banner.pool.includes(c.id) && c.rarity === rarity)
  let isFeatured = false
  if (rarity === 3) {
    const featured = pool.filter(c => banner.featured.includes(c.id))
    const nonFeatured = pool.filter(c => !banner.featured.includes(c.id))
    if (guaranteeFeatured || Math.random() < banner.pityFeaturedRate) {
      pool = featured.length > 0 ? featured : pool; isFeatured = true
    } else {
      pool = nonFeatured.length > 0 ? nonFeatured : pool
    }
  }
  const result = pool[Math.floor(Math.random() * pool.length)]
  return { result, newPity, newGuarantee: rarity === 3 ? !isFeatured : guaranteeFeatured }
}

export default function GachaPage({ currency, pity, onPull }) {
  const [selectedBanner, setSelectedBanner] = useState(BANNERS[0])
  const [results, setResults] = useState(null)
  const [showRates, setShowRates] = useState(false)

  const bannerPity = pity[selectedBanner.id] || { pityCount: 0, guaranteeFeatured: false }

  function pull(count) {
    const cost = count === 1 ? PULL_COST.single : PULL_COST.ten
    if (currency.gacha < cost) return
    let { pityCount, guaranteeFeatured } = bannerPity
    const pulls = []
    for (let i = 0; i < count; i++) {
      const { result, newPity, newGuarantee } = doGacha(selectedBanner, pityCount, guaranteeFeatured)
      pulls.push(result); pityCount = newPity; guaranteeFeatured = newGuarantee
    }
    onPull(selectedBanner.id, pulls, cost, pityCount, guaranteeFeatured)
    setResults(pulls)
  }

  return (
    <div className="flex h-full">
      {/* 좌: 배너/정보 패널 */}
      <aside
        className="flex flex-col gap-3 p-3 overflow-y-auto shrink-0"
        style={{ width: 220, borderRight: '1px solid var(--border)' }}
      >
        <div className="text-xs font-bold" style={{ color: 'var(--text-dim)' }}>픽업 배너</div>

        {/* 배너 선택 */}
        {BANNERS.map(b => (
          <button
            key={b.id}
            onClick={() => { setSelectedBanner(b); setResults(null) }}
            className="w-full text-left rounded-2xl p-3 transition-all"
            style={{
              background: selectedBanner.id === b.id ? 'rgba(74,144,217,0.15)' : 'rgba(255,255,255,0.04)',
              border: `1px solid ${selectedBanner.id === b.id ? 'var(--blue)' : 'var(--border)'}`,
            }}
          >
            <div className="text-xs font-bold" style={{ color: 'var(--blue-light)' }}>진행중</div>
            <div className="text-white font-bold text-sm mt-0.5">{b.name}</div>
            <div className="text-xs mt-0.5" style={{ color: 'var(--text-dim)' }}>~{b.endDate}</div>
          </button>
        ))}

        {/* 상시 배너 */}
        <div
          className="rounded-2xl p-3"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)' }}
        >
          <div className="text-xs font-bold" style={{ color: 'var(--text-dim)' }}>상시</div>
          <div className="text-white font-semibold text-sm mt-0.5">일반 모집</div>
        </div>

        {/* 픽업 캐릭터 */}
        <div>
          <div className="text-xs font-bold mb-2" style={{ color: 'var(--text-dim)' }}>픽업 캐릭터</div>
          {selectedBanner.featured.map(charId => {
            const char = CHARACTER_POOL.find(c => c.id === charId)
            if (!char) return null
            return (
              <div key={charId} className="flex items-center gap-2 mb-2">
                <div className="w-10 h-10 rounded-xl bg-gray-900 overflow-hidden shrink-0">
                  <img src={char.image} alt={char.name} className="w-full h-full object-cover"
                    onError={e => { e.target.style.display = 'none' }} />
                </div>
                <div>
                  <div className="flex gap-0.5">
                    {Array.from({ length: char.rarity }).map((_, i) => (
                      <span key={i} style={{ color: 'var(--gold)', fontSize: 11 }}>★</span>
                    ))}
                  </div>
                  <div className="text-white text-sm font-semibold">{char.name}</div>
                </div>
              </div>
            )
          })}
        </div>

        {/* 확률 정보 */}
        <div className="game-card p-3">
          <button
            onClick={() => setShowRates(v => !v)}
            className="flex items-center justify-between w-full"
          >
            <span className="text-xs font-bold" style={{ color: 'var(--text-muted)' }}>확률 정보</span>
            <span className="text-xs" style={{ color: 'var(--text-dim)' }}>{showRates ? '▲' : '▼'}</span>
          </button>
          {showRates && (
            <div className="mt-2 flex flex-col gap-1 text-xs">
              {[3, 2, 1].map(r => (
                <div key={r} className="flex justify-between">
                  <span style={{ color: RARITY_COLOR[r] }}>{'★'.repeat(r)}</span>
                  <span style={{ color: 'var(--text-muted)' }}>{(selectedBanner.rates[r] * 100).toFixed(1)}%</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 천장 게이지 */}
        <div className="game-card p-3">
          <div className="text-xs font-bold mb-2" style={{ color: 'var(--text-dim)' }}>천장 카운터</div>
          <div className="flex justify-between text-xs mb-1.5">
            <span style={{ color: 'var(--text-muted)' }}>현재 {bannerPity.pityCount}회</span>
            <span style={{ color: 'var(--text-dim)' }}>천장 {selectedBanner.pityHard}회</span>
          </div>
          <div className="w-full h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.1)' }}>
            <div
              className="h-2 rounded-full transition-all"
              style={{
                width: `${(bannerPity.pityCount / selectedBanner.pityHard) * 100}%`,
                background: bannerPity.pityCount > 70
                  ? 'linear-gradient(90deg, #ef4444, #f97316)'
                  : 'linear-gradient(90deg, var(--blue), var(--purple))',
              }}
            />
          </div>
          {bannerPity.guaranteeFeatured && (
            <div className="text-xs mt-1.5" style={{ color: 'var(--gold)' }}>★ 픽업 보장 중</div>
          )}
        </div>
      </aside>

      {/* 우: 배너 이미지 + 뽑기 */}
      <main className="flex-1 flex flex-col">
        {/* 배너 이미지 영역 */}
        <div
          className="flex-1 relative overflow-hidden flex items-end"
          style={{ background: 'linear-gradient(135deg, #0f0728, #1a1a3e)' }}
        >
          {/* 배너 배경 장식 */}
          <div className="absolute inset-0 opacity-30"
            style={{ backgroundImage: 'radial-gradient(ellipse at 60% 40%, #4a90d9 0%, transparent 60%)' }} />

          {/* 결과 or 배너 소개 */}
          {results ? (
            <div className="absolute inset-0 flex items-center justify-center p-6">
              <div className="flex flex-wrap gap-3 justify-center">
                {results.map((char, i) => (
                  <div
                    key={i}
                    className="flex flex-col items-center gap-1.5 rounded-2xl p-3"
                    style={{
                      background: 'rgba(0,0,0,0.6)',
                      border: `2px solid ${RARITY_COLOR[char.rarity]}88`,
                      boxShadow: char.rarity === 3 ? `0 0 20px ${RARITY_COLOR[char.rarity]}55` : 'none',
                      width: 90,
                      backdropFilter: 'blur(8px)',
                    }}
                  >
                    <div
                      className="w-16 h-16 rounded-xl bg-gray-900 overflow-hidden"
                      style={{ borderBottom: `2px solid ${ELEMENT_COLOR[char.element]}` }}
                    >
                      <img src={char.image} alt={char.name} className="w-full h-full object-cover"
                        onError={e => { e.target.style.display = 'none' }} />
                    </div>
                    <div className="text-white text-xs font-bold text-center leading-tight">{char.name}</div>
                    <div className="flex gap-0.5">
                      {Array.from({ length: char.rarity }).map((_, si) => (
                        <span key={si} style={{ color: RARITY_COLOR[char.rarity], fontSize: 10 }}>★</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
              <div className="text-5xl">✨</div>
              <div className="text-white font-bold text-2xl">{selectedBanner.name}</div>
              <div className="text-sm" style={{ color: 'var(--text-muted)' }}>{selectedBanner.subtitle}</div>
              <div className="text-xs mt-1" style={{ color: 'var(--text-dim)' }}>
                {selectedBanner.endDate}까지
              </div>
            </div>
          )}

          {/* 배너 제목 오버레이 (하단) */}
          <div
            className="relative w-full px-6 py-4"
            style={{ background: 'linear-gradient(transparent, rgba(0,0,0,0.8))' }}
          >
            <div className="text-white font-bold text-xl">{selectedBanner.name}</div>
            <div className="text-sm" style={{ color: 'var(--text-muted)' }}>{selectedBanner.subtitle}</div>
          </div>
        </div>

        {/* 뽑기 버튼 영역 */}
        <div
          className="flex items-center justify-between px-6 py-4 shrink-0"
          style={{ background: 'rgba(0,0,0,0.4)', borderTop: '1px solid var(--border)' }}
        >
          <div className="flex items-center gap-2">
            <span className="text-base">💎</span>
            <span className="font-bold" style={{ color: 'var(--gold)' }}>
              보유 {currency.gacha.toLocaleString()}
            </span>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => pull(1)}
              disabled={currency.gacha < PULL_COST.single}
              className="flex flex-col items-center px-6 py-2.5 rounded-xl font-bold text-sm transition-all disabled:opacity-40 hover:brightness-110"
              style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff' }}
            >
              <span>단뽑</span>
              <span className="text-xs mt-0.5" style={{ color: 'var(--gold)' }}>💎 {PULL_COST.single}</span>
            </button>
            <button
              onClick={() => pull(10)}
              disabled={currency.gacha < PULL_COST.ten}
              className="flex flex-col items-center px-6 py-2.5 rounded-xl font-bold text-sm transition-all disabled:opacity-40 hover:brightness-110"
              style={{ background: 'linear-gradient(135deg, #4a90d9, #7c3aed)', color: '#fff' }}
            >
              <span>10연뽑</span>
              <span className="text-xs mt-0.5" style={{ color: 'var(--gold-light)' }}>💎 {PULL_COST.ten.toLocaleString()}</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
