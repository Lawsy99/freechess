// Board sounds, made on the fly with the browser's audio (no sound files to
// download or license). Each is a wooden piece landing on a board: a short
// burst of filtered noise for the click of wood, and a low thump underneath
// for weight. Captures are sharper, checks add a light ring, castling is two
// landings, a promotion rises, and the end of a game is a soft chime.
// Off when the player turns sound off in Settings.

export type MoveSoundKind = 'move' | 'capture' | 'check' | 'castle' | 'promote'

let enabled = true
let audio: AudioContext | null = null
let noise: AudioBuffer | null = null

export function setSoundEnabled(on: boolean) {
  enabled = on
}

/** iPhone only lets a page make sound after a tap, so wake the audio on the first one. */
function context(): AudioContext | null {
  if (typeof window === 'undefined' || !('AudioContext' in window)) return null
  audio ??= new AudioContext()
  if (audio.state === 'suspended') void audio.resume().catch(() => undefined)
  return audio
}

if (typeof window !== 'undefined') {
  window.addEventListener('pointerdown', () => void context(), { once: true, capture: true })
}

function noiseBuffer(ctx: AudioContext): AudioBuffer {
  if (noise) return noise
  noise = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 0.2), ctx.sampleRate)
  const data = noise.getChannelData(0)
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1
  return noise
}

/** One wooden landing: `click` is the brightness of the wood, `thump` the weight. */
function land(ctx: AudioContext, at: number, click: number, thump: number, volume: number) {
  // The click: noise through a band-pass, gone in a few hundredths of a second.
  const src = ctx.createBufferSource()
  src.buffer = noiseBuffer(ctx)
  const band = ctx.createBiquadFilter()
  band.type = 'bandpass'
  band.frequency.value = click
  band.Q.value = 1.4
  const clickGain = ctx.createGain()
  clickGain.gain.setValueAtTime(volume, at)
  clickGain.gain.exponentialRampToValueAtTime(0.0001, at + 0.05)
  src.connect(band).connect(clickGain).connect(ctx.destination)
  src.start(at)
  src.stop(at + 0.06)

  // The thump: a low sine that drops in pitch, for the board taking the weight.
  const osc = ctx.createOscillator()
  const body = ctx.createGain()
  osc.type = 'sine'
  osc.frequency.setValueAtTime(thump, at)
  osc.frequency.exponentialRampToValueAtTime(thump * 0.55, at + 0.09)
  body.gain.setValueAtTime(0.0001, at)
  body.gain.exponentialRampToValueAtTime(volume * 0.9, at + 0.004)
  body.gain.exponentialRampToValueAtTime(0.0001, at + 0.11)
  osc.connect(body).connect(ctx.destination)
  osc.start(at)
  osc.stop(at + 0.12)
}

function tone(ctx: AudioContext, at: number, freq: number, length: number, volume: number) {
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = 'sine'
  osc.frequency.setValueAtTime(freq, at)
  gain.gain.setValueAtTime(0.0001, at)
  gain.gain.exponentialRampToValueAtTime(volume, at + 0.01)
  gain.gain.exponentialRampToValueAtTime(0.0001, at + length)
  osc.connect(gain).connect(ctx.destination)
  osc.start(at)
  osc.stop(at + length + 0.02)
}

function ready(): AudioContext | null {
  if (!enabled) return null
  const ctx = context()
  return ctx && ctx.state === 'running' ? ctx : null
}

export function playMoveSound(kind: MoveSoundKind | boolean) {
  const ctx = ready()
  if (!ctx) return
  // (Older callers pass "was it a capture".)
  const k: MoveSoundKind = typeof kind === 'boolean' ? (kind ? 'capture' : 'move') : kind
  const now = ctx.currentTime
  switch (k) {
    case 'move':
      land(ctx, now, 1500, 190, 0.5)
      break
    case 'capture':
      land(ctx, now, 2300, 160, 0.6)
      land(ctx, now + 0.045, 1700, 140, 0.4)
      break
    case 'check':
      land(ctx, now, 1600, 190, 0.5)
      tone(ctx, now + 0.03, 1320, 0.25, 0.08)
      break
    case 'castle':
      land(ctx, now, 1400, 180, 0.45)
      land(ctx, now + 0.11, 1600, 190, 0.45)
      break
    case 'promote':
      land(ctx, now, 1500, 190, 0.5)
      tone(ctx, now + 0.04, 660, 0.14, 0.07)
      tone(ctx, now + 0.12, 990, 0.2, 0.07)
      break
  }
}

/** The end of a game: a soft two-note chime (rising for a win, falling otherwise). */
export function playEndSound(won: boolean | null) {
  const ctx = ready()
  if (!ctx) return
  const now = ctx.currentTime
  const [a, b] = won ? [660, 990] : won === false ? [660, 495] : [660, 660]
  tone(ctx, now, a, 0.35, 0.1)
  tone(ctx, now + 0.16, b, 0.5, 0.1)
}
