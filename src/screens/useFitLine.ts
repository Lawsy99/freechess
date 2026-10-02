// The message under the board must be readable in full (Joseph, Oct 2026: the
// Coach's longer notes were cut off). The panel can't grow (the board never
// moves), so a long line gets a smaller font until it fits, down to a size
// that is still easy to read. If it still doesn't fit, the panel scrolls and
// `overflowing` says so, for a "more" hint.
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'

const LARGEST = 15
const SMALLEST = 12.5

export function useFitLine(key: unknown) {
  const panelRef = useRef<HTMLElement | null>(null)
  const lineRef = useRef<HTMLElement | null>(null)
  const [overflowing, setOverflowing] = useState(false)

  const fit = useCallback(() => {
    const panel = panelRef.current
    const line = lineRef.current
    if (!panel) return
    panel.scrollTop = 0
    if (!line) {
      setOverflowing(panel.scrollHeight > panel.clientHeight + 1)
      return
    }
    // Room for the line: the panel, less anything above it. (The panel's bottom
    // padding can take the last few pixels of text.)
    const room = panel.clientHeight - (line.offsetTop - panel.offsetTop) - 2
    let size = LARGEST
    line.style.fontSize = `${size}px`
    while (line.offsetHeight > room && size > SMALLEST) {
      size -= 0.5
      line.style.fontSize = `${size}px`
    }
    setOverflowing(line.offsetHeight > room)
  }, [])

  // eslint-disable-next-line react-hooks/exhaustive-deps -- refit when the message changes
  useLayoutEffect(fit, [key, fit])
  useEffect(() => {
    window.addEventListener('resize', fit)
    return () => window.removeEventListener('resize', fit)
  }, [fit])

  // (Callback refs, so they fit any element: a paragraph or a button.)
  const setPanel = useCallback((el: HTMLElement | null) => {
    panelRef.current = el
  }, [])
  const setLine = useCallback((el: HTMLElement | null) => {
    lineRef.current = el
  }, [])
  return { panelRef: setPanel, lineRef: setLine, overflowing }
}
