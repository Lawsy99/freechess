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
  { id: 'beginner', label: 'Beginner', range: '100–950', about: 'Just starting out. They leave pieces hanging, and so might you.' },
  { id: 'intermediate', label: 'Intermediate', range: '1000–1550', about: 'Know their tactics and punish loose play.' },
  { id: 'advanced', label: 'Advanced', range: '1650–1950', about: 'Strong club players. Plans, patience and sharp calculation.' },
  { id: 'master', label: 'Master', range: '2100–2400', about: 'Titled strength. Every mistake gets found.' },
]

export const BOTS: Bot[] = [
  // Beginner
  { id: 'bo', name: 'Bo', group: 'beginner', rating: 100, flag: '🇺🇸', country: 'USA', bio: 'Six years old. Knows how the horse moves. Mostly.', style: 'aggressive', thinkSpeed: 0.5 },
  { id: 'grace', name: 'Grace', group: 'beginner', rating: 150, flag: '🇯🇲', country: 'Jamaica', bio: 'Learning with her grandson. Hums while she thinks.', style: 'aggressive', thinkSpeed: 0.9 },
  { id: 'finn', name: 'Finn', group: 'beginner', rating: 200, flag: '🇮🇪', country: 'Ireland', bio: 'Plays between rugby matches. Shakes hands like a prop forward.', style: 'aggressive', thinkSpeed: 0.6 },
  { id: 'ada', name: 'Ada', group: 'beginner', rating: 250, flag: '🇬🇧', country: 'England', bio: 'Learnt the moves last week. Very proud of her queen.', style: 'aggressive', thinkSpeed: 0.6 },
  { id: 'kofi', name: 'Kofi', group: 'beginner', rating: 300, flag: '🇬🇭', country: 'Ghana', bio: 'Plays his grandad in the market every Saturday. Never misses a week.', style: 'aggressive', thinkSpeed: 0.7 },
  { id: 'mei', name: 'Mei', group: 'beginner', rating: 350, flag: '🇨🇳', country: 'China', bio: 'Sets the pieces up perfectly straight before every game.', style: 'solid' },
  { id: 'sheila', name: 'Sheila', group: 'beginner', rating: 400, flag: '🇬🇧', country: 'England', bio: 'Plays for the company and the chat. Always brings biscuits.', style: 'solid' },
  { id: 'mateo', name: 'Mateo', group: 'beginner', rating: 450, flag: '🇦🇷', country: 'Argentina', bio: 'Football first, chess second. Celebrates every capture like a goal.', style: 'aggressive', traits: ['pawn-storm'], thinkSpeed: 0.6 },
  { id: 'hanna', name: 'Hanna', group: 'beginner', rating: 500, flag: '🇸🇪', country: 'Sweden', bio: 'Likes things neat and quiet. Says sorry when she takes your pieces.', style: 'simplifying', traits: ['queen-trader'] },
  { id: 'bill', name: 'Bill', group: 'beginner', rating: 550, flag: '🇬🇧', country: 'England', bio: 'Has played since 1974. Remembers every game he has ever lost.', style: 'simplifying', thinkSpeed: 1.3, resigns: 'plays-to-mate' },
  { id: 'ravi', name: 'Ravi', group: 'beginner', rating: 600, flag: '🇮🇳', country: 'India', bio: 'Watches chess videos at double speed. Remembers about half of each one.', style: 'theoretical' },
  { id: 'yuki', name: 'Yuki', group: 'beginner', rating: 650, flag: '🇯🇵', country: 'Japan', bio: 'Patient and polite. Bows before every game.', style: 'grinding', thinkSpeed: 1.2 },
  { id: 'oscar', name: 'Oscar', group: 'beginner', rating: 700, flag: '🇬🇧', country: 'England', bio: 'Eleven years old and improving fast. Barely pauses between moves.', style: 'aggressive', thinkSpeed: 0.35, resigns: 'quickly' },
  { id: 'lena', name: 'Lena', group: 'beginner', rating: 750, flag: '🇵🇱', country: 'Poland', bio: 'Plays chess on the train to school. Always in a hurry.', style: 'aggressive', thinkSpeed: 0.5 },
  { id: 'amara', name: 'Amara', group: 'beginner', rating: 800, flag: '🇳🇬', country: 'Nigeria', bio: 'Fast, fearless and very hard to scare.', style: 'aggressive', thinkSpeed: 0.6 },
  { id: 'terry', name: 'Terry', group: 'beginner', rating: 850, flag: '🇬🇧', country: 'England', bio: 'Wears a bow tie to every game. Swears it brings him luck.', style: 'aggressive', traits: ['king-walker'], thinkSpeed: 0.6, resigns: 'plays-to-mate' },
  { id: 'lukas', name: 'Lukas', group: 'beginner', rating: 900, flag: '🇩🇪', country: 'Germany', bio: 'Engineering student. Writes his moves down in perfect handwriting.', style: 'simplifying', traits: ['queen-trader'] },
  { id: 'sofia', name: 'Sofia', group: 'beginner', rating: 950, flag: '🇧🇷', country: 'Brazil', bio: 'Learnt from her aunt in Rio. Never stops smiling.', style: 'solid', traits: ['centre-pawns'] },
  { id: 'omar', name: 'Omar', group: 'beginner', rating: 925, flag: '🇪🇬', country: 'Egypt', bio: 'A café player. Talks the whole game, plays surprisingly well.', style: 'adaptive', thinkSpeed: 0.8 },

  // Intermediate
  { id: 'mina', name: 'Mina', group: 'intermediate', rating: 1075, flag: '🇰🇷', country: 'South Korea', bio: 'Solves puzzles every night before bed.', style: 'aggressive', thinkSpeed: 0.8 },
  { id: 'luca', name: 'Luca', group: 'intermediate', rating: 1175, flag: '🇮🇹', country: 'Italy', bio: 'Makes pizza for the whole club. Talks with his hands.', style: 'theoretical' },
  { id: 'zeynep', name: 'Zeynep', group: 'intermediate', rating: 1275, flag: '🇹🇷', country: 'Türkiye', bio: 'Chemistry student. Treats every position like an experiment.', style: 'adaptive' },
  { id: 'thandi', name: 'Thandi', group: 'intermediate', rating: 1325, flag: '🇿🇦', country: 'South Africa', bio: 'Coaches a school team. Says her pupils keep beating her.', style: 'solid', traits: ['centre-pawns'] },
  { id: 'minh', name: 'Minh', group: 'intermediate', rating: 1425, flag: '🇻🇳', country: 'Vietnam', bio: 'Quiet and quick. Plays online every lunch break.', style: 'grinding', traits: ['queen-trader'], thinkSpeed: 0.9 },
  { id: 'marjorie', name: 'Marjorie', group: 'intermediate', rating: 1000, flag: '🇬🇧', country: 'England', bio: 'Forty years at the board. Puts the kettle on before every game.', style: 'solid', traits: ['queen-trader'], resigns: 'plays-to-mate' },
  { id: 'jonas', name: 'Jonas', group: 'intermediate', rating: 1050, flag: '🇳🇴', country: 'Norway', bio: 'Grew up on long winter nights and chess books.', style: 'theoretical', thinkSpeed: 1.2 },
  { id: 'dex', name: 'Dex', group: 'intermediate', rating: 1100, flag: '🇬🇧', country: 'England', bio: 'Streams his games. Talks to his chat more than to you.', style: 'aggressive', traits: ['pawn-storm'], thinkSpeed: 0.5 },
  { id: 'fatima', name: 'Fatima', group: 'intermediate', rating: 1150, flag: '🇲🇦', country: 'Morocco', bio: 'Maths teacher. Checks every capture twice.', style: 'aggressive' },
  { id: 'clive', name: 'Clive', group: 'intermediate', rating: 1200, flag: '🇬🇧', country: 'England', bio: 'Retired accountant. Always happy to agree a draw.', style: 'simplifying', traits: ['queen-trader'], thinkSpeed: 0.9 },
  { id: 'tomas', name: 'Tomás', group: 'intermediate', rating: 1250, flag: '🇪🇸', country: 'Spain', bio: 'Plays in the park in Madrid every Sunday.', style: 'solid', traits: ['centre-pawns'] },
  { id: 'graham', name: 'Graham', group: 'intermediate', rating: 1300, flag: '🇬🇧', country: 'England', bio: 'Has read the rule book twice, and keeps a record of every game.', style: 'solid', traits: ['centre-pawns'], thinkSpeed: 1.2 },
  { id: 'olga', name: 'Olga', group: 'intermediate', rating: 1350, flag: '🇺🇦', country: 'Ukraine', bio: 'Never accepts a draw. Offer one and she just smiles.', style: 'grinding', thinkSpeed: 1.2 },
  { id: 'kenji', name: 'Kenji', group: 'intermediate', rating: 1400, flag: '🇯🇵', country: 'Japan', bio: 'Has played every day for twenty years. Never misses.', style: 'theoretical' },
  { id: 'priya', name: 'Priya', group: 'intermediate', rating: 1450, flag: '🇬🇧', country: 'England', bio: 'Reads chess books on the train. Has a whole shelf of them.', style: 'theoretical', thinkSpeed: 1.4 },
  { id: 'diego', name: 'Diego', group: 'intermediate', rating: 1500, flag: '🇲🇽', country: 'Mexico', bio: 'Plays with music on and his hood up.', style: 'aggressive', thinkSpeed: 0.8 },
  { id: 'chloe', name: 'Chloé', group: 'intermediate', rating: 1550, flag: '🇫🇷', country: 'France', bio: 'Elegant, calm, and never in a hurry.', style: 'solid', thinkSpeed: 1.2 },

  // Advanced
  { id: 'isabel', name: 'Isabel', group: 'advanced', rating: 1800, flag: '🇨🇴', country: 'Colombia', bio: 'Club champion three years running. Rarely misses a mate.', style: 'aggressive', traits: ['pawn-storm'] },
  { id: 'pieter', name: 'Pieter', group: 'advanced', rating: 1900, flag: '🇳🇱', country: 'Netherlands', bio: 'Loves football and chess equally. Can talk about both for hours.', style: 'adaptive' },
  { id: 'toby', name: 'Toby', group: 'advanced', rating: 1650, flag: '🇬🇧', country: 'England', bio: 'Friendly, relaxed, and somehow always a move ahead.', style: 'adaptive', thinkSpeed: 0.8 },
  { id: 'aarav', name: 'Aarav', group: 'advanced', rating: 1700, flag: '🇮🇳', country: 'India', bio: 'Studies every night. Sees tactics three moves deep.', style: 'adaptive' },
  { id: 'ray', name: 'Ray', group: 'advanced', rating: 1750, flag: '🇬🇧', country: 'England', bio: 'Teaches chess to kids. Teaches you by beating you, kindly.', style: 'solid' },
  { id: 'ingrid', name: 'Ingrid', group: 'advanced', rating: 1850, flag: '🇩🇰', country: 'Denmark', bio: 'Patient and precise. Never accepts a draw.', style: 'grinding', thinkSpeed: 1.2 },
  { id: 'malcolm', name: 'Malcolm', group: 'advanced', rating: 1950, flag: '🇬🇧', country: 'England', bio: 'Hardly speaks. Writes every move down. Plays correct, patient chess.', style: 'solid', thinkSpeed: 1.1 },

  // Master
  { id: 'tariq', name: 'Tariq', group: 'master', rating: 2200, flag: '🇵🇰', country: 'Pakistan', bio: 'Blitz legend of his city. Plays fast, talks faster.', style: 'aggressive', thinkSpeed: 0.8 },
  { id: 'leila', name: 'Leila', group: 'master', rating: 2300, flag: '🇮🇷', country: 'Iran', bio: 'A trainer of champions. Every move she makes has a reason.', style: 'solid', thinkSpeed: 1.1 },
  { id: 'nino', name: 'Nino', group: 'master', rating: 2100, flag: '🇬🇪', country: 'Georgia', bio: 'National champion at seventeen. Now coaches the national team.', style: 'aggressive' },
  { id: 'samuel', name: 'Samuel', group: 'master', rating: 2250, flag: '🇰🇪', country: 'Kenya', bio: 'Calm, deep and hard to read.', style: 'adaptive', thinkSpeed: 1.1 },
  { id: 'elena', name: 'Elena', group: 'master', rating: 2400, flag: '🇷🇴', country: 'Romania', bio: 'Grandmaster strength. Never takes a draw.', style: 'grinding', thinkSpeed: 1.2 },
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
