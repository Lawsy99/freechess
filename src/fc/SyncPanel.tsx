// Settings > Sync (FreeChess, Oct 2026): keep progress the same on every
// device. Turn it on here to get a code; type the code on your other devices.
import { useState } from 'react'
import { cleanCode, showCode } from '../logic/syncMerge'
import { joinSync, lastSynced, startSync, stopSync, syncAvailable, syncCode, syncNow } from '../storage/sync'

type Props = {
  /** Progress may have changed: reload it. */
  onSynced: () => void
}

function ago(ms: number | null): string {
  if (!ms) return 'not yet'
  const mins = Math.round((Date.now() - ms) / 60_000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins} minute${mins === 1 ? '' : 's'} ago`
  const hours = Math.round(mins / 60)
  return hours < 24 ? `${hours} hour${hours === 1 ? '' : 's'} ago` : new Date(ms).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

export function SyncPanel({ onSynced }: Props) {
  const [code, setCode] = useState(syncCode())
  const [busy, setBusy] = useState(false)
  const [note, setNote] = useState<string | null>(null)
  const [joining, setJoining] = useState(false)
  const [typed, setTyped] = useState('')
  const [, refresh] = useState(0)

  if (!syncAvailable()) {
    return (
      <section>
        <h2>Sync</h2>
        <p className="settings-note">Keeping your progress the same on all your devices is coming soon.</p>
      </section>
    )
  }

  async function run(work: () => Promise<void>, done: string) {
    setBusy(true)
    setNote(null)
    try {
      await work()
      setNote(done)
      onSynced()
    } catch (err) {
      setNote(navigator.onLine === false ? 'You’re offline. It’ll sync when you’re back online.' : (err as Error).message)
    } finally {
      setBusy(false)
      refresh((n) => n + 1)
    }
  }

  return (
    <section>
      <h2>Sync</h2>
      {code ? (
        <>
          <p className="settings-note">
            Sync is on. Your progress stays the same on every device with this code. Keep it private: it’s the key to your progress.
          </p>
          <div className="sync-code">
            <strong>{showCode(code)}</strong>
            <button
              type="button"
              className="settings-action"
              onClick={() => {
                navigator.clipboard?.writeText(showCode(code)).then(
                  () => setNote('Copied.'),
                  () => setNote('Couldn’t copy. Write it down instead.'),
                )
              }}
            >
              Copy code
            </button>
          </div>
          <p className="settings-note">
            On your other devices: Settings, Sync, “Link to another device”, then type this code. Last synced {ago(lastSynced())}.
          </p>
          <button type="button" className="settings-action primary" disabled={busy} onClick={() => void run(() => syncNow(), 'Synced.')}>
            {busy ? 'Syncing…' : 'Sync now'}
          </button>
          <button
            type="button"
            className="settings-action"
            onClick={() => {
              stopSync()
              setCode(null)
              setNote('Sync is off on this device. Your progress is still here.')
            }}
          >
            Stop syncing on this device
          </button>
        </>
      ) : (
        <>
          <p className="settings-note">Keep your progress the same on your phone, laptop and tablet. Nothing is lost: progress from each device is combined.</p>
          <button
            type="button"
            className="settings-action primary"
            disabled={busy}
            onClick={() =>
              void run(async () => {
                setCode(await startSync())
              }, 'Sync is on. Now enter the code on your other devices.')
            }
          >
            {busy && !joining ? 'Turning on…' : 'Turn on sync'}
          </button>
          {joining ? (
            <div className="sync-join">
              <input
                id="sync-code"
                type="text"
                placeholder="Code from your other device"
                value={typed}
                onChange={(e) => setTyped(e.target.value)}
                autoCapitalize="characters"
                autoCorrect="off"
                spellCheck={false}
              />
              <button
                type="button"
                className="settings-action primary"
                disabled={busy || cleanCode(typed).length < 24}
                onClick={() =>
                  void run(async () => {
                    await joinSync(cleanCode(typed))
                    setCode(cleanCode(typed))
                  }, 'Linked. Your progress is combined and in sync.')
                }
              >
                {busy ? 'Linking…' : 'Link'}
              </button>
            </div>
          ) : (
            <button type="button" className="settings-action" onClick={() => setJoining(true)}>
              Link to another device
            </button>
          )}
        </>
      )}
      {note && (
        <p className="settings-message" role="status">
          {note}
        </p>
      )}
    </section>
  )
}
