// The bots you can play in FreeChess, grouped by level (Joseph, Sep 2026:
// far more beginner and intermediate bots, a global feel, every one with
// their own personality and style). The Club Night cast are here too, at
// fixed ratings, alongside new players from around the world.
//
// How they play comes from their Character (style, habits, speed: see
// logic/style.ts); how they look from data/appearances.ts; what they say
// from content/dialogue.csv. Below 800 the custom mistake-making bot plays;
// from 800 up, Maia (trained on millions of real games) plays like a person
// of that rating.
import type { Character, Style, Trait } from './characters'

export type BotGroup = 'beginner' | 'intermediate' | 'advanced' | 'master'

export type Bot = {
  id: string
  name: string
  group: BotGroup
  rating: number
  /** Flag and country, for the global feel. */
  flag: string
  country: string
  /** One line about them, in the bot list. */
  bio: string
  style: Style
  traits?: Trait[]
  /** 1 = normal thinking speed, below 1 quicker, above 1 slower. */
  thinkSpeed?: number
  resigns?: Character['resigns']
}

export const BOT_GROUPS: { id: BotGroup; label: string; range: string; about: string }[] = [
  { id: 'beginner', label: 'Beginner', range: '250–950', about: 'Just starting out. They leave pieces hanging, and so might you.' },
  { id: 'intermediate', label: 'Intermediate', range: '1000–1550', about: 'Know their tactics, have favourite openings, punish loose play.' },
  { id: 'advanced', label: 'Advanced', range: '1650–1950', about: 'Strong club players. Plans, patience and sharp calculation.' },
  { id: 'master', label: 'Master', range: '2100–2400', about: 'Titled strength. Every mistake gets found.' },
]

export const BOTS: Bot[] = [
  // Beginner
  { id: 'ada', name: 'Ada', group: 'beginner', rating: 250, flag: '🇬🇧', country: 'England', bio: 'Learnt the moves last week. Very proud of her queen.', style: 'aggressive', thinkSpeed: 0.6 },
  { id: 'kofi', name: 'Kofi', group: 'beginner', rating: 300, flag: '🇬🇭', country: 'Ghana', bio: 'Plays his grandad in the market every Saturday. Loves a capture.', style: 'aggressive', thinkSpeed: 0.7 },
  { id: 'mei', name: 'Mei', group: 'beginner', rating: 350, flag: '🇨🇳', country: 'China', bio: 'Careful and tidy. Sometimes a bit too careful.', style: 'solid' },
  { id: 'sheila', name: 'Sheila', group: 'beginner', rating: 400, flag: '🇬🇧', country: 'England', bio: 'Runs the raffle at Wexley Chess Club. Plays when asked.', style: 'solid' },
  { id: 'mateo', name: 'Mateo', group: 'beginner', rating: 450, flag: '🇦🇷', country: 'Argentina', bio: 'Football first, chess second. Attacks like a winger.', style: 'aggressive', traits: ['pawn-storm'], thinkSpeed: 0.6 },
  { id: 'hanna', name: 'Hanna', group: 'beginner', rating: 500, flag: '🇸🇪', country: 'Sweden', bio: 'Likes things symmetrical and quiet. Swaps whenever she can.', style: 'simplifying', traits: ['queen-trader'] },
  { id: 'bill', name: 'Bill', group: 'beginner', rating: 550, flag: '🇬🇧', country: 'England', bio: 'A club member since 1974. Remembers every game he has ever lost.', style: 'simplifying', thinkSpeed: 1.3, resigns: 'plays-to-mate' },
  { id: 'ravi', name: 'Ravi', group: 'beginner', rating: 600, flag: '🇮🇳', country: 'India', bio: 'Knows a lot of openings. Remembers about half of each one.', style: 'theoretical' },
  { id: 'yuki', name: 'Yuki', group: 'beginner', rating: 650, flag: '🇯🇵', country: 'Japan', bio: 'Patient. Waits for you to make the mistake.', style: 'grinding', thinkSpeed: 1.2 },
  { id: 'oscar', name: 'Oscar', group: 'beginner', rating: 700, flag: '🇬🇧', country: 'England', bio: 'Eleven years old and improving fast. Barely pauses between moves.', style: 'aggressive', thinkSpeed: 0.35, resigns: 'quickly' },
  { id: 'lena', name: 'Lena', group: 'beginner', rating: 750, flag: '🇵🇱', country: 'Poland', bio: 'Plays chess on the train to school. Always in a hurry.', style: 'aggressive', thinkSpeed: 0.5 },
  { id: 'amara', name: 'Amara', group: 'beginner', rating: 800, flag: '🇳🇬', country: 'Nigeria', bio: 'Fast, fearless and very hard to scare.', style: 'aggressive', thinkSpeed: 0.6 },
  { id: 'terry', name: 'Terry', group: 'beginner', rating: 850, flag: '🇬🇧', country: 'England', bio: 'Plays the Bongcloud completely seriously. His king likes a walk.', style: 'aggressive', traits: ['king-walker'], thinkSpeed: 0.6, resigns: 'plays-to-mate' },
  { id: 'lukas', name: 'Lukas', group: 'beginner', rating: 900, flag: '🇩🇪', country: 'Germany', bio: 'Swaps everything off and heads for the endgame.', style: 'simplifying', traits: ['queen-trader'] },
  { id: 'sofia', name: 'Sofia', group: 'beginner', rating: 950, flag: '🇧🇷', country: 'Brazil', bio: 'Castles early, then comes for you.', style: 'solid', traits: ['centre-pawns'] },
  { id: 'omar', name: 'Omar', group: 'beginner', rating: 925, flag: '🇪🇬', country: 'Egypt', bio: 'A café player. Talks the whole game, plays surprisingly well.', style: 'adaptive', thinkSpeed: 0.8 },

  // Intermediate
  { id: 'marjorie', name: 'Marjorie', group: 'intermediate', rating: 1000, flag: '🇬🇧', country: 'England', bio: 'Has played at Wexley since 1979. Swaps queens and grinds you down.', style: 'solid', traits: ['queen-trader'], resigns: 'plays-to-mate' },
  { id: 'jonas', name: 'Jonas', group: 'intermediate', rating: 1050, flag: '🇳🇴', country: 'Norway', bio: 'Grew up on long winter nights and chess books.', style: 'theoretical', thinkSpeed: 1.2 },
  { id: 'dex', name: 'Dex', group: 'intermediate', rating: 1100, flag: '🇬🇧', country: 'England', bio: 'Streams his games. Throws his pawns at your king.', style: 'aggressive', traits: ['pawn-storm'], thinkSpeed: 0.5 },
  { id: 'fatima', name: 'Fatima', group: 'intermediate', rating: 1150, flag: '🇲🇦', country: 'Morocco', bio: 'A sharp tactician who hates a quiet position.', style: 'aggressive' },
  { id: 'clive', name: 'Clive', group: 'intermediate', rating: 1200, flag: '🇬🇧', country: 'England', bio: 'Quiet, tidy, happy with a draw. Hard to beat.', style: 'simplifying', traits: ['queen-trader'], thinkSpeed: 0.9 },
  { id: 'tomas', name: 'Tomás', group: 'intermediate', rating: 1250, flag: '🇪🇸', country: 'Spain', bio: 'Loves the centre. Pawns first, questions later.', style: 'solid', traits: ['centre-pawns'] },
  { id: 'graham', name: 'Graham', group: 'intermediate', rating: 1300, flag: '🇬🇧', country: 'England', bio: 'Club secretary. Plays by the book, and has read the rule book.', style: 'solid', traits: ['centre-pawns'], thinkSpeed: 1.2 },
  { id: 'olga', name: 'Olga', group: 'intermediate', rating: 1350, flag: '🇺🇦', country: 'Ukraine', bio: 'Grinds out endgames for fun. Never offers a draw.', style: 'grinding', thinkSpeed: 1.2 },
  { id: 'kenji', name: 'Kenji', group: 'intermediate', rating: 1400, flag: '🇯🇵', country: 'Japan', bio: 'Plays the same opening every game, and plays it very well.', style: 'theoretical' },
  { id: 'priya', name: 'Priya', group: 'intermediate', rating: 1450, flag: '🇬🇧', country: 'England', bio: 'Studies openings from books. Lost once she leaves them.', style: 'theoretical', thinkSpeed: 1.4 },
  { id: 'diego', name: 'Diego', group: 'intermediate', rating: 1500, flag: '🇲🇽', country: 'Mexico', bio: 'Sacrifices first, checks the maths afterwards.', style: 'aggressive', thinkSpeed: 0.8 },
  { id: 'chloe', name: 'Chloé', group: 'intermediate', rating: 1550, flag: '🇫🇷', country: 'France', bio: 'Elegant and positional. Never in a hurry.', style: 'solid', thinkSpeed: 1.2 },

  // Advanced
  { id: 'toby', name: 'Toby', group: 'advanced', rating: 1650, flag: '🇬🇧', country: 'England', bio: 'Friendly, relaxed, and somehow always a move ahead.', style: 'adaptive', thinkSpeed: 0.8 },
  { id: 'aarav', name: 'Aarav', group: 'advanced', rating: 1700, flag: '🇮🇳', country: 'India', bio: 'Studies every night. Sees tactics three moves deep.', style: 'adaptive' },
  { id: 'ray', name: 'Ray', group: 'advanced', rating: 1750, flag: '🇬🇧', country: 'England', bio: 'Runs the junior club. Teaches by beating you, kindly.', style: 'solid' },
  { id: 'ingrid', name: 'Ingrid', group: 'advanced', rating: 1850, flag: '🇩🇰', country: 'Denmark', bio: 'Squeezes small advantages until something breaks.', style: 'grinding', thinkSpeed: 1.2 },
  { id: 'malcolm', name: 'Malcolm', group: 'advanced', rating: 1950, flag: '🇬🇧', country: 'England', bio: 'Board one. Hardly speaks. Plays correct, patient chess.', style: 'solid', thinkSpeed: 1.1 },

  // Master
  { id: 'nino', name: 'Nino', group: 'master', rating: 2100, flag: '🇬🇪', country: 'Georgia', bio: 'National champion at seventeen. Attacks with both bishops.', style: 'aggressive' },
  { id: 'samuel', name: 'Samuel', group: 'master', rating: 2250, flag: '🇰🇪', country: 'Kenya', bio: 'Calm, deep and hard to read. Adapts to whatever you play.', style: 'adaptive', thinkSpeed: 1.1 },
  { id: 'elena', name: 'Elena', group: 'master', rating: 2400, flag: '🇷🇴', country: 'Romania', bio: 'A grandmaster-level grinder. She will outlast you.', style: 'grinding', thinkSpeed: 1.2 },
]

export function findBot(id: string): Bot | undefined {
  return BOTS.find((b) => b.id === id)
}

export function botsIn(group: BotGroup): Bot[] {
  return BOTS.filter((b) => b.group === group).sort((a, b) => a.rating - b.rating)
}

/** A bot as a Character, for the engine, the style and the dialogue. */
export function botCharacter(bot: Bot): Character {
  return {
    id: bot.id,
    name: bot.name,
    strength: 'fixed',
    offset: 0,
    style: bot.style,
    traits: bot.traits,
    thinkSpeed: bot.thinkSpeed ?? 1,
    resigns: bot.resigns ?? 'normal',
    offersDraw: bot.style === 'simplifying' ? 'move-12-when-level' : 'rarely',
    acceptsDraws: bot.style !== 'grinding',
  }
}
