// The Learn path's rules: which lesson is next, which are open, and where
// its positions are pitched. Pure, so it can be tested on its own.
import { ALL_LESSONS, type Lesson } from '../data/learnPath'

/** The next lesson to do: the first one not yet done (null when all are). */
export function nextLesson(done: readonly string[]): Lesson | null {
  return ALL_LESSONS.find((l) => !done.includes(l.id)) ?? null
}

/** Open: done already, or the next one up. Everything after that stays locked. */
export function isOpen(lessonId: string, done: readonly string[]): boolean {
  return done.includes(lessonId) || nextLesson(done)?.id === lessonId
}

/** Where a lesson's tactics positions are pitched: your puzzle rating plus the step's offset, never below 400. */
export function lessonPuzzleRating(yourRating: number, offset: number): number {
  return Math.max(400, Math.round(yourRating + offset))
}
