import { describe, expect, it } from 'vitest'
import { CHOOSABLE_THEMES, MIN_TRIED, recordThemes, shownThemes, themeLabel, weakestThemes, type ThemeStats } from './puzzleThemes'

describe('puzzle themes', () => {
  it('names themes in plain words', () => {
    expect(themeLabel('fork')).toBe('Forks')
    expect(themeLabel('someNewTheme')).toBe('Some New Theme')
  })

  it('shows a puzzle’s ideas, not its generic tags', () => {
    expect(shownThemes(['crushing', 'fork', 'middlegame', 'hangingPiece'])).toEqual(['Forks', 'Hanging pieces'])
  })

  it('has no theme twice', () => {
    expect(new Set(CHOOSABLE_THEMES.map((t) => t.id)).size).toBe(CHOOSABLE_THEMES.length)
  })

  it('counts results by theme, ignoring generic tags', () => {
    let s: ThemeStats | undefined
    s = recordThemes(s, ['fork', 'crushing'], true)
    s = recordThemes(s, ['fork'], false)
    expect(s).toEqual({ fork: { tried: 2, solved: 1 } })
  })

  it('finds your weakest themes once there are enough puzzles', () => {
    const stats: ThemeStats = {
      fork: { tried: MIN_TRIED, solved: 5 },
      pin: { tried: 10, solved: 3 },
      skewer: { tried: 8, solved: 6 },
      mateIn1: { tried: 2, solved: 0 }, // too few to judge
    }
    expect(weakestThemes(stats).map((t) => t.id)).toEqual(['pin', 'skewer', 'fork'])
    expect(weakestThemes(undefined)).toEqual([])
  })
})
