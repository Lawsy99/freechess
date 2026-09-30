// Game analysis that starts as soon as a game ends (FreeChess, Sep 2026): the
// review used to begin checking moves only once you opened it, about half a
// minute for a long game. Now the result screen starts it, and the review
// picks up the same job (with its progress) or the saved result.
import type { PositionEval } from '../logic/review'
import { saveGameAnalysis } from '../storage/db'
import { analyseGame } from './reviewAnalysis'

type Progress = { done: number; total: number }
type Job = { result: Promise<PositionEval[] | null>; progress: Progress; listeners: Set<(p: Progress) => void> }

const jobs = new Map<string, Job>()

/** Starts analysing a game (or returns the job already running). Saved when done. */
export function analyseInBackground(gameId: string, moves: readonly string[]): Job {
  const running = jobs.get(gameId)
  if (running) return running
  const job: Job = { result: Promise.resolve(null), progress: { done: 0, total: moves.length + 1 }, listeners: new Set() }
  job.result = analyseGame(
    moves,
    (done, total) => {
      job.progress = { done, total }
      for (const listen of job.listeners) listen(job.progress)
    },
    () => false,
  ).then(async (evals) => {
    if (evals) await saveGameAnalysis(gameId, evals)
    return evals
  })
  // A failed job is forgotten, so "Try again" starts afresh.
  job.result.catch(() => jobs.delete(gameId))
  jobs.set(gameId, job)
  return job
}

/** Follows a job's progress; returns a function to stop following. */
export function onProgress(job: Job, listen: (p: Progress) => void): () => void {
  job.listeners.add(listen)
  listen(job.progress)
  return () => job.listeners.delete(listen)
}
