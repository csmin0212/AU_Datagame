import { CHARACTER_POOL, RARITY_COLOR, ELEMENT_COLOR } from '../data/characters'

const MAX_DECK = 5

export default function DeckPage({ deck, ownedCharacters, onUpdateDeck }) {
  const ownedList = CHARACTER_POOL.filter(c => ownedCharacters[c.id])

  function toggleDeck(charId) {
    if (deck.includes(charId)) {
      onUpdateDeck(deck.filter(id => id !== charId))
    } else {
      if (deck.length >= MAX_DECK) return
      onUpdateDeck([...deck, charId])
    }
  }

  return (
    <div className="flex h-full p-4 gap-4">
      {/* 덱 슬롯 */}
      <div className="flex flex-col gap-2 w-48 shrink-0">
        <h2 className="text-white font-bold text-lg">덱 ({deck.length}/{MAX_DECK})</h2>
        <div className="flex flex-col gap-2">
          {Array.from({ length: MAX_DECK }).map((_, i) => {
            const charId = deck[i]
            const char = charId ? CHARACTER_POOL.find(c => c.id === charId) : null
            return (
              <div
                key={i}
                className="h-12 rounded border flex items-center px-3 gap-2 cursor-pointer"
                style={{
                  borderColor: char ? RARITY_COLOR[char.rarity] + '88' : '#444',
                  background: char ? '#1a1a2e' : '#111',
                }}
                onClick={() => char && toggleDeck(charId)}
              >
                {char ? (
                  <>
                    <span className="text-white text-sm font-semibold">{char.name}</span>
                    <span className="text-xs ml-auto" style={{ color: ELEMENT_COLOR[char.element] }}>
                      Lv.{ownedCharacters[char.id]?.level}
                    </span>
                  </>
                ) : (
                  <span className="text-gray-600 text-sm">비어있음</span>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* 보유 캐릭터 목록 */}
      <div className="flex flex-col flex-1 gap-2 overflow-hidden">
        <h2 className="text-white font-bold text-lg">보유 캐릭터</h2>
        {ownedList.length === 0 ? (
          <div className="text-gray-500 text-sm">아직 보유한 캐릭터가 없어요.</div>
        ) : (
          <div className="overflow-y-auto flex-1">
            <div className="grid grid-cols-4 gap-2">
              {ownedList.map(char => {
                const inDeck = deck.includes(char.id)
                const deckFull = deck.length >= MAX_DECK && !inDeck
                return (
                  <div
                    key={char.id}
                    className={`rounded border p-2 flex items-center gap-2 cursor-pointer transition-all ${
                      deckFull ? 'opacity-30 cursor-not-allowed' : 'hover:brightness-125'
                    }`}
                    style={{
                      borderColor: inDeck ? RARITY_COLOR[char.rarity] : '#333',
                      background: inDeck ? '#1a1a2e' : '#111',
                      boxShadow: inDeck ? `0 0 8px ${RARITY_COLOR[char.rarity]}44` : 'none',
                    }}
                    onClick={() => !deckFull && toggleDeck(char.id)}
                  >
                    <div className="text-white text-sm font-semibold">{char.name}</div>
                    <div className="ml-auto text-xs text-gray-400">
                      Lv.{ownedCharacters[char.id]?.level}
                    </div>
                    {inDeck && (
                      <div className="text-xs text-green-400">✓</div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
