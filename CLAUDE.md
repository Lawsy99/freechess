# FreeChess — project instructions for Claude Code

## What this is
A free chess app with the polish and playability of the big chess sites and the
free ethos of Lichess: every bot, puzzle, lesson and coached game is free. No
story. Built from Club Night's foundations (engine, board, characters, review,
puzzles), web app first for iPhone, later wrapped with Capacitor.
Live at https://lawsy99.github.io/freechess/ (repo Lawsy99/freechess). The local
folder is still called `open-file` (the app's first working name).

## Source of truth
- `docs/freechess-plan.md`: the phases, what's built, and the backlog.
- Club Night's design document (`docs/design-document.md`) still explains the
  shared systems (engines, ratings, the review, puzzles). FreeChess has no story,
  path, weeks or club ladder.

## About the person you're working with
- Joseph is not a developer. He is vibecoding this with you.
- Explain plainly; spell out technical terms. No em dashes anywhere (docs, app, chat).
- Before any large change (new library, restructuring, deleting files), say what
  you plan to do and wait for a go-ahead.
- After each working step, tell him exactly how to see or test it on his iPhone.

## Decisions so far (Sep 2026)
- Name FreeChess; its own look (dark slate, FreeChess blue, gold stars, Nunito),
  inspired by the big sites but never copying their name, logo, pieces or sounds.
- Bots: data/bots.ts, grouped Beginner / Intermediate / Advanced / Master, far more
  beginner and intermediate. Club Night cast keep their own definitions
  (data/characters.ts); new bots from around the world. Faces: data/appearances.ts.
- Bots do not react to the player's good or bad moves. Dialogue should be fun and
  interesting (greetings, key moments, wins and losses, personality).
- Stars per bot: 3 for a win with no takebacks or hints, one fewer for each,
  none for draws or losses (logic/profile.ts).
- Rating: Glicko-2 from all bot games (new players start 800, less unsure than
  standard, and one game moves it at most 80). No question at the start.
- Coach: one coach, just called "Coach" (not Pemberton), encouraging and very
  useful. Coach games pitched at your rating, not rated. Puzzles: own rating.
- Daily goals (Duolingo style): a bot game, a coached game, a lesson; a streak for
  each day with at least one done.
- Review after every game: summary, then the step-through with "Try it again" on your
  moves. No "biggest moments" to play through (Try it again replaced them).
- Bots never resign: every game is played to the end (logic/opponentDecisions.ts).
- Learn (data/learnPath.ts): 6 units, 25 lessons; each is mostly doing (puzzles by theme,
  play-outs against the engine, opening drills) after a two- or three-sentence idea. A
  puzzle round passes with enough solved first time; otherwise a fresh set.
- Match screen: the board full width; nothing over it; nothing moves; no scrolling. The
  message panel below the board is a card with what's said and the scoresheet.
- Moves in words below 1500, notation from there (logic/notation.ts).
- Storage names are FreeChess's own ("freechess"), so it never clashes with Club
  Night on the same github.io address.

## Rules for the code
- Target iPhone Safari first. Test layouts at 390 × 844. Touch targets at least 44 px.
- Engines never run on the main thread; the board must never freeze.
- Save after every move so a closed app resumes exactly where it was.
- Keep logic separate from UI (src/logic, pure and tested); content in data files.
- FreeChess's own screens live in src/fc. Small, clearly named files, short comments on the why.
- Commit after each working step with a clear message.
