/**
 * audio.js — 간단한 Web Audio API 기반 오디오 매니저
 *
 * 실제 음원 파일이 준비되면 /public/audio/ 폴더에 넣으면 자동 사용됩니다.
 * 파일이 없으면 Web Audio API로 합성음을 재생합니다.
 *
 * 지원 SFX 키:
 *   buttonClick, gacha, battleStart, victory, defeat,
 *   levelUp, equip, awaken
 */

let _ctx = null
let _bgmSource = null
let _bgmVolume = 0.5
let _sfxVolume = 0.7

function getCtx() {
  if (!_ctx) {
    try { _ctx = new (window.AudioContext || window.webkitAudioContext)() } catch { _ctx = null }
  }
  return _ctx
}

function resumeCtx() {
  const ctx = getCtx()
  if (ctx?.state === 'suspended') ctx.resume()
  return ctx
}

/** 합성음 재생 (파일 없을 때 fallback) */
function beep(frequency = 440, duration = 0.15, type = 'sine', volume = 0.3) {
  const ctx = resumeCtx()
  if (!ctx) return
  try {
    const osc  = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.type      = type
    osc.frequency.setValueAtTime(frequency, ctx.currentTime)
    gain.gain.setValueAtTime(volume * _sfxVolume, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + duration)
  } catch { /* ignore */ }
}

function chime(notes, spacing = 0.1) {
  notes.forEach(([freq, dur, type = 'sine'], i) => {
    setTimeout(() => beep(freq, dur, type), i * spacing * 1000)
  })
}

// SFX 정의 (합성음)
const SFX_SYNTH = {
  buttonClick:  () => beep(600, 0.06, 'square', 0.15),
  gacha:        () => chime([[440,0.1],[550,0.1],[660,0.1],[880,0.3,'triangle']], 0.08),
  battleStart:  () => chime([[200,0.1,'sawtooth'],[300,0.1,'sawtooth'],[400,0.2,'sawtooth']], 0.1),
  victory:      () => chime([[523,0.1],[659,0.1],[784,0.1],[1047,0.4,'triangle']], 0.12),
  defeat:       () => chime([[330,0.2,'sawtooth'],[220,0.4,'sawtooth']], 0.25),
  levelUp:      () => chime([[440,0.08],[550,0.08],[660,0.08],[770,0.08],[880,0.2]], 0.07),
  equip:        () => beep(400, 0.12, 'triangle', 0.2),
  awaken:       () => chime([[330,0.1],[440,0.1],[550,0.1],[660,0.1],[880,0.3,'triangle']], 0.09),
}

/** SFX 파일 경로 (파일이 있으면 우선 사용) */
const SFX_FILES = {
  buttonClick:  '/audio/sfx_click.mp3',
  gacha:        '/audio/sfx_gacha.mp3',
  battleStart:  '/audio/sfx_battle_start.mp3',
  victory:      '/audio/sfx_victory.mp3',
  defeat:       '/audio/sfx_defeat.mp3',
  levelUp:      '/audio/sfx_levelup.mp3',
  equip:        '/audio/sfx_equip.mp3',
  awaken:       '/audio/sfx_awaken.mp3',
}

const _audioCache = {}

async function tryPlayFile(key) {
  const path = SFX_FILES[key]
  if (!path) return false
  try {
    if (!_audioCache[key]) {
      const audio = new Audio(path)
      _audioCache[key] = audio
    }
    const audio = _audioCache[key]
    audio.volume = _sfxVolume
    audio.currentTime = 0
    await audio.play()
    return true
  } catch {
    return false
  }
}

export async function playAudio(key) {
  const played = await tryPlayFile(key)
  if (!played && SFX_SYNTH[key]) {
    SFX_SYNTH[key]()
  }
}

export function setVolume(type, value) {
  if (type === 'bgm') {
    _bgmVolume = value
    if (_bgmSource) _bgmSource.volume = value
  } else if (type === 'sfx') {
    _sfxVolume = value
  }
}

/** BGM 재생 (파일 있을 때만 작동) */
export function playBgm(path) {
  stopBgm()
  try {
    _bgmSource = new Audio(path)
    _bgmSource.loop   = true
    _bgmSource.volume = _bgmVolume
    _bgmSource.play().catch(() => {})
  } catch { _bgmSource = null }
}

export function stopBgm() {
  if (_bgmSource) {
    _bgmSource.pause()
    _bgmSource = null
  }
}
