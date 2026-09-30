// The Learn path's rules: which lesson is next, which are open, and whether a
// round of puzzles was good enough. Pure, so it can be tested on its own.
import { ALL_LESSONS, type Lesson } from '../data/learnPath'

/** The next lesson to do: the first one not yet done (null when all are). */
export function nextLesson(done: readonly string[]): Lesson | null {
  return ALL_LESSONS.find((l) => !done.includes(l.id)) ?? null
}

/** Open: done already, or the next one up. Everything after that stays locked. */
export function isOpen(lessonId: string, done: readonly string[]): boolean {
  return done.includes(lessonId) || nextLesson(done)?.id === lessonId
}

/** A round of puzzles passes with enough solved cleanly (first time, no help). */
export function roundPassed(solvedCleanly: number, pass: number): boolean {
  return solvedCleanly >= pass
}

/** Where a lesson's puzzles are pitched: your puzzle rating plus the step's offset, never below 400. */
export function lessonPuzzleRating(yourRating: number, offset: number): number {
  return Math.max(400, Math.round(yourRating + offset))
}
