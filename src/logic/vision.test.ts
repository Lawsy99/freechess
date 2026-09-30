import { describe, expect, it } from 'vitest'
import { nextSquare } from './vision'

describe('the vision trainer', () => {
  it('names real squares, never the same twice running', () => {
    let last: string | null = null
    for (let i = 0; i < 200; i++) {
      const sq = nextSquare(last)
      expect(sq).toMatch(/^[a-h][1-8]$/)
      expect(sq).not.toBe(last)
      last = sq
    }
  })

  it('reaches every corner', () => {
    expect(nextSquare(null, () => 0)).toBe('a1')
    expect(nextSquare(null, () => 0.999)).toBe('h8')
  })
})
