import { useState } from 'react'
import './index.css'
import { useGameState } from './hooks/useGameState'
import { rollDrops }    from './data/items'
import { playAudio }    from './utils/audio'

import TopBar    from './components/TopBar'
import Nav       from './components/Nav'
import MailPopup     from './components/popups/MailPopup'
import ProfilePopup  from './components/popups/ProfilePopup'
import SettingsPopup from './components/popups/SettingsPopup'

import HomePage       from './pages/HomePage'
import CharactersPage from './pages/CharactersPage'
import QuestPage      from './pages/QuestPage'
import PartyPage      from './pages/PartyPage'
import GachaPage      from './pages/GachaPage'
import EventPage      from './pages/EventPage'
import ShopPage       from './pages/ShopPage'
import BattlePage     from './pages/BattlePage'

export default function App() {
  const [page,       setPage]       = useState('home')
  const [popup,      setPopup]      = useState(null)   // 'mail' | 'profile' | 'settings'
  const [battleData, setBattleData] = useState(null)   // { stage } | null

  const {
    state,
    acquireCharacter,
    spendCurrency,
    gainCurrency,
    spendStamina,
    updatePity,
    updateDeck,
    levelUpCharacter,
    equipItem,
    gainItem,
    consumeItem,
    awakenCharacter,
    clearStage,
    gainPlayerExp,
    setPlayerName,
    updateSettings,
  } = useGameState()

  // ── 뽑기 처리 ─────────────────────────────────────
  function handlePull(bannerId, results, cost, newPityCount, newGuarantee) {
    spendCurrency('gacha', cost)
    results.forEach(char => acquireCharacter(char.id))
    updatePity(bannerId, newPityCount, newGuarantee)
    playAudio('gacha')
  }

  // ── 전투 시작 ─────────────────────────────────────
  function handleStartBattle(stage) {
    if (state.deck.length === 0) {
      alert('파티에 캐릭터를 편성하세요! (편성 탭)')
      return
    }
    if (state.stamina.current < stage.staminaCost) {
      alert(`스태미나가 부족합니다.\n필요: ${stage.staminaCost} / 현재: ${state.stamina.current}`)
      return
    }
    spendStamina(stage.staminaCost)
    setBattleData({ stage })
    playAudio('battleStart')
  }

  // ── 전투 종료 ─────────────────────────────────────
  function handleBattleEnd({ stars, rewards, stageId, won }) {
    setBattleData(null)
    if (won) {
      if (rewards.gacha  > 0) gainCurrency('gacha',  rewards.gacha)
      if (rewards.growth > 0) gainCurrency('growth', rewards.growth)
      if (rewards.exp    > 0) gainPlayerExp(rewards.exp)
      clearStage(stageId, stars)
      // 드롭 아이템
      const drops = rollDrops(rewards.growth ?? 6)
      drops.forEach(item => gainItem(item.id))
      playAudio('victory')
    } else {
      playAudio('defeat')
    }
    setPage('quest')
  }

  // ── 데이터 초기화 ─────────────────────────────────
  function handleReset() {
    localStorage.clear()
    window.location.reload()
  }

  // ── 설정 저장 ─────────────────────────────────────
  function handleSettingsChange(key, value) {
    updateSettings(key, value)
  }

  // ── 페이지 렌더 ───────────────────────────────────
  function renderPage() {
    // 전투 중이면 BattlePage 전체 화면
    if (battleData) {
      return (
        <BattlePage
          stage={battleData.stage}
          deckIds={state.deck}
          ownedChars={state.ownedCharacters}
          onBattleEnd={handleBattleEnd}
        />
      )
    }

    switch (page) {
      case 'home':
        return (
          <HomePage
            onNavigate={setPage}
            ownedCount={Object.keys(state.ownedCharacters).length}
            partyCount={state.deck.length}
          />
        )
      case 'characters':
        return (
          <CharactersPage
            ownedCharacters={state.ownedCharacters}
            onLevelUp={levelUpCharacter}
            growthCurrency={state.currency.growth}
            onEquip={equipItem}
            onAwaken={awakenCharacter}
            inventory={state.inventory}
          />
        )
      case 'quest':
        return (
          <QuestPage
            clearedStages={state.clearedStages || {}}
            onStartBattle={handleStartBattle}
            stamina={state.stamina}
          />
        )
      case 'party':
        return (
          <PartyPage
            party={state.deck}
            ownedCharacters={state.ownedCharacters}
            onUpdateParty={updateDeck}
          />
        )
      case 'gacha':
        return (
          <GachaPage
            currency={state.currency}
            pity={state.pity}
            onPull={handlePull}
          />
        )
      case 'event': return <EventPage />
      case 'shop':
        return (
          <ShopPage
            currency={state.currency}
            inventory={state.inventory}
            onBuyItem={(itemId, cost) => {
              spendCurrency('gacha', cost)
              gainItem(itemId)
            }}
          />
        )
      default: return null
    }
  }

  // 전투 중에는 TopBar와 Nav 숨김
  if (battleData) {
    return (
      <div className="flex flex-col w-full h-full" style={{ background: 'var(--bg)' }}>
        {renderPage()}
      </div>
    )
  }

  return (
    <div className="flex flex-col w-full h-full" style={{ background: 'var(--bg)' }}>
      {/* 탑바 */}
      <TopBar
        currency={state.currency}
        stamina={state.stamina}
        playerLevel={state.player?.level ?? 1}
        playerName={state.player?.name ?? '사령관'}
        onOpenPopup={setPopup}
      />

      {/* 페이지 */}
      <main className="flex-1 overflow-hidden">
        {renderPage()}
      </main>

      {/* 네비 */}
      <Nav current={page} onNavigate={setPage} />

      {/* 팝업 */}
      {popup === 'mail'     && <MailPopup     onClose={() => setPopup(null)} onClaim={() => {}} />}
      {popup === 'profile'  && <ProfilePopup  onClose={() => setPopup(null)} ownedCharacters={state.ownedCharacters} player={state.player} />}
      {popup === 'settings' && (
        <SettingsPopup
          onClose={() => setPopup(null)}
          onReset={handleReset}
          settings={state.settings}
          onSettingsChange={handleSettingsChange}
        />
      )}
    </div>
  )
}
