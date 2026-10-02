# FreeChess plan

## Phases

1. **Play (built, Sep 2026).** Bots in drop-down groups, bot pages, colour
   choice, stars, rating, results, the review with "Try it again", the board's
   weight (lift, shadow, sounds), Home with daily goals and streak, Profile.
2. **Coach (built, Sep 2026).** Games against the Coach at your rating: encouraging, very useful,
   feedback as you go and after (what to look out for). Not rated. Ticks the
   "Play the Coach" goal.
3. **Puzzles (built, Sep 2026).** Unlimited, rated to your level, their own puzzle rating
   (Lichess puzzle set, as in Club Night). Maybe a daily puzzle and a timed
   rush mode.
4. **Learn (built, Sep 2026).** A Duolingo-style path of units: a short explanation, puzzles,
   then positions to play out; pass to unlock the next. Ticks the lesson goal.
5. **From chess.com (built, 30 Sep 2026).** Review upgrade (graph, "you played like",
   phases, brilliant/great/book), analysis board (set up or paste any position,
   draw arrows), clocks, Insights, Achievements, the vision trainer, the custom
   bot, legal-move dots setting. Extras live in quiet menu cards (Play > More,
   Profile) so the main screens stay uncluttered.
6. **Deeper (built, 30 Sep to 1 Oct 2026).** Coach explanations on every move in the
   step-through and a Coach's tip per game (logic/stepExplain.ts); "you played like"
   from the opponent's rating; Your mistakes (spaced repetition) in Puzzles; reviews
   analysed as soon as a game ends (engine/reviewJobs.ts) with a glimpse on the
   result screen; Learn grown to 49 lessons (rules walkthrough, three more units,
   four more openings, six classic endgames); 13 more bots (48) and about 800 new
   lines; opening books matching bios; faces that follow the game; the week strip
   and streak freezes; four daily goals (lesson first, then 3 puzzles, a bot, the
   Coach); more boards and badges; the opening named in reviews; Share this game
   (PGN); Play from here on the analysis board.
7. **Chess legends (built, Oct 2026).** Philidor, Anderssen, Morphy, Lasker,
   Capablanca, Menchik, Alekhine (data/legends.ts): eight levels each, 200 to 2400;
   a win moves them up one. Their own openings and lines. Only long-dead players:
   living ones (Magnus Carlsen and the like) own their name and likeness.
8. **Training around you (built, Oct 2026).** Your training focus (logic/focus.ts):
   the mistake you make most lately picks today's lesson, a "For you" puzzle set,
   and what the Coach points out. Your openings (logic/myOpenings.ts): drills of
   the lines you play, slips put right.
9. **Master Games (built, Oct 2026).** Six classic games on Learn
   (data/masterGames): the Opera Game, Réti v Tartakower, Lasker v Thomas, the
   Evergreen, the Immortal and Sämisch v Nimzowitsch. The big picture before move
   1, "The plan now" at each turning point, a note on every move, "Your move"
   stops, and lessons at the end. Moves checked against published scores; every
   note checked against Stockfish 19 (scratch/analyseGames.mjs, report.mjs,
   allMoves.mjs), with honest modern footnotes where the engine disagrees with
   the legend. Our own notes: Joseph's copy of Chernev's book (copyright) is
   not used. More games can follow the same way.
10. **A more strategic Coach (built, Oct 2026).** In coached games the Coach
   says the big picture at turning points (opening over, queens off, the ending:
   logic/plans.ts). Every review opens with the story of the game: the opening,
   the plan from there, the turning point and how it ended (logic/gameStory.ts).
11. **Next.** A real-iPhone check by Joseph; piece sets (needs a download, asked);
   later, the App Store version (Capacitor). Bundle is about 300 KB gzipped: the
   dialogue file could be trimmed if load time becomes a problem.

## Backlog

- Done (30 Sep 2026): illustrated faces (Micah Lanier, CC BY 4.0, via DiceBear;
  data/faces.ts), level colours and badges, bot pages with banners, a new result
  screen with confetti, Learn pieces and the Coach on the path, a Coach greeting on
  Home, and a redrawn knight icon.
- More fun, interesting dialogue for every bot (they no longer react to your
  good or bad moves): stories about themselves, reactions to the game's big
  moments (queens off, a sacrifice, an endgame).
- Done (30 Sep 2026): Club Night's club taken out of the bots' lines and bios,
  settings, backups, feedback and game labels.

### From a look at chess.com (30 Sep 2026): all built except pass and play (Joseph
### said no) and piece sets (need a download; asked)

1. Review upgrade: an evaluation graph of the whole game, "you played like about
   1200", accuracy for opening, middlegame and endgame, and Brilliant / Great / Book
   labels on moves.
2. Analysis board: set up or paste any position and explore it with the engine;
   open it from any move in a review.
3. Clocks: optional timed games against bots (for example 10 minutes, 5 minutes).
4. Insights in Profile: accuracy over time, how your openings score, results with
   White and Black, which phase of the game costs you most.
5. Achievements: badges for first win, beating each group, streaks, puzzle scores.
6. Vision trainer: name the square in 30 seconds (quick, great for beginners).
7. Pass and play: two people on one phone.
8. Board options: draw arrows and circles, legal-move dots on or off, piece sets.
9. A custom bot: pick any strength and style yourself.
