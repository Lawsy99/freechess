// The Master Games, in the order they appear on Learn: the short attacking
// games first, then the strategic games and endings.
import type { MasterGame } from './types'
import { OPERA } from './opera'
import { RETI } from './reti'
import { LASKER } from './lasker'
import { EVERGREEN } from './evergreen'
import { IMMORTAL } from './immortal'
import { ZUGZWANG } from './zugzwang'
import { STEINITZ } from './steinitz'
import { RUBINSTEIN } from './rubinstein'
import { LASKERCAPA } from './laskercapa'
import { GUN } from './gun'
import { ENDGAME } from './endgame'
import { AVRO } from './avro'
import evals from './evals.json'
import lines from './lines.json'

export const MASTER_GAMES: MasterGame[] = [OPERA, RETI, LASKER, EVERGREEN, IMMORTAL, STEINITZ, RUBINSTEIN, LASKERCAPA, ZUGZWANG, GUN, ENDGAME, AVRO]

/** The two rows on Learn: the attacking classics, then the strategic games and endings. */
export const MASTER_GROUPS: { title: string; ids: string[] }[] = [
  { title: 'Attacking classics', ids: ['opera', 'reti', 'lasker', 'evergreen', 'immortal', 'steinitz', 'rubinstein'] },
  { title: 'Strategy and endgames', ids: ['laskercapa', 'zugzwang', 'gun', 'endgame', 'avro'] },
]

/** Stockfish's verdict on each position, by game id (centipawns, White's side). */
export const MASTER_EVALS = evals as Record<string, (number | null)[]>

/** A line to see on the board: from position `at`, these moves; `cp` is the engine's verdict at its end (White's side). */
export type MasterLine = { label: string; at: number; sans: string[]; cp: number | null }

/**
 * "See the line" for each game (scratch/makeLines.mjs): the alternatives each
 * note names, by note index, and what follows each stop option, by "ply:san".
 */
export const MASTER_LINES = lines as Record<string, { notes: Record<string, MasterLine[]>; stops: Record<string, Omit<MasterLine, 'label' | 'at'> | null> }>
