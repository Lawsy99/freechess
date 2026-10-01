// Chess legends (Joseph, Oct 2026): the great players of the past, each a
// journey of eight levels. You meet them at 200; every win makes them
// stronger, up to 2400 at their peak. At every level they play their own
// openings and their own way (their style, and their book in openingBooks.ts).
// Only players long dead, whose games are history: living players own their
// name and likeness, so they aren't here.
import { groupFor } from '../logic/botPicks'
import type { Bot } from './bots'
import type { Character, Style, Trait } from './characters'

export type Legend = {
  id: string
  name: string
  flag: string
  country: string
  /** "1837–1884" */
  years: string
  /** One line about them, for their card. */
  bio: string
  /** A little more, for their page: what they were famous for. */
  story: string
  style: Style
  traits?: Trait[]
  thinkSpeed?: number
}

/** Their strength at each level: you meet them at the first, and each win moves them on. */
export const LEGEND_LEVELS = [200, 400, 700, 1000, 1300, 1600, 2000, 2400]

export const LEGENDS: Legend[] = [
  {
    id: 'philidor',
    name: 'Philidor',
    flag: '🇫🇷',
    country: 'France',
    years: '1726–1795',
    bio: 'The best player of the 1700s, and a famous composer too.',
    story: 'François-André Philidor was the first to say "pawns are the soul of chess". He plays a solid, patient game built on his pawns, and his defence to 1.e4 still carries his name.',
    style: 'solid',
    traits: ['centre-pawns'],
    thinkSpeed: 1.1,
  },
  {
    id: 'anderssen',
    name: 'Anderssen',
    flag: '🇩🇪',
    country: 'Germany',
    years: '1818–1879',
    bio: 'Played the Immortal Game, giving up both rooks and his queen to win.',
    story: 'Adolf Anderssen was the king of the romantic era: gambits, sacrifices and attacks on the king. His "Immortal Game" in 1851 and "Evergreen Game" are still the most famous attacks ever played.',
    style: 'aggressive',
    thinkSpeed: 0.9,
  },
  {
    id: 'morphy',
    name: 'Morphy',
    flag: '🇺🇸',
    country: 'USA',
    years: '1837–1884',
    bio: 'The dazzling American who beat everyone, then gave up chess at 22.',
    story: 'Paul Morphy toured Europe in 1858 and beat its best players. He knew that development and open lines win games: pieces out fast, open the centre, then strike. His "Opera Game" is the most taught game in chess.',
    style: 'aggressive',
    thinkSpeed: 0.8,
  },
  {
    id: 'lasker',
    name: 'Lasker',
    flag: '🇩🇪',
    country: 'Germany',
    years: '1868–1941',
    bio: 'World champion for 27 years, longer than anyone else.',
    story: 'Emanuel Lasker was a mathematician and a fighter. He played the person as much as the position, choosing whatever move would give his opponent the most trouble.',
    style: 'adaptive',
  },
  {
    id: 'capablanca',
    name: 'Capablanca',
    flag: '🇨🇺',
    country: 'Cuba',
    years: '1888–1942',
    bio: 'The chess machine: simple, clear moves and flawless endgames.',
    story: 'José Raúl Capablanca learned chess at four by watching his father, and lost only a handful of serious games in ten years. He made chess look easy: trade into an ending, then win it.',
    style: 'simplifying',
    traits: ['queen-trader'],
    thinkSpeed: 0.8,
  },
  {
    id: 'menchik',
    name: 'Menchik',
    flag: '🇨🇿',
    country: 'Czechoslovakia and England',
    years: '1906–1944',
    bio: 'The first women’s world champion, and a giant-killer of grandmasters.',
    story: 'Vera Menchik held the women’s world title from 1927 until her death, and beat world champions like Euwe. Her solid, careful play meant anyone who underestimated her paid for it.',
    style: 'solid',
    thinkSpeed: 1.1,
  },
  {
    id: 'alekhine',
    name: 'Alekhine',
    flag: '🇫🇷',
    country: 'Russia and France',
    years: '1892–1946',
    bio: 'World champion and combination wizard. Opens with a knight to tempt you on.',
    story: 'Alexander Alekhine was famous for deep, dazzling combinations. His defence to 1.e4, the knight to f6, dares you to chase it with your pawns, then attacks the centre you built.',
    style: 'aggressive',
    thinkSpeed: 1,
  },
]

export function findLegend(id: string): Legend | undefined {
  return LEGENDS.find((l) => l.id === id)
}

/** Which level you're on with a legend (0 = the first), from the levels you've beaten. */
export function legendLevel(beaten: number): number {
  return Math.min(beaten, LEGEND_LEVELS.length - 1)
}

/** A legend at a strength, as a Bot, so a game against them runs like any other. */
export function legendBot(legend: Legend, rating: number): Bot {
  return {
    id: legend.id,
    name: legend.name,
    group: groupFor(rating),
    rating,
    flag: legend.flag,
    country: legend.country,
    bio: legend.bio,
    style: legend.style,
    traits: legend.traits,
    thinkSpeed: legend.thinkSpeed,
  }
}

/** A legend as a Character, for the engine, the style and the dialogue. */
export function legendCharacter(legend: Legend): Character {
  return {
    id: legend.id,
    name: legend.name,
    strength: 'fixed',
    offset: 0,
    style: legend.style,
    traits: legend.traits,
    thinkSpeed: legend.thinkSpeed ?? 1,
    resigns: 'normal',
    offersDraw: 'rarely',
    acceptsDraws: legend.style === 'simplifying',
  }
}
