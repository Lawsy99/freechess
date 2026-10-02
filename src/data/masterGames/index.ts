// The Master Games, in the order they appear on Learn: the shortest, clearest
// ideas first, the deep strategic game last.
import type { MasterGame } from './types'
import { OPERA } from './opera'
import { RETI } from './reti'
import { LASKER } from './lasker'
import { EVERGREEN } from './evergreen'
import { IMMORTAL } from './immortal'
import { ZUGZWANG } from './zugzwang'
import evals from './evals.json'

export const MASTER_GAMES: MasterGame[] = [OPERA, RETI, LASKER, EVERGREEN, IMMORTAL, ZUGZWANG]

/** Stockfish's verdict on each position, by game id (centipawns, White's side). */
export const MASTER_EVALS = evals as Record<string, (number | null)[]>
