import { useState } from 'react'
import './index.css'
import { useGameState } from './hooks/useGameState'

import TopBar    from './components/TopBar'
import Nav       from './components/Nav'
import MailPopup     from './components/popups/MailPopup'
import ProfilePopup  from './components/popups/ProfilePopup'
import SettingsPopup from './components/popups/SettingsPopup'

import HomePage      from './pages/HomePage'
import CharactersPage from './pages/CharactersPage'
import QuestPage     from './pages/QuestPage'
import PartyPage     from './pages/PartyPage'
import GachaPage     from './pages/GachaPage'
import EventPage     from './pages/EventPage'
import ShopPage      from './pages/ShopPage'

export default function App() {
  const [page, setPage] = useState('home')
  const [popup, setPopup] = useState(null) // 'mail' | 'profile' | 'settings'

  const {
    state,
    acquireCharacter,
    spendCurrency,
    gainCurrency,
    updatePity,
    updateDeck,
    levelUpCharacter,
  } = useGameState()

  function handlePull(bannerId, results, cost, newPityCount, newGuarantee) {
    spendCurrency('gacha', cost)
    results.forEach(char => acquireCharacter(char.id))
    updatePity(bannerId, newPityCount, newGuarantee)
  }

  function handleReset() {
    localStorage.clear()
    window.location.reload()
  }

  function renderPage() {
    switch (page) {
      case 'home':
        return <HomePage onNavigate={setPage} />
      case 'characters':
        return (
          <CharactersPage
            ownedCharacters={state.ownedCharacters}
            onLevelUp={levelUpCharacter}
            growthCurrency={state.currency.growth}
          />
        )
      case 'quest':
        return (
          <QuestPage
            clearedStages={state.clearedStages || {}}
            onSelectStage={() => {}}
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
      case 'shop':  return <ShopPage />
      default:      return null
    }
  }

  return (
    <div
      className="flex flex-col w-full h-full"
      style={{ background: 'var(--bg)' }}
    >
      {/* 탑바 */}
      <TopBar
        currency={state.currency}
        playerLevel={1}
        playerName="사령관"
        onOpenPopup={setPopup}
      />

      {/* 페이지 콘텐츠 */}
      <main className="flex-1 overflow-hidden">
        {renderPage()}
      </main>

      {/* 하단 네비 */}
      <Nav current={page} onNavigate={setPage} />

      {/* 팝업 */}
      {popup === 'mail'     && <MailPopup     onClose={() => setPopup(null)} onClaim={() => {}} />}
      {popup === 'profile'  && <ProfilePopup  onClose={() => setPopup(null)} ownedCharacters={state.ownedCharacters} />}
      {popup === 'settings' && <SettingsPopup onClose={() => setPopup(null)} onReset={handleReset} />}
    </div>
  )
}
