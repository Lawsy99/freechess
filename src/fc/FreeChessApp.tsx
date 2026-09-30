// FreeChess: the whole app. The main screens sit under a bottom tab bar;
// a bot game, its result and its review take the full screen. Everything is
// saved on the phone after every change, so a closed app resumes exactly.
import { useEffect, useState } from 'react'
import { BoardThemeContext } from '../components/boardTheme'
import { setSoundEnabled } from '../components/moveSound'
import { BOT_GROUPS, findBot, type Bot } from '../data/bots'
import { characterOpponentId } from '../data/opponents'
import { newGameRecord, outcomeOf, upgradeGameRecord, type GameRecord } from '../logic/gameRecord'
import type { PathGame } from '../logic/path'
import { NEW_PROFILE, recordBotGame, type Profile } from '../logic/profile'
import { setNotationStyle, styleForRating } from '../logic/notation'
import { DEFAULT_SETTINGS, type Settings } from '../logic/settings'
import { GameScreen } from '../screens/GameScreen'
import { PastGamesScreen } from '../screens/PastGamesScreen'
import { ReviewScreen } from '../screens/ReviewScreen'
import { SettingsScreen } from '../screens/SettingsScreen'
import {
  archiveGame,
  loadCurrentGame,
  loadProfile,
  loadSettings,
  saveCurrentGame,
  saveProfile,
  saveSettings,
  type ArchivedGame,
} from '../storage/db'
import { BotSheet, type ColourChoice } from './BotSheet'
import { HomeTab } from './HomeTab'
import { PlayTab } from './PlayTab'
import { ProfileTab } from './ProfileTab'
import { ResultScreen, type LastResult } from './ResultScreen'
import { SoonTab, TabBar, type Tab } from './TabBar'
import './fc.css'

type View = 'tabs' | 'bot' | 'game' | 'result' | 'review' | 'past' | 'past-review' | 'settings'

const CHARACTER_PREFIX = 'char:'

/** The bot a game is against (bot games are saved with "char:<id>"). */
function botOf(game: GameRecord): Bot | undefined {
  return game.levelId.startsWith(CHARACTER_PREFIX) ? findBot(game.levelId.slice(CHARACTER_PREFIX.length)) : undefined
}

export function FreeChessApp() {
  const [loaded, setLoaded] = useState(false)
  const [profile, setProfile] = useState<Profile>(NEW_PROFILE)
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS)
  const [game, setGame] = useState<GameRecord | null>(null)
  const [view, setView] = useState<View>('tabs')
  const [tab, setTab] = useState<Tab>('home')
  const [bot, setBot] = useState<Bot | null>(null)
  const [last, setLast] = useState<LastResult | null>(null)
  const [pastGame, setPastGame] = useState<ArchivedGame | null>(null)

  useEffect(() => {
    Promise.all([loadProfile(), loadSettings(), loadCurrentGame()])
      .then(([p, s, g]) => {
        if (p) setProfile({ ...NEW_PROFILE, ...p })
        setSettings(s)
        if (g) setGame(upgradeGameRecord(g))
      })
      .catch(() => undefined)
      .finally(() => setLoaded(true))
  }, [])

  useEffect(() => {
    setSoundEnabled(settings.sound)
  }, [settings.sound])

  // Save the game after every move; finished games also go into the archive.
  useEffect(() => {
    if (!game) return
    saveCurrentGame(game).catch((err) => console.error('Save failed', err))
    if (outcomeOf(game)) archiveGame(game).catch((err) => console.error('Archive failed', err))
  }, [game])

  // Every screen starts at the top.
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [view, tab])

  // Moves in words below 1500, notation from there (as in Club Night).
  setNotationStyle(styleForRating(profile.rating?.rating ?? 800))

  if (!loaded) return <main className="fc-loading">Setting up the board…</main>

  const updateProfile = (next: Profile) => {
    setProfile(next)
    saveProfile(next).catch((err) => console.error('Save failed', err))
  }
  const updateSettings = (next: Settings) => {
    setSettings(next)
    saveSettings(next).catch((err) => console.error('Save failed', err))
  }

  const startBotGame = (b: Bot, choice: ColourChoice) => {
    const colour = choice === 'random' ? (Math.random() < 0.5 ? 'w' : 'b') : choice
    const group = BOT_GROUPS.find((g) => g.id === b.group)
    const path: PathGame = {
      kind: 'friendly',
      opponent: b.id,
      rating: b.rating,
      stage: 'bot',
      label: `${b.name} ${b.flag}`,
      location: `${group?.label ?? ''} · ${b.rating}`,
    }
    setGame({ ...newGameRecord(colour, characterOpponentId(b.id), 'bot', b.rating), path })
    setBot(b)
    setView('game')
  }

  // The game is over: record it once (rating, stars, goals), then the result.
  const finishGame = (g: GameRecord) => {
    const outcome = outcomeOf(g)
    const b = botOf(g)
    if (!outcome || !b) {
      setView('tabs')
      return
    }
    if (!g.resultRecorded) {
      const result = outcome.winner === null ? 'draw' : outcome.winner === g.playerColour ? 'win' : 'loss'
      const aidsUsed = g.takebacksUsed + (g.hintsUsed ?? 0)
      const bestBefore = profile.stars[b.id] ?? 0
      const recorded = recordBotGame(profile, b, result, aidsUsed, new Date())
      updateProfile(recorded.profile)
      setGame({ ...g, resultRecorded: true })
      setLast({ bot: b, result, stars: recorded.stars, aidsUsed, ratingChange: recorded.ratingChange, newBest: recorded.stars > bestBefore })
    }
    setView('result')
  }

  if (game && view === 'game') {
    return (
      <BoardThemeContext.Provider value={settings.board}>
        <GameScreen
          key={game.id}
          game={game}
          setGame={setGame}
          playerRating={profile.rating ? Math.round(profile.rating.rating) : undefined}
          playerName="You"
          chatter={settings.chatter}
          confirmMoves={settings.confirmMoves ?? true}
          onReview={() => finishGame(game)}
          onContinue={() => finishGame(game)}
          onPause={() => {
            setView('tabs')
            setTab('home')
          }}
        />
      </BoardThemeContext.Provider>
    )
  }

  if (view === 'result' && last) {
    return (
      <ResultScreen
        {...last}
        onReview={() => setView('review')}
        onRematch={() => startBotGame(last.bot, game?.playerColour === 'w' ? 'b' : 'w')}
        onDone={() => {
          setView('tabs')
          setTab('play')
        }}
      />
    )
  }

  if (view === 'review' && game) {
    return (
      <BoardThemeContext.Provider value={settings.board}>
        <ReviewScreen
          key={game.id}
          game={game}
          onContinue={() => {
            setView('tabs')
            setTab('play')
          }}
        />
      </BoardThemeContext.Provider>
    )
  }

  if (view === 'past-review' && pastGame) {
    return (
      <BoardThemeContext.Provider value={settings.board}>
        <ReviewScreen key={pastGame.id} game={upgradeGameRecord(pastGame)} fromHistory onContinue={() => setView('past')} />
      </BoardThemeContext.Provider>
    )
  }

  if (view === 'past') {
    return (
      <PastGamesScreen
        onOpen={(g) => {
          setPastGame(g)
          setView('past-review')
        }}
        onBack={() => setView('tabs')}
      />
    )
  }

  if (view === 'settings') {
    return (
      <BoardThemeContext.Provider value={settings.board}>
        <SettingsScreen
          settings={settings}
          onChange={updateSettings}
          onBack={() => setView('tabs')}
          whereTheyAre={`FreeChess, rating ${profile.rating ? Math.round(profile.rating.rating) : 'none'}`}
        />
      </BoardThemeContext.Provider>
    )
  }

  if (view === 'bot' && bot) {
    return <BotSheet bot={bot} profile={profile} onBack={() => setView('tabs')} onPlay={(c) => startBotGame(bot, c)} />
  }

  // A game left with Pause: Home offers a way back to it.
  const paused = game && !outcomeOf(game) ? (botOf(game) ?? null) : null
  const pick = (b: Bot) => {
    // (A paused game comes first: carry on with it rather than starting another.)
    if (paused) {
      setView('game')
      return
    }
    setBot(b)
    setView('bot')
  }

  return (
    <div className="fc-shell">
      {tab === 'home' && <HomeTab profile={profile} paused={paused} onResume={() => setView('game')} onPickBot={pick} onOpenPlay={() => setTab('play')} />}
      {tab === 'play' && <PlayTab profile={profile} onPick={pick} />}
      {tab === 'puzzles' && <SoonTab title="Puzzles" text="Unlimited puzzles, rated to your level, with their own puzzle rating. Next on the list." />}
      {tab === 'learn' && <SoonTab title="Learn" text="A step-by-step path: short lessons, puzzles and positions to play out. Complete each to unlock the next." />}
      {tab === 'profile' && <ProfileTab profile={profile} onPastGames={() => setView('past')} onSettings={() => setView('settings')} />}
      <TabBar tab={tab} onChange={setTab} />
    </div>
  )
}
