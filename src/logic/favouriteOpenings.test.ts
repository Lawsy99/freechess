import { describe, expect, it } from 'vitest'
import { favouriteOpenings } from './favouriteOpenings'

describe("a bot's favourite openings", () => {
  it('names what their book plays, by colour', () => {
    expect(favouriteOpenings('kenji')).toEqual({ white: ['the Ruy Lopez'], black: ['the Caro-Kann', "the Queen's Gambit Declined"] })
    expect(favouriteOpenings('olga').white).toEqual(['the London System'])
  })

  it('says nothing for bots without a book, or for Terry', () => {
    expect(favouriteOpenings('ada')).toEqual({ white: [], black: [] })
    expect(favouriteOpenings('terry')).toEqual({ white: [], black: [] })
  })
})
