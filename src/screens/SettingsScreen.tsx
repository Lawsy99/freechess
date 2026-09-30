// Settings (design document, "Screens"): how much the characters talk, the
// board's colours, sound, and the backup (export everything to one file, or
// restore from one).
import { useRef, useState } from 'react'
import { BUILD_LABEL } from '../buildInfo'
import { BOARD_THEMES, type BoardThemeId } from '../components/boardTheme'
import { backupFileName, parseBackup, summarise } from '../logic/backup'
import { composeFeedback, describeDevice } from '../logic/feedback'
import { CHATTER_OPTIONS, type Settings } from '../logic/settings'
import { exportAll, importAll } from '../storage/db'
import './SettingsScreen.css'

type Props = {
  settings: Settings
  onChange: (s: Settings) => void
  onBack: () => void
  /** Where the player is ("Week 3, rating 1180"), for feedback. */
  whereTheyAre: string
}

export function SettingsScreen({ settings, onChange, onBack, whereTheyAre }: Props) {
  const [message, setMessage] = useState<string | null>(null)
  const fileInput = useRef<HTMLInputElement>(null)
  const [feedback, setFeedback] = useState('')
  const [feedbackNote, setFeedbackNote] = useState<string | null>(null)

  /** Sends the feedback through the phone's share sheet (or copies it, where there isn't one). */
  async function sendFeedback() {
    setFeedbackNote(null)
    const standalone =
      window.matchMedia?.('(display-mode: standalone)').matches || (navigator as { standalone?: boolean }).standalone === true
    const text = composeFeedback(feedback, {
      version: BUILD_LABEL,
      whereTheyAre,
      device: describeDevice(navigator.userAgent, standalone),
    })
    try {
      if (navigator.share) {
        await navigator.share({ text })
        setFeedback('')
        setFeedbackNote('Thank you.')
      } else {
        await navigator.clipboard.writeText(text)
        setFeedbackNote('Copied. Paste it into a message to whoever sent you the app.')
      }
    } catch (err) {
      if ((err as Error).name !== 'AbortError') setFeedbackNote('Couldn’t open the share options. Try again?')
    }
  }

  async function exportBackup() {
    setMessage(null)
    try {
      const backup = await exportAll()
      const name = backupFileName(backup.exportedAt)
      const file = new File([JSON.stringify(backup)], name, { type: 'application/json' })
      // On iPhone the share sheet is the natural way to keep a file ("Save to Files").
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: 'FreeChess backup' })
      } else {
        const url = URL.createObjectURL(file)
        const link = document.createElement('a')
        link.href = url
        link.download = name
        link.click()
        setTimeout(() => URL.revokeObjectURL(url), 10_000)
      }
      setMessage(`Backup made: ${backup.games.length} games.`)
    } catch (err) {
      // Closing the share sheet counts as an error; that's not worth a message.
      if ((err as Error).name !== 'AbortError') setMessage(`Couldn't make the backup: ${(err as Error).message}`)
    }
  }

  async function importBackup(file: File) {
    setMessage(null)
    try {
      const backup = parseBackup(await file.text())
      const s = summarise(backup)
      const who = s.name ? `${s.name}, ` : ''
      const rating = s.rating !== null ? `rating ${s.rating}, ` : ''
      const when = new Date(s.exportedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
      const ok = window.confirm(
        `Restore the backup from ${when}? (${who}${rating}${s.games} games)\n\nEverything on this phone will be replaced.`,
      )
      if (!ok) return
      await importAll(backup)
      window.location.reload()
    } catch (err) {
      setMessage((err as Error).message)
    }
  }

  return (
    <main className="settings-screen">
      <header className="settings-header">
        <button type="button" className="settings-back" onClick={onBack}>
          ‹ Back
        </button>
        <h1>Settings</h1>
      </header>

      <section>
        <h2>Chatter</h2>
        <p className="settings-note">How much the bots say.</p>
        <div className="settings-options" role="radiogroup" aria-label="Chatter">
          {CHATTER_OPTIONS.map((o) => (
            <button
              key={o.value}
              type="button"
              role="radio"
              aria-checked={settings.chatter === o.value}
              className={settings.chatter === o.value ? 'selected' : undefined}
              onClick={() => onChange({ ...settings, chatter: o.value })}
            >
              <strong>{o.label}</strong>
              <span>{o.detail}</span>
            </button>
          ))}
        </div>
      </section>

      <section>
        <h2>Board</h2>
        <div className="settings-options" role="radiogroup" aria-label="Board style">
          {(Object.keys(BOARD_THEMES) as BoardThemeId[]).map((id) => (
            <button
              key={id}
              type="button"
              role="radio"
              aria-checked={settings.board === id}
              className={`settings-board ${settings.board === id ? 'selected' : ''}`}
              onClick={() => onChange({ ...settings, board: id })}
            >
              <span className="board-swatch" aria-hidden="true">
                <i style={{ background: BOARD_THEMES[id].light }} />
                <i style={{ background: BOARD_THEMES[id].dark }} />
                <i style={{ background: BOARD_THEMES[id].dark }} />
                <i style={{ background: BOARD_THEMES[id].light }} />
              </span>
              <strong>{BOARD_THEMES[id].label}</strong>
            </button>
          ))}
        </div>
      </section>

      {/* On/off choices as switches in one card (Sep 2026), so Settings stays short. */}
      <section>
        <h2>Playing</h2>
        <ul className="settings-switches">
          <Switch
            label="Sound"
            detail="A soft click for each move."
            on={settings.sound}
            onChange={(on) => onChange({ ...settings, sound: on })}
          />
          <Switch
            label="Confirm moves"
            detail="Each move waits for a tick (play it) or a cross (put it back)."
            on={settings.confirmMoves ?? true}
            onChange={(on) => onChange({ ...settings, confirmMoves: on })}
          />
          <Switch
            label="Show legal moves"
            detail="Dots show where a piece can go."
            on={settings.showMoves ?? true}
            onChange={(on) => onChange({ ...settings, showMoves: on })}
          />
        </ul>
      </section>

      <section>
        <h2>Backup</h2>
        <p className="settings-note">
          Everything is saved on this phone only. Make a backup now and then, and keep the file somewhere safe (Save to
          Files works well). It also moves your progress to a new phone.
        </p>
        <button type="button" className="settings-action primary" onClick={() => void exportBackup()}>
          Make a backup
        </button>
        <button type="button" className="settings-action" onClick={() => fileInput.current?.click()}>
          Restore from a backup
        </button>
        <input
          ref={fileInput}
          type="file"
          accept="application/json,.json"
          hidden
          onChange={(e) => {
            const file = e.target.files?.[0]
            e.target.value = '' // so choosing the same file again still works
            if (file) void importBackup(file)
          }}
        />
        {message && (
          <p className="settings-message" role="status">
            {message}
          </p>
        )}
      </section>

      <section>
        <h2>Feedback</h2>
        <p className="settings-note">
          This is a test version, so thank you for trying it. Anything that confused you, annoyed you, broke, or that you
          liked: write it here and send it however you like. Your progress stays on this phone, and very occasionally a
          test version may ask you to start again.
        </p>
        <textarea
          className="settings-feedback"
          rows={4}
          placeholder="What happened, or what did you think?"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
        />
        <button
          type="button"
          className="settings-action primary"
          disabled={!feedback.trim()}
          onClick={() => void sendFeedback()}
        >
          Send feedback
        </button>
        {feedbackNote && (
          <p className="settings-message" role="status">
            {feedbackNote}
          </p>
        )}
      </section>

      <p className="build-stamp">Version: {BUILD_LABEL}</p>
    </main>
  )
}

/** One on/off row: the name and what it does, and a switch. */
function Switch({ label, detail, on, onChange }: { label: string; detail: string; on: boolean; onChange: (on: boolean) => void }) {
  return (
    <li>
      <button type="button" role="switch" aria-checked={on} className="settings-switch" onClick={() => onChange(!on)}>
        <span className="settings-switch-text">
          <strong>{label}</strong>
          <span>{detail}</span>
        </span>
        <span className={`switch-track ${on ? 'on' : ''}`} aria-hidden="true">
          <span className="switch-knob" />
        </span>
      </button>
    </li>
  )
}
