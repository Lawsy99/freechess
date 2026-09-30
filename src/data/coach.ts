// FreeChess's Coach (Joseph, Sep 2026): one coach, just called "Coach",
// encouraging and very useful. Plays at your rating (Maia, like a person of
// that strength), never offers or takes draws: a coached game is a lesson.
// Voice: data/coachLines.ts ("coach"); face: data/appearances.ts ("coach");
// lines at the start and end: content/dialogue.csv.
import type { Character } from './characters'

export const COACH_ID = 'coach'

export const FC_COACH: Character = {
  id: COACH_ID,
  name: 'Coach',
  strength: 'scaling',
  offset: 0,
  style: 'adaptive',
  thinkSpeed: 1,
  resigns: 'never',
  offersDraw: 'rarely',
  acceptsDraws: false,
}
