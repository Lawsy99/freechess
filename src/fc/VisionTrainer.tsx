// The vision trainer (FreeChess, Sep 2026): a square is named, you tap it on a
// board with no letters or numbers. 30 seconds; a wrong tap flashes red and
// costs nothing but time. From White's side or Black's.
import { useEffect, useRef, useState } from 'react'
import { Chessboard } from 'react-chessboard'
import { useBoardColours } from '../components/boardTheme'
import { nextSquare, VISION_SECONDS } from '../logic/vision'
import { BackIcon } from './icons'

type Props = {
  best: number
  onFinished: (score: number) => void
  onBack: () => void
}

type Side = 'white' | 'black'
const EMPTY = '8/8/8/8/8/8/8/8 w - - 0 1'

export function VisionTrainer({ best, onFinished, onBack }: Props) {
  const colours = useBoardColours()
  const [side, setSide] = useState<Side>('white')
  const [phase, setPhase] = useState<'ready' | 'playing' | 'done'>('ready')
  const [target, setTarget] = useState(() => nextSquare(null))
  const [score, setScore] = useState(0)
  const [misses, setMisses] = useState(0)
  const [left, setLeft] = useState(VISION_SECONDS)
  const [flash, setFlash] = useState<{ square: string; good: boolean } | null>(null)
  const endsAt = useRef(0)
  // The best before this round (the saved one changes as soon as it ends).
  const [bestBefore, setBestBefore] = useState(best)

  // The countdown.
  useEffect(() => {
    if (phase !== 'playing') return
    const timer = setInterval(() => {
      const secs = Math.max(0, Math.ceil((endsAt.current - Date.now()) / 1000))
      setLeft(secs)
      if (secs === 0) setPhase('done')
    }, 200)
    return () => clearInterval(timer)
  }, [phase])

  // Save the score once, when time's up.
  const saved = useRef(false)
  useEffect(() => {
    if (phase === 'done' && !saved.current) {
      saved.current = true
      onFinished(score)
    }
  }, [phase, score, onFinished])

  function start() {
    saved.current = false
    setBestBefore(best)
    endsAt.current = Date.now() + VISION_SECONDS * 1000
    setScore(0)
    setMisses(0)
    setLeft(VISION_SECONDS)
    setTarget(nextSquare(null))
    setFlash(null)
    setPhase('playing')
  }

  function tap(square: string) {
    if (phase !== 'playing') return
    const good = square === target
    setFlash({ square, good })
    if (good) {
      setScore((s) => s + 1)
      setTarget((t) => nextSquare(t))
    } else setMisses((m) => m + 1)
  }

  const squareStyles = flash ? { [flash.square]: { backgroundColor: flash.good ? 'rgba(95, 211, 141, 0.8)' : 'rgba(255, 93, 93, 0.8)' } } : {}

  return (
    <main className="fc-page fc-vision">
      <button type="button" className="fc-back" onClick={onBack}>
        <BackIcon size={22} /> Puzzles
      </button>

      <div className="fc-vision-top">
        {phase === 'playing' ? (
          <>
            <strong className="fc-vision-target" aria-live="polite">
              {target}
            </strong>
            <span className="fc-vision-stats">
              <span>{score} right</span>
              <span className={left <= 5 ? 'low' : undefined}>0:{String(left).padStart(2, '0')}</span>
            </span>
          </>
        ) : phase === 'done' ? (
          <div className="fc-vision-result">
            <strong>{score}</strong>
            <span>
              {score > bestBefore ? 'A new best!' : `Best ${Math.max(bestBefore, score)}`}
              {misses > 0 ? ` · ${misses} missed` : ''}
            </span>
          </div>
        ) : (
          <div className="fc-vision-intro">
            <h1>Vision</h1>
            <p>A square is named: tap it. As many as you can in {VISION_SECONDS} seconds. Best {best}.</p>
          </div>
        )}
      </div>

      <div className={`fc-vision-board ${phase === 'playing' ? '' : 'resting'}`}>
        <Chessboard
          options={{
            id: 'vision',
            position: EMPTY,
            boardOrientation: side,
            showNotation: false,
            allowDrawingArrows: false,
            lightSquareStyle: { backgroundColor: colours.light },
            darkSquareStyle: { backgroundColor: colours.dark },
            squareStyles,
            onSquareClick: ({ square }) => tap(square),
          }}
        />
      </div>

      {phase !== 'playing' && (
        <>
          <div className="fc-segmented" role="radiogroup" aria-label="Board from">
            {(['white', 'black'] as const).map((s) => (
              <button key={s} type="button" role="radio" aria-checked={side === s} className={side === s ? 'selected' : undefined} onClick={() => setSide(s)}>
                <span className={`fc-colour-dot ${s === 'white' ? 'w' : 'b'}`} aria-hidden="true" />
                As {s === 'white' ? 'White' : 'Black'}
              </button>
            ))}
          </div>
          <button type="button" className="fc-primary" onClick={start}>
            {phase === 'done' ? 'Again' : 'Start'}
          </button>
        </>
      )}
    </main>
  )
}
