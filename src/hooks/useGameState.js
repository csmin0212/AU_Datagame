import { useState, useCallback } from 'react'

const STORAGE_KEY = 'au_gacha_save'

const DEFAULT_STATE = {
  // 보유 캐릭터: { characterId: { level, exp, copies } }
  ownedCharacters: {},
  // 덱: 캐릭터 id 배열 (최대 5자리)
  deck: [],
  // 재화
  currency: {
    gacha: 3000,   // 뽑기 재화 (시작 지급)
    growth: 500,   // 성장 재화
  },
  // 배너별 천장 카운터: { bannerId: { pityCount, guaranteeFeatured } }
  pity: {},
  // 설정
  settings: {},
}

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_STATE
    return { ...DEFAULT_STATE, ...JSON.parse(raw) }
  } catch {
    return DEFAULT_STATE
  }
}

function save(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

export function useGameState() {
  const [state, setState] = useState(load)

  const update = useCallback((updater) => {
    setState(prev => {
      const next = typeof updater === 'function' ? updater(prev) : { ...prev, ...updater }
      save(next)
      return next
    })
  }, [])

  // 캐릭터 획득 (중복 시 copies++)
  const acquireCharacter = useCallback((characterId) => {
    update(prev => {
      const owned = prev.ownedCharacters[characterId]
      return {
        ...prev,
        ownedCharacters: {
          ...prev.ownedCharacters,
          [characterId]: owned
            ? { ...owned, copies: owned.copies + 1 }
            : { level: 1, exp: 0, copies: 1 },
        },
      }
    })
  }, [update])

  // 재화 소모
  const spendCurrency = useCallback((type, amount) => {
    update(prev => ({
      ...prev,
      currency: {
        ...prev.currency,
        [type]: Math.max(0, prev.currency[type] - amount),
      },
    }))
  }, [update])

  // 재화 획득
  const gainCurrency = useCallback((type, amount) => {
    update(prev => ({
      ...prev,
      currency: {
        ...prev.currency,
        [type]: prev.currency[type] + amount,
      },
    }))
  }, [update])

  // 천장 카운터 업데이트
  const updatePity = useCallback((bannerId, pityCount, guaranteeFeatured) => {
    update(prev => ({
      ...prev,
      pity: {
        ...prev.pity,
        [bannerId]: { pityCount, guaranteeFeatured },
      },
    }))
  }, [update])

  // 덱 업데이트
  const updateDeck = useCallback((newDeck) => {
    update(prev => ({ ...prev, deck: newDeck }))
  }, [update])

  // 캐릭터 레벨업
  const levelUpCharacter = useCallback((characterId, expCost) => {
    update(prev => {
      const char = prev.ownedCharacters[characterId]
      if (!char) return prev
      if (prev.currency.growth < expCost) return prev
      return {
        ...prev,
        currency: { ...prev.currency, growth: prev.currency.growth - expCost },
        ownedCharacters: {
          ...prev.ownedCharacters,
          [characterId]: { ...char, level: char.level + 1, exp: char.exp + expCost },
        },
      }
    })
  }, [update])

  return {
    state,
    acquireCharacter,
    spendCurrency,
    gainCurrency,
    updatePity,
    updateDeck,
    levelUpCharacter,
  }
}
