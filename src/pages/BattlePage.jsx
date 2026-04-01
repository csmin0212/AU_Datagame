/**
 * BattlePage.jsx — 세미-오토 배틀 시스템
 *
 * Props:
 *   stage         : 스테이지 데이터 (waves 배열 포함)
 *   deckIds       : 파티 캐릭터 ID 배열
 *   ownedChars    : useGameState의 state.ownedCharacters
 *   onBattleEnd   : (result: { stars, rewards, waveCleared }) => void
 */

import { useState, useEffect, useRef, useCallback } from 'react'
import { CHARACTER_POOL, ELEMENT_COLOR, ROLE_COLOR, getStatAtLevel } from '../data/characters'

const TICK_MS = 500           // 500ms = 1 틱
const BASE_TICKS_PER_ATK = 6  // speed 1.0 기준 6틱(3초)마다 공격

// ── 유틸 ──────────────────────────────────────────────
function dmg(atk, def, mult = 1.0) {
  const base = Math.max(1, atk * mult - def * 0.4)
  return Math.round(base * (0.9 + Math.random() * 0.2))
}

function pickRandom(arr) { return arr[Math.floor(Math.random() * arr.length)] }

// ── 초기화 함수들 ──────────────────────────────────────
function initParty(deckIds, ownedChars) {
  return deckIds
    .filter(id => ownedChars[id])
    .map(id => {
      const def  = CHARACTER_POOL.find(c => c.id === id)
      if (!def) return null
      const own  = ownedChars[id]
      const lv   = own.level
      const hp   = getStatAtLevel(def.baseStats.hp,  lv)
      const atk  = getStatAtLevel(def.baseStats.atk, lv)
      const deff = getStatAtLevel(def.baseStats.def, lv)
      const spd  = def.baseStats.speed
      const exMax = def.skills.ex.cost ?? 4
      return {
        uid:       id + '_p',
        charId:    id,
        name:      def.name,
        element:   def.element,
        role:      def.role,
        skills:    def.skills,
        maxHp: hp, currentHp: hp,
        atk, def: deff, speed: spd,
        atkTimer:  Math.round(BASE_TICKS_PER_ATK / spd),
        atkTimerMax: Math.round(BASE_TICKS_PER_ATK / spd),
        exCost:    0,
        exMax,
        s1Timer:   0,
        s1Max:     Math.round((def.skills.skill1?.cooldown ?? 10) * 2),
        alive:     true,
      }
    })
    .filter(Boolean)
}

function initEnemies(waveEnemies) {
  return waveEnemies.map((e, i) => ({
    uid:        e.id + '_' + i,
    name:       e.name,
    isBoss:     !!e.isBoss,
    maxHp:      e.hp,
    currentHp:  e.hp,
    atk:        e.atk,
    def:        e.def,
    speed:      e.speed ?? 1.0,
    atkTimer:   Math.round(BASE_TICKS_PER_ATK / (e.speed ?? 1.0)),
    atkTimerMax: Math.round(BASE_TICKS_PER_ATK / (e.speed ?? 1.0)),
    alive:      true,
  }))
}

// ── 핵심 틱 로직 (순수 함수) ──────────────────────────
function runTick(state) {
  if (state.phase !== 'fighting') return state

  const enemies = state.enemies.map(e => ({ ...e }))
  const party   = state.party.map(p => ({ ...p }))
  const logs    = []

  const livingE = () => enemies.filter(e => e.alive)
  const livingP = () => party.filter(p => p.alive)

  // ── 파티 행동 ──
  for (const p of party) {
    if (!p.alive) continue

    // S1 쿨타임
    if (p.s1Timer > 0) p.s1Timer -= 1

    // 기본 공격 타이머
    p.atkTimer -= 1
    if (p.atkTimer <= 0) {
      p.atkTimer = p.atkTimerMax
      const le = livingE()
      if (le.length > 0) {
        const target = le[0]
        const d = dmg(p.atk, target.def, 1.0)
        target.currentHp = Math.max(0, target.currentHp - d)
        if (target.currentHp === 0) { target.alive = false; logs.push(`💀 ${target.name} 쓰러짐`) }
        p.exCost = Math.min(p.exMax, p.exCost + 1)
      }
    }

    // S1 자동 발동
    if (p.s1Timer === 0 && (livingE().length > 0 || p.skills.skill1?.type === 'auto')) {
      const sk = p.skills.skill1
      if (sk?.type === 'auto') {
        const eff = sk.effect
        if (eff?.type === 'damage') {
          const le = livingE()
          if (le.length > 0) {
            const t = le[0]
            const d = dmg(p.atk, t.def, eff.multiplier ?? 1.5)
            t.currentHp = Math.max(0, t.currentHp - d)
            if (t.currentHp === 0) { t.alive = false; logs.push(`💥 ${sk.name}! (${t.name} -${d})`) }
            else logs.push(`⚡ ${p.name}: ${sk.name}`)
          }
        } else if (eff?.type === 'heal') {
          const lp = livingP()
          if (lp.length > 0) {
            const t = party.find(x => x.uid === lp.reduce((a, b) => a.currentHp < b.currentHp ? a : b).uid)
            if (t) {
              const h = Math.round(p.atk * (eff.multiplier ?? 1.5))
              t.currentHp = Math.min(t.maxHp, t.currentHp + h)
              logs.push(`💚 ${p.name}: ${sk.name} → +${h} HP`)
            }
          }
        }
        p.s1Timer = p.s1Max
      }
    }

    // AUTO 모드 EX 자동 발동
    if (state.autoMode && p.exCost >= p.exMax && livingE().length > 0) {
      applyEx(p, enemies, party, logs)
      p.exCost = 0
    }
  }

  // ── 적 행동 ──
  for (const e of enemies) {
    if (!e.alive) continue
    e.atkTimer -= 1
    if (e.atkTimer <= 0) {
      e.atkTimer = e.atkTimerMax
      const lp = livingP()
      if (lp.length > 0) {
        const t = party.find(p => p.uid === pickRandom(lp).uid)
        if (t) {
          const d = dmg(e.atk, t.def)
          t.currentHp = Math.max(0, t.currentHp - d)
          if (t.currentHp === 0) { t.alive = false; logs.push(`💔 ${t.name} 쓰러짐`) }
        }
      }
    }
  }

  // ── 승패 / 웨이브 체크 ──
  const allEDead = enemies.every(e => !e.alive)
  const allPDead = party.every(p => !p.alive)

  if (allPDead) {
    logs.push('⚠️ 전투 패배')
    return { ...state, enemies, party, log: [...state.log.slice(-30), ...logs], phase: 'defeat', stars: 0 }
  }

  if (allEDead) {
    const nextWave = state.waveIndex + 1
    if (nextWave < state.stage.waves.length) {
      logs.push(`🌊 Wave ${nextWave + 1} 시작!`)
      return {
        ...state,
        enemies: initEnemies(state.stage.waves[nextWave].enemies),
        party,
        waveIndex: nextWave,
        log: [...state.log.slice(-30), ...logs],
        phase: 'fighting',
      }
    }
    // 승리
    const alive    = party.filter(p => p.alive).length
    const hpSum    = party.filter(p => p.alive).reduce((s, p) => s + p.currentHp / p.maxHp, 0)
    const avgHp    = alive > 0 ? hpSum / party.length : 0
    const stars    = alive === party.length && avgHp > 0.7 ? 3 : alive >= Math.ceil(party.length / 2) ? 2 : 1
    logs.push('🎉 전투 승리!')
    return { ...state, enemies, party, waveIndex: state.waveIndex, log: [...state.log.slice(-30), ...logs], phase: 'victory', stars }
  }

  return { ...state, enemies, party, log: [...state.log.slice(-30), ...logs] }
}

function applyEx(caster, enemies, party, logs) {
  const sk  = caster.skills.ex
  const eff = sk.effect
  if (!eff) return
  const mult = eff.multiplier ?? 4.0
  if (eff.type === 'damage') {
    const targets = eff.target === 'all_enemy'
      ? enemies.filter(e => e.alive)
      : enemies.filter(e => e.alive).slice(0, 1)
    for (const t of targets) {
      const d = dmg(caster.atk, t.def, mult)
      t.currentHp = Math.max(0, t.currentHp - d)
      if (t.currentHp === 0) t.alive = false
    }
    logs.push(`✨ ${caster.name}: ${sk.name}!`)
  } else if (eff.type === 'heal' || eff.type === 'buff') {
    for (const p of party) {
      if (p.alive) {
        const h = Math.round(caster.atk * (eff.multiplier ?? 2.0))
        p.currentHp = Math.min(p.maxHp, p.currentHp + h)
      }
    }
    logs.push(`✨ ${caster.name}: ${sk.name}!`)
  }
}

// ── HP 바 ──────────────────────────────────────────────
function HpBar({ current, max, color = '#6BCB77', height = 6 }) {
  const pct = max > 0 ? Math.max(0, Math.min(100, (current / max) * 100)) : 0
  const barColor = pct > 50 ? color : pct > 25 ? '#FFD93D' : '#ef4444'
  return (
    <div className="w-full rounded-full overflow-hidden" style={{ height, background: 'rgba(0,0,0,0.4)' }}>
      <div className="h-full rounded-full transition-all duration-150"
        style={{ width: `${pct}%`, background: barColor }} />
    </div>
  )
}

// ── EX 코스트 표시 (원형 pip) ────────────────────────
function ExPips({ cost, max, color }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: max }).map((_, i) => (
        <div key={i} className="rounded-full transition-all duration-200"
          style={{
            width: 10, height: 10,
            background: i < cost ? color : 'rgba(255,255,255,0.15)',
            boxShadow: i < cost ? `0 0 6px ${color}` : 'none',
          }} />
      ))}
    </div>
  )
}

// ── 메인 컴포넌트 ──────────────────────────────────────
export default function BattlePage({ stage, deckIds, ownedChars, onBattleEnd }) {
  const [battle, setBattle] = useState(() => ({
    phase:      'fighting',
    stage,
    waveIndex:  0,
    enemies:    initEnemies(stage.waves[0].enemies),
    party:      initParty(deckIds, ownedChars),
    autoMode:   false,
    log:        [`[${stage.title}] 전투 시작!`, `Wave 1 / ${stage.waves.length}`],
    stars:      0,
  }))

  const logEndRef = useRef(null)

  // 배틀 틱
  useEffect(() => {
    if (battle.phase !== 'fighting') return
    const id = setInterval(() => {
      setBattle(prev => runTick(prev))
    }, TICK_MS)
    return () => clearInterval(id)
  }, [battle.phase])

  // 로그 자동 스크롤
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [battle.log])

  // EX 수동 발동
  const fireEx = useCallback((partyUid) => {
    setBattle(prev => {
      if (prev.phase !== 'fighting') return prev
      const party   = prev.party.map(p => ({ ...p }))
      const enemies = prev.enemies.map(e => ({ ...e }))
      const logs    = []
      const caster  = party.find(p => p.uid === partyUid)
      if (!caster || !caster.alive || caster.exCost < caster.exMax) return prev
      applyEx(caster, enemies, party, logs)
      caster.exCost = 0
      const allEDead = enemies.every(e => !e.alive)
      if (allEDead) {
        const nextWave = prev.waveIndex + 1
        if (nextWave < prev.stage.waves.length) {
          logs.push(`🌊 Wave ${nextWave + 1} 시작!`)
          return { ...prev, enemies: initEnemies(prev.stage.waves[nextWave].enemies), party, waveIndex: nextWave, log: [...prev.log.slice(-30), ...logs] }
        }
        const alive = party.filter(p => p.alive).length
        const hpSum = party.filter(p => p.alive).reduce((s, p) => s + p.currentHp / p.maxHp, 0)
        const avgHp = alive > 0 ? hpSum / party.length : 0
        const stars = alive === party.length && avgHp > 0.7 ? 3 : alive >= Math.ceil(party.length / 2) ? 2 : 1
        logs.push('🎉 전투 승리!')
        return { ...prev, enemies, party, log: [...prev.log.slice(-30), ...logs], phase: 'victory', stars }
      }
      return { ...prev, enemies, party, log: [...prev.log.slice(-30), ...logs] }
    })
  }, [])

  const toggleAuto = () => setBattle(prev => ({ ...prev, autoMode: !prev.autoMode }))

  const handleBattleEnd = (won) => {
    const rewards = won ? stage.rewards : { exp: 0, growth: 0, gacha: 0 }
    onBattleEnd({ stars: battle.stars, rewards, stageId: stage.id, won })
  }

  const { enemies, party, waveIndex, phase, stars, log, autoMode } = battle
  const livingEnemies = enemies.filter(e => e.alive)
  const livingParty   = party.filter(p => p.alive)

  return (
    <div className="relative flex flex-col h-full overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #0a0a1a 0%, #0f1a10 50%, #0a0a1a 100%)' }}>

      {/* ── 상단 바 ─────────────────────────────────────── */}
      <div className="flex items-center justify-between px-4 py-2 shrink-0"
        style={{ background: 'rgba(0,0,0,0.5)', borderBottom: '1px solid var(--border)' }}>
        <div className="flex items-center gap-3">
          <span className="text-white font-bold text-sm">{stage.title}</span>
          <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
            style={{ background: 'rgba(255,255,255,0.1)', color: 'var(--text-muted)' }}>
            Wave {waveIndex + 1} / {stage.waves.length}
          </span>
          {stage.isBoss && (
            <span className="text-xs px-2 py-0.5 rounded-full font-bold"
              style={{ background: 'rgba(239,68,68,0.3)', color: '#f87171' }}>BOSS</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleAuto}
            className="px-4 py-1.5 rounded-xl text-xs font-bold transition-all"
            style={{
              background: autoMode ? 'var(--blue)' : 'rgba(255,255,255,0.1)',
              color: autoMode ? '#fff' : 'var(--text-muted)',
              border: `1px solid ${autoMode ? 'var(--blue)' : 'var(--border)'}`,
            }}>
            AUTO {autoMode ? 'ON' : 'OFF'}
          </button>
          <button
            onClick={() => handleBattleEnd(false)}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold"
            style={{ background: 'rgba(239,68,68,0.2)', color: '#f87171', border: '1px solid rgba(239,68,68,0.3)' }}>
            철수
          </button>
        </div>
      </div>

      {/* ── 적 영역 ──────────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center px-6 py-4 min-h-0">
        <div className="flex flex-wrap justify-center gap-4 w-full">
          {enemies.map(e => (
            <div key={e.uid}
              className="flex flex-col items-center gap-1.5 transition-all duration-300"
              style={{ opacity: e.alive ? 1 : 0.2, width: e.isBoss ? 140 : 100 }}>
              {/* 적 몸통 */}
              <div className="flex items-center justify-center rounded-2xl font-black text-3xl"
                style={{
                  width: e.isBoss ? 90 : 64,
                  height: e.isBoss ? 90 : 64,
                  background: e.isBoss
                    ? 'linear-gradient(135deg, #7f1d1d, #991b1b)'
                    : 'linear-gradient(135deg, #374151, #4b5563)',
                  border: `2px solid ${e.isBoss ? '#f87171' : 'rgba(255,255,255,0.15)'}`,
                  boxShadow: e.isBoss ? '0 0 20px rgba(248,113,113,0.4)' : 'none',
                  filter: e.alive ? 'none' : 'grayscale(1)',
                }}>
                {e.isBoss ? '👑' : '⚔️'}
              </div>
              {/* 이름 */}
              <div className="text-xs font-semibold text-center"
                style={{ color: e.isBoss ? '#f87171' : 'var(--text-muted)' }}>
                {e.name}
              </div>
              {/* HP 바 */}
              {e.alive && (
                <>
                  <HpBar current={e.currentHp} max={e.maxHp} color={e.isBoss ? '#f87171' : '#6BCB77'} height={5} />
                  <div className="text-xs" style={{ color: 'var(--text-dim)', fontSize: 10 }}>
                    {e.currentHp.toLocaleString()} / {e.maxHp.toLocaleString()}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── 배틀 로그 ────────────────────────────────────── */}
      <div className="shrink-0 px-4 py-2" style={{ maxHeight: 80 }}>
        <div className="overflow-y-auto rounded-xl px-3 py-2 text-xs space-y-0.5"
          style={{ background: 'rgba(0,0,0,0.4)', maxHeight: 72, color: 'var(--text-muted)' }}>
          {log.slice(-8).map((l, i) => (
            <div key={i} style={{ color: l.includes('승리') ? '#6BCB77' : l.includes('패배') ? '#f87171' : 'inherit' }}>
              {l}
            </div>
          ))}
          <div ref={logEndRef} />
        </div>
      </div>

      {/* ── 파티 영역 ────────────────────────────────────── */}
      <div className="shrink-0 px-4 pb-2">
        <div className="flex gap-3 justify-center">
          {party.map(p => {
            const exReady = p.alive && p.exCost >= p.exMax
            const elemColor = ELEMENT_COLOR[p.element] ?? '#fff'
            return (
              <div key={p.uid} className="flex flex-col items-center gap-1.5"
                style={{ opacity: p.alive ? 1 : 0.3, width: 110 }}>
                {/* 캐릭터 카드 */}
                <div className="w-full rounded-2xl overflow-hidden"
                  style={{
                    background: `linear-gradient(135deg, ${elemColor}22, rgba(30,30,60,0.9))`,
                    border: `1px solid ${exReady ? elemColor : 'var(--border)'}`,
                    boxShadow: exReady ? `0 0 14px ${elemColor}55` : 'none',
                    padding: '8px 10px',
                  }}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-white text-sm font-bold truncate">{p.name}</span>
                    <span className="text-xs" style={{ color: elemColor }}>Lv.{ownedChars[p.charId]?.level ?? 1}</span>
                  </div>
                  {/* HP 바 */}
                  <HpBar current={p.currentHp} max={p.maxHp} color={elemColor} height={6} />
                  <div className="flex justify-between mt-1" style={{ fontSize: 10, color: 'var(--text-dim)' }}>
                    <span>{p.currentHp.toLocaleString()}</span>
                    <span>{p.maxHp.toLocaleString()}</span>
                  </div>
                  {/* EX 게이지 */}
                  <div className="flex items-center justify-between mt-2">
                    <ExPips cost={p.exCost} max={p.exMax} color={elemColor} />
                    <button
                      onClick={() => fireEx(p.uid)}
                      disabled={!exReady || phase !== 'fighting'}
                      className="px-2.5 py-1 rounded-lg text-xs font-black transition-all disabled:opacity-30"
                      style={{
                        background: exReady ? `linear-gradient(135deg, ${elemColor}, ${elemColor}aa)` : 'rgba(255,255,255,0.1)',
                        color: exReady ? '#fff' : 'var(--text-dim)',
                        boxShadow: exReady ? `0 0 10px ${elemColor}66` : 'none',
                        transform: exReady ? 'scale(1.05)' : 'scale(1)',
                      }}>
                      EX
                    </button>
                  </div>
                  {/* S1 쿨타임 */}
                  {p.alive && (
                    <div className="mt-1 flex items-center gap-1">
                      <div className="flex-1 h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.1)' }}>
                        <div className="h-1 rounded-full" style={{
                          width: `${((p.s1Max - p.s1Timer) / p.s1Max) * 100}%`,
                          background: p.s1Timer === 0 ? '#FFD93D' : 'var(--blue)',
                          transition: 'width 0.3s',
                        }} />
                      </div>
                      <span style={{ fontSize: 9, color: 'var(--text-dim)', whiteSpace: 'nowrap' }}>
                        {p.s1Timer === 0 ? 'S1 준비' : `S1 ${(p.s1Timer * TICK_MS / 1000).toFixed(1)}s`}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ══ 승리 오버레이 ══════════════════════════════════ */}
      {phase === 'victory' && (
        <div className="absolute inset-0 flex items-center justify-center z-20"
          style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)' }}>
          <div className="flex flex-col items-center gap-5 p-8 rounded-3xl text-center"
            style={{ background: 'var(--surface)', border: '1px solid rgba(245,197,24,0.4)', minWidth: 320 }}>
            <div className="text-5xl">🎉</div>
            <h2 className="text-white font-black text-2xl">전투 승리!</h2>

            {/* 별 */}
            <div className="flex gap-3">
              {[1, 2, 3].map(i => (
                <span key={i} style={{ fontSize: 36, color: i <= stars ? 'var(--gold)' : 'rgba(255,255,255,0.2)' }}>★</span>
              ))}
            </div>

            {/* 보상 */}
            <div className="w-full rounded-2xl p-4 flex flex-col gap-2"
              style={{ background: 'rgba(255,255,255,0.06)' }}>
              <div className="text-sm font-bold mb-1" style={{ color: 'var(--text-muted)' }}>획득 보상</div>
              {stage.rewards.gacha > 0 && (
                <div className="flex justify-between text-sm">
                  <span style={{ color: 'var(--text-muted)' }}>💎 젬</span>
                  <span className="font-bold" style={{ color: '#c084fc' }}>+{stage.rewards.gacha}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span style={{ color: 'var(--text-muted)' }}>🪙 골드</span>
                <span className="font-bold" style={{ color: 'var(--gold)' }}>+{stage.rewards.growth}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span style={{ color: 'var(--text-muted)' }}>EXP</span>
                <span className="font-bold text-white">+{stage.rewards.exp}</span>
              </div>
            </div>

            <button
              onClick={() => handleBattleEnd(true)}
              className="w-full py-3 rounded-2xl text-base font-bold"
              style={{ background: 'linear-gradient(135deg, var(--gold), #fbbf24)', color: '#1a0f3a' }}>
              결과 확인
            </button>
          </div>
        </div>
      )}

      {/* ══ 패배 오버레이 ══════════════════════════════════ */}
      {phase === 'defeat' && (
        <div className="absolute inset-0 flex items-center justify-center z-20"
          style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)' }}>
          <div className="flex flex-col items-center gap-5 p-8 rounded-3xl text-center"
            style={{ background: 'var(--surface)', border: '1px solid rgba(239,68,68,0.4)', minWidth: 320 }}>
            <div className="text-5xl">💀</div>
            <h2 className="text-white font-black text-2xl">전투 패배</h2>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              파티가 전멸했습니다.<br />캐릭터를 강화하고 다시 도전하세요.
            </p>
            <div className="flex gap-3 w-full">
              <button
                onClick={() => onBattleEnd({ stars: 0, rewards: { exp: 0, growth: 0, gacha: 0 }, stageId: stage.id, won: false })}
                className="flex-1 py-3 rounded-2xl text-sm font-bold"
                style={{ background: 'rgba(255,255,255,0.08)', color: '#fff' }}>
                철수
              </button>
              <button
                onClick={() => setBattle({
                  phase: 'fighting',
                  stage,
                  waveIndex: 0,
                  enemies: initEnemies(stage.waves[0].enemies),
                  party: initParty(deckIds, ownedChars),
                  autoMode: false,
                  log: [`[${stage.title}] 재도전!`],
                  stars: 0,
                })}
                className="flex-1 py-3 rounded-2xl text-sm font-bold"
                style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)', color: '#fff' }}>
                재도전
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
