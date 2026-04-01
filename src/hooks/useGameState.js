import { useState, useCallback, useEffect } from 'react'
import { EMPTY_EQUIPMENT } from '../data/characters'

const STORAGE_KEY    = 'au_gacha_save'
const STAMINA_MAX    = 120
const STAMINA_RATE   = 5 * 60 * 1000 // 1 스태미나 / 5분

// ── 각성 필요 중복수 (희귀도별 각 티어당) ─────────
export const AWAKEN_COST = { 3: 3, 2: 2, 1: 1 }
export const AWAKEN_MAX  = 5
// 각성 1티어당 스탯 보너스 (%)
export const AWAKEN_STAT_BONUS = 0.04 // +4% per tier

const DEFAULT_STATE = {
  ownedCharacters: {},
  deck:           [],
  currency: {
    gacha:   3000,
    growth:  500,
  },
  stamina: {
    current:    80,
    max:        STAMINA_MAX,
    lastUpdate: Date.now(),
  },
  inventory: {}, // { itemId: count }
  pity:          {},
  clearedStages: {},
  player: {
    name:  '사령관',
    level: 1,
    exp:   0,
  },
  settings: {
    bgmVolume: 0.5,
    sfxVolume: 0.7,
  },
}

// ── 스태미나 자동 회복 계산 ───────────────────────
function applyStaminaRecovery(state) {
  const st      = state.stamina
  if (!st) return state
  if (st.current >= st.max) return state
  const now      = Date.now()
  const elapsed  = now - (st.lastUpdate ?? now)
  const ticks    = Math.floor(elapsed / STAMINA_RATE)
  if (ticks <= 0) return state
  const newCurrent = Math.min(st.max, st.current + ticks)
  return {
    ...state,
    stamina: {
      ...st,
      current:    newCurrent,
      lastUpdate: st.lastUpdate + ticks * STAMINA_RATE,
    },
  }
}

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_STATE
    const loaded = deepMerge(DEFAULT_STATE, JSON.parse(raw))
    return applyStaminaRecovery(loaded)
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

  // ── 스태미나 주기적 자동 회복 (1분마다 체크) ──
  useEffect(() => {
    const id = setInterval(() => {
      update(prev => applyStaminaRecovery(prev))
    }, 60 * 1000)
    return () => clearInterval(id)
  }, [update])

  // ── 캐릭터 획득 ──────────────────────────────────
  const acquireCharacter = useCallback((characterId) => {
    update(prev => {
      const owned = prev.ownedCharacters[characterId]
      return {
        ...prev,
        ownedCharacters: {
          ...prev.ownedCharacters,
          [characterId]: owned
            ? { ...owned, copies: owned.copies + 1 }
            : { level: 1, exp: 0, copies: 1, awakening: 0, equipment: { ...EMPTY_EQUIPMENT } },
        },
      }
    })
  }, [update])

  // ── 재화 소모 ─────────────────────────────────────
  const spendCurrency = useCallback((type, amount) => {
    update(prev => ({
      ...prev,
      currency: { ...prev.currency, [type]: Math.max(0, prev.currency[type] - amount) },
    }))
  }, [update])

  // ── 재화 획득 ─────────────────────────────────────
  const gainCurrency = useCallback((type, amount) => {
    update(prev => ({
      ...prev,
      currency: { ...prev.currency, [type]: prev.currency[type] + amount },
    }))
  }, [update])

  // ── 스태미나 소모 ─────────────────────────────────
  const spendStamina = useCallback((amount) => {
    update(prev => ({
      ...prev,
      stamina: {
        ...prev.stamina,
        current: Math.max(0, prev.stamina.current - amount),
      },
    }))
  }, [update])

  // ── 천장 업데이트 ─────────────────────────────────
  const updatePity = useCallback((bannerId, pityCount, guaranteeFeatured) => {
    update(prev => ({
      ...prev,
      pity: { ...prev.pity, [bannerId]: { pityCount, guaranteeFeatured } },
    }))
  }, [update])

  // ── 파티 업데이트 ─────────────────────────────────
  const updateDeck = useCallback((newDeck) => {
    update(prev => ({ ...prev, deck: newDeck }))
  }, [update])

  // ── 캐릭터 레벨업 ─────────────────────────────────
  const levelUpCharacter = useCallback((characterId, expCost) => {
    update(prev => {
      const char = prev.ownedCharacters[characterId]
      if (!char || prev.currency.growth < expCost) return prev
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

  // ── 장비 장착 ─────────────────────────────────────
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

  // ── 아이템 획득 ───────────────────────────────────
  const gainItem = useCallback((itemId, count = 1) => {
    update(prev => ({
      ...prev,
      inventory: {
        ...prev.inventory,
        [itemId]: (prev.inventory[itemId] ?? 0) + count,
      },
    }))
  }, [update])

  // ── 아이템 소모 ───────────────────────────────────
  const consumeItem = useCallback((itemId, count = 1) => {
    update(prev => {
      const current = prev.inventory[itemId] ?? 0
      if (current < count) return prev
      return {
        ...prev,
        inventory: { ...prev.inventory, [itemId]: current - count },
      }
    })
  }, [update])

  // ── 캐릭터 각성 ───────────────────────────────────
  // rarity 필요 - 호출부에서 캐릭터 rarity를 넘겨야 함
  const awakenCharacter = useCallback((characterId, rarity) => {
    update(prev => {
      const char = prev.ownedCharacters[characterId]
      if (!char) return prev
      const currentTier = char.awakening ?? 0
      if (currentTier >= AWAKEN_MAX) return prev
      const cost = AWAKEN_COST[rarity] ?? 1
      if ((char.copies - 1) < cost) return prev // copies-1 = 여분 (첫 1개는 보유용)
      return {
        ...prev,
        ownedCharacters: {
          ...prev.ownedCharacters,
          [characterId]: {
            ...char,
            awakening: currentTier + 1,
            copies:    char.copies - cost,
          },
        },
      }
    })
  }, [update])

  // ── 스테이지 클리어 ──────────────────────────────
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

  // ── 플레이어 경험치 획득 ─────────────────────────
  const gainPlayerExp = useCallback((exp) => {
    update(prev => {
      const EXP_PER_LEVEL = 200
      let { level, exp: curExp } = prev.player
      curExp += exp
      while (curExp >= EXP_PER_LEVEL) {
        curExp -= EXP_PER_LEVEL
        level++
      }
      return { ...prev, player: { ...prev.player, level, exp: curExp } }
    })
  }, [update])

  // ── 플레이어 이름 변경 ───────────────────────────
  const setPlayerName = useCallback((name) => {
    update(prev => ({ ...prev, player: { ...prev.player, name } }))
  }, [update])

  // ── 설정 변경 ─────────────────────────────────────
  const updateSettings = useCallback((key, value) => {
    update(prev => ({
      ...prev,
      settings: { ...prev.settings, [key]: value },
    }))
  }, [update])

  return {
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
  }
}
