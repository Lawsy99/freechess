// Keeping progress the same on every device (FreeChess, Oct 2026). Devices
// that share a sync code share one copy online; syncing fetches it, combines
// it with this device's progress (logic/syncMerge.ts: nothing is lost), saves
// the result here, and uploads it. The code stays on this device only.
import { SYNC_KEY, SYNC_URL } from '../syncConfig'
import { mergeSync, newSyncCode, type SyncData } from '../logic/syncMerge'
import { applySyncData, readSyncData } from './db'

const CODE_KEY = 'freechess-sync-code'
const LAST_KEY = 'freechess-sync-last'

export const syncAvailable = () => SYNC_URL !== '' && SYNC_KEY !== ''

function stored(key: string): string | null {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

function store(key: string, value: string | null) {
  try {
    if (value === null) localStorage.removeItem(key)
    else localStorage.setItem(key, value)
  } catch {
    // (Private browsing: sync just won't remember the code.)
  }
}

export const syncCode = () => stored(CODE_KEY)
export const lastSynced = () => Number(stored(LAST_KEY)) || null

async function rpc(name: 'sync_get' | 'sync_put', body: object): Promise<unknown> {
  const res = await fetch(`${SYNC_URL}/rest/v1/rpc/${name}`, {
    method: 'POST',
    headers: { apikey: SYNC_KEY, Authorization: `Bearer ${SYNC_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(`Sync failed (${res.status})`)
  const text = await res.text()
  return text ? JSON.parse(text) : null
}

const fetchRemote = async (code: string) => (await rpc('sync_get', { p_code: code })) as SyncData | null
const upload = (code: string, data: SyncData) => rpc('sync_put', { p_code: code, p_data: data })

/** Fetches, combines, saves here and uploads. Resolves when done; throws if offline or the code is wrong. */
export async function syncNow(code = syncCode()): Promise<void> {
  if (!code || !syncAvailable()) return
  const remote = await fetchRemote(code)
  const local = await readSyncData()
  const merged = remote ? mergeSync(local, remote) : local
  await applySyncData(merged)
  await upload(code, await readSyncData())
  store(LAST_KEY, String(Date.now()))
}

/** Turns sync on with a new code, uploading this device's progress. */
export async function startSync(): Promise<string> {
  const code = newSyncCode()
  await upload(code, await readSyncData())
  store(CODE_KEY, code)
  store(LAST_KEY, String(Date.now()))
  return code
}

/** Links this device to a code from another: there must be progress saved under it. */
export async function joinSync(code: string): Promise<void> {
  const remote = await fetchRemote(code)
  if (!remote) throw new Error('No progress found for that code. Check it and try again.')
  store(CODE_KEY, code)
  await syncNow(code)
}

/** Stops syncing on this device (its progress stays here, and online for the others). */
export function stopSync(): void {
  store(CODE_KEY, null)
  store(LAST_KEY, null)
}
