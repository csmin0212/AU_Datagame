import { useState } from 'react'

const SHOP_TABS = [
  { id: 'gem',      label: '💎 재화 상점' },
  { id: 'item',     label: '🛒 아이템 상점' },
  { id: 'exchange', label: '🔄 교환 상점' },
]

const GEM_PACKS = [
  { id: 'g1', label: '스타터 팩',   gems: 500,   bonus: '',      price: '₩1,200',  highlight: false },
  { id: 'g2', label: '모험가 팩',   gems: 1200,  bonus: '+200',  price: '₩2,400',  highlight: false },
  { id: 'g3', label: '영웅 팩',     gems: 3000,  bonus: '+600',  price: '₩5,500',  highlight: true  },
  { id: 'g4', label: '전설 팩',     gems: 6500,  bonus: '+1500', price: '₩10,000', highlight: false },
  { id: 'g5', label: '사령관 팩',   gems: 15000, bonus: '+5000', price: '₩22,000', highlight: false },
]

const ITEM_SHOP = [
  { id: 'i1', icon: '🧪', name: '성장 재료 세트',     desc: '성장 재료 × 50',      price: '💎 30',  stock: 5  },
  { id: 'i2', icon: '⚡', name: '스태미나 회복 (60)',  desc: '스태미나 60 즉시 회복', price: '💎 40',  stock: 3  },
  { id: 'i3', icon: '🎰', name: '뽑기 티켓 (1회)',    desc: '단뽑 1회',             price: '💎 160', stock: 10 },
  { id: 'i4', icon: '🪙', name: '골드 꾸러미 (대)',   desc: '골드 10,000',          price: '💎 50',  stock: 3  },
  { id: 'i5', icon: '🔮', name: '캐릭터 각성석',       desc: '각성 재료 × 5',        price: '💎 80',  stock: 2  },
  { id: 'i6', icon: '📦', name: '월정액 보상',         desc: '매일 💎 40 수령',      price: '₩4,500', stock: 1  },
]

const EXCHANGE_SHOP = [
  { id: 'e1', icon: '⭐', name: '★★★ 캐릭터 선택권', desc: '3성 캐릭터 중 1명 선택', cost: '교환권 × 300',   owned: 0 },
  { id: 'e2', icon: '⭐', name: '★★ 캐릭터 선택권',  desc: '2성 캐릭터 중 1명 선택', cost: '교환권 × 50',    owned: 0 },
  { id: 'e3', icon: '🧪', name: '성장 재료 (대)',     desc: '성장 재료 × 100',        cost: '교환권 × 10',    owned: 0 },
  { id: 'e4', icon: '💎', name: '젬 → 교환권',        desc: '젬 160 = 교환권 1',      cost: '💎 160 / 회',    owned: 0 },
]

export default function ShopPage() {
  const [tab, setTab] = useState('gem')

  return (
    <div className="flex flex-col h-full overflow-hidden">

      {/* 탭 헤더 */}
      <div className="flex shrink-0 px-4 pt-4 gap-2">
        {SHOP_TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className="px-5 py-2.5 rounded-xl text-sm font-bold transition-all"
            style={{
              background: tab === t.id ? 'var(--gold)' : 'rgba(255,255,255,0.07)',
              color:      tab === t.id ? '#1a0f3a' : 'var(--text-muted)',
            }}
          >{t.label}</button>
        ))}
      </div>

      {/* 컨텐츠 */}
      <div className="flex-1 overflow-y-auto p-4">

        {/* ── 재화 상점 ── */}
        {tab === 'gem' && (
          <div className="flex flex-col gap-4">
            <div className="rounded-2xl p-4 text-center"
              style={{ background: 'linear-gradient(135deg, rgba(74,144,217,0.2), rgba(155,111,217,0.2))', border: '1px solid var(--border-md)' }}>
              <div className="text-white font-bold text-base mb-1">💎 젬 충전</div>
              <div className="text-sm" style={{ color: 'var(--text-dim)' }}>젬은 뽑기, 아이템 구매에 사용됩니다</div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {GEM_PACKS.map(p => (
                <div
                  key={p.id}
                  className="flex flex-col items-center rounded-2xl p-4 gap-2 transition-all hover:brightness-110 cursor-pointer"
                  style={{
                    background: p.highlight
                      ? 'linear-gradient(135deg, rgba(245,197,24,0.18), rgba(251,191,36,0.1))'
                      : 'rgba(255,255,255,0.05)',
                    border: p.highlight
                      ? '1px solid rgba(245,197,24,0.5)'
                      : '1px solid var(--border)',
                    position: 'relative',
                  }}>
                  {p.highlight && (
                    <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-xs px-3 py-0.5 rounded-full font-bold whitespace-nowrap"
                      style={{ background: 'var(--gold)', color: '#1a0f3a' }}>BEST</div>
                  )}
                  <div className="text-4xl">💎</div>
                  <div className="text-white font-black text-xl">{p.gems.toLocaleString()}</div>
                  {p.bonus && (
                    <div className="text-xs px-2 py-0.5 rounded-full font-bold"
                      style={{ background: 'rgba(107,203,119,0.2)', color: '#6BCB77' }}>
                      보너스 {p.bonus}
                    </div>
                  )}
                  <div className="text-sm font-bold" style={{ color: 'var(--text-muted)' }}>{p.label}</div>
                  <button
                    className="w-full py-2 rounded-xl text-sm font-bold mt-1"
                    style={{ background: p.highlight ? 'var(--gold)' : 'var(--blue)', color: p.highlight ? '#1a0f3a' : '#fff' }}>
                    {p.price}
                  </button>
                </div>
              ))}
            </div>
            <p className="text-xs text-center" style={{ color: 'var(--text-dim)' }}>
              실제 결제 시스템은 추후 구현 예정입니다.
            </p>
          </div>
        )}

        {/* ── 아이템 상점 ── */}
        {tab === 'item' && (
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between mb-1">
              <div className="text-sm font-bold" style={{ color: 'var(--text-muted)' }}>일일 한정 아이템</div>
              <div className="text-xs" style={{ color: 'var(--text-dim)' }}>매일 00:00 초기화</div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {ITEM_SHOP.map(item => (
                <div key={item.id} className="game-card p-4 flex items-center gap-3">
                  <div className="text-3xl shrink-0">{item.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-white font-semibold text-sm">{item.name}</div>
                    <div className="text-xs mt-0.5" style={{ color: 'var(--text-dim)' }}>{item.desc}</div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm font-bold" style={{ color: 'var(--gold)' }}>{item.price}</span>
                      <span className="text-xs" style={{ color: 'var(--text-dim)' }}>잔여 {item.stock}개</span>
                    </div>
                  </div>
                  <button
                    className="shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold"
                    style={{ background: 'var(--blue)', color: '#fff' }}>
                    구매
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── 교환 상점 ── */}
        {tab === 'exchange' && (
          <div className="flex flex-col gap-3">
            <div className="game-card p-4 flex items-center justify-between mb-1">
              <div>
                <div className="text-white font-bold">보유 교환권</div>
                <div className="text-xs mt-0.5" style={{ color: 'var(--text-dim)' }}>뽑기, 미션 보상으로 획득</div>
              </div>
              <div className="text-2xl font-black" style={{ color: 'var(--gold)' }}>0장</div>
            </div>
            {EXCHANGE_SHOP.map(item => (
              <div key={item.id} className="game-card p-4 flex items-center gap-4">
                <div className="text-3xl shrink-0">{item.icon}</div>
                <div className="flex-1">
                  <div className="text-white font-semibold text-sm">{item.name}</div>
                  <div className="text-xs mt-0.5" style={{ color: 'var(--text-dim)' }}>{item.desc}</div>
                  <div className="text-sm font-bold mt-1" style={{ color: 'var(--gold)' }}>{item.cost}</div>
                </div>
                <button
                  disabled
                  className="shrink-0 px-4 py-2 rounded-xl text-sm font-bold disabled:opacity-35"
                  style={{ background: 'var(--blue)', color: '#fff' }}>
                  교환
                </button>
              </div>
            ))}
            <p className="text-xs text-center mt-1" style={{ color: 'var(--text-dim)' }}>
              교환권은 뽑기 및 이벤트 미션 보상으로 획득할 수 있습니다.
            </p>
          </div>
        )}

      </div>
    </div>
  )
}
