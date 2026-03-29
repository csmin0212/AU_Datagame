import { useState, useCallback } from 'react'
import { EMPTY_EQUIPMENT } from '../data/characters'

const STORAGE_KEY = 'au_gacha_save'

const DEFAULT_STATE = {
  // 보유 캐릭터
  // { characterId: { level, exp, copies, equipment: { weapon, armor, helmet, boots, accessory1, accessory2 } } }
  ownedCharacters: {},

  // 파티 편성: 캐릭터 id 배열 (최대 4)
  deck: [],

  // 재화
  currency: {
    gacha:  3000,  // 뽑기 재화 (💎)
    growth: 500,   // 성장 재화 (🪙)
  },

  // 배너별 천장 카운터
  // { bannerId: { pityCount, guaranteeFeatured } }
  pity: {},

  // 스테이지 클리어 기록
  // { stageId: { cleared: bool, stars: 1~3 } }
  clearedStages: {},

  // 플레이어 정보
  player: {
    name: '사령관',
    level: 1,
    exp: 0,
  },
}

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_STATE
    return deepMerge(DEFAULT_STATE, JSON.parse(raw))
  } catch {
    return DEFAULT_STATE
  }
}

function deepMerge(base, override) {
  const result = { ...base }
  for (const key of Object.keys(override)) {
    if (
      override[key] !== null &&
      typeof override[key] === 'object' &&
      !Array.isArray(override[key]) &&
      typeof base[key] === 'object' &&
      base[key] !== null
    ) {
      result[key] = deepMerge(base[key], override[key])
    } else {
      result[key] = override[key]
    }
  }
  return result
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

  // ── 캐릭터 획득 (중복 시 copies++)
  const acquireCharacter = useCallback((characterId) => {
    update(prev => {
      const owned = prev.ownedCharacters[characterId]
      return {
        ...prev,
        ownedCharacters: {
          ...prev.ownedCharacters,
          [characterId]: owned
            ? { ...owned, copies: owned.copies + 1 }
            : { level: 1, exp: 0, copies: 1, equipment: { ...EMPTY_EQUIPMENT } },
        },
      }
    })
  }, [update])

  // ── 재화 소모
  const spendCurrency = useCallback((type, amount) => {
    update(prev => ({
      ...prev,
      currency: {
        ...prev.currency,
        [type]: Math.max(0, prev.currency[type] - amount),
      },
    }))
  }, [update])

  // ── 재화 획득
  const gainCurrency = useCallback((type, amount) => {
    update(prev => ({
      ...prev,
      currency: {
        ...prev.currency,
        [type]: prev.currency[type] + amount,
      },
    }))
  }, [update])

  // ── 천장 카운터 업데이트
  const updatePity = useCallback((bannerId, pityCount, guaranteeFeatured) => {
    update(prev => ({
      ...prev,
      pity: {
        ...prev.pity,
        [bannerId]: { pityCount, guaranteeFeatured },
      },
    }))
  }, [update])

  // ── 파티 업데이트
  const updateDeck = useCallback((newDeck) => {
    update(prev => ({ ...prev, deck: newDeck }))
  }, [update])

  // ── 캐릭터 레벨업
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

  // ── 장비 장착/해제
  const equipItem = useCallback((characterId, slot, itemId) => {
    update(prev => {
      const char = prev.ownedCharacters[characterId]
      if (!char) return prev
      return {
        ...prev,
        ownedCharacters: {
          ...prev.ownedCharacters,
          [characterId]: {
            ...char,
            equipment: { ...char.equipment, [slot]: itemId },
          },
        },
      }
    })
  }, [update])

  // ── 스테이지 클리어 기록
  const clearStage = useCallback((stageId, stars) => {
    update(prev => {
      const existing = prev.clearedStages[stageId]
      if (existing && existing.stars >= stars) return prev
      return {
        ...prev,
        clearedStages: {
          ...prev.clearedStages,
          [stageId]: { cleared: true, stars },
        },
      }
    })
  }, [update])

  // ── 플레이어 이름 변경
  const setPlayerName = useCallback((name) => {
    update(prev => ({ ...prev, player: { ...prev.player, name } }))
  }, [update])

  return {
    state,
    acquireCharacter,
    spendCurrency,
    gainCurrency,
    updatePity,
    updateDeck,
    levelUpCharacter,
    equipItem,
    clearStage,
    setPlayerName,
  }
}
