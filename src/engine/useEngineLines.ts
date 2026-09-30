// React hook for the analysis board: the engine's top lines for a position.
// It waits a moment after the position changes (so stepping quickly through
// a game doesn't queue up a search for every move), and remembers results.
import { Chess } from 'chess.js'
import { useEffect, useState } from 'react'
import { getEngine } from './stockfish'
import type { PvLine } from './uci'

export type EngineLines = { fen: string; lines: PvLine[] }

const LIMITS = { multiPv: 3, depth: 18, movetime: 1500 }
const WAIT_MS = 300
const cache = new Map<string, PvLine[]>()

/** `current`: lines for this exact position. `latest`: the last result, so the evaluation bar doesn't flicker while it thinks. */
export function useEngineLines(fen: string, enabled = true): { current: EngineLines | null; latest: EngineLines | null } {
  const [result, setResult] = useState<EngineLines | null>(null)

  useEffect(() => {
    if (!enabled || new Chess(fen).isGameOver()) return
    const known = cache.get(fen)
    if (known) {
      setResult({ fen, lines: known })
      return
    }
    let cancelled = false
    const timer = setTimeout(() => {
      getEngine()
        .search(fen, LIMITS)
        .then(({ lines }) => {
          cache.set(fen, lines)
          if (cache.size > 200) cache.delete(cache.keys().next().value!)
          if (!cancelled) setResult({ fen, lines })
        })
        .catch(() => undefined) // (the board still works without the engine)
    }, WAIT_MS)
    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [fen, enabled])

  return { current: result?.fen === fen ? result : null, latest: result }
}
