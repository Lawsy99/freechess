// Drawing on the analysis board (FreeChess, Sep 2026, as on chess.com): with
// the pencil on, drag from one square to another for an arrow, or tap a
// square to circle it. Doing the same again rubs it out. It sits over the
// board and asks the page which square is under the finger, so it works
// whichever way round the board is.
import { useRef } from 'react'

type Props = {
  onArrow: (from: string, to: string) => void
  onCircle: (square: string) => void
}

function squareAt(x: number, y: number): string | null {
  for (const el of document.elementsFromPoint(x, y)) {
    const sq = (el as HTMLElement).dataset?.square
    if (sq) return sq
  }
  return null
}

export function DrawLayer({ onArrow, onCircle }: Props) {
  const start = useRef<string | null>(null)
  return (
    <div
      className="draw-layer"
      aria-label="Drawing on the board: drag for an arrow, tap for a circle"
      onPointerDown={(e) => {
        start.current = squareAt(e.clientX, e.clientY)
        e.currentTarget.setPointerCapture(e.pointerId)
      }}
      onPointerUp={(e) => {
        const from = start.current
        const to = squareAt(e.clientX, e.clientY)
        start.current = null
        if (!from || !to) return
        if (from === to) onCircle(to)
        else onArrow(from, to)
      }}
      onPointerCancel={() => (start.current = null)}
    />
  )
}

