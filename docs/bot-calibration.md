# Bot calibration (Oct 2026)

Why: Joseph found the low bots "brilliant, then they hang the queen", and some
800s far stronger than their number. Checking showed two problems:

1. Below 800 the bots were Stockfish plus a random-move rule: about 90% of
   moves engine-quality, and 1 in 12 a completely random move. Results swung on
   when the random moves fell. Measured, the old "700" bot played like about
   1310, the "400" like about 950.
2. From 800 up the bots were Maia, picking moves by chance in proportion to how
   often real players at that rating play them. But Maia's rating setting
   doesn't match the strength it plays at that way: the scale is squashed at
   both ends (set to 800 it plays like about 1220; set to 2400, like about 1740).

Now every bot plays through Maia at the setting measured to match its rating,
loosened for the weakest and sharpened (then checked by Stockfish) for the
strongest. A bot's rating is a measured strength.

## Method

- `scratch/calibrate.mjs A B games`: plays two players against each other,
  alternating colours, to the end (or 200 plies, then judged by Stockfish).
  Players:
  - `maia:R`: Maia-3 at setting R, sampled as the app does;
  - `maiat:R:T:K`: Maia at R, temperature T, choosing among its K likeliest moves;
  - `maiar:R:T:K`: the same, with rarer moves allowed;
  - `maiasf:R:D:N[:C]`: Stockfish at depth D picks the soundest of Maia's N
    likeliest moves (each at least 5% likely), on a share C of moves;
  - `bot:R`: the old Stockfish bot;
  - `sf:S:D:ms`: Stockfish at Skill Level S, depth D, time ms.
- `scratch/runCal.sh list N`: runs a list of matches, N at a time.
- `scratch/fitElo.mjs`: one Elo scale fitted to every game (Bradley-Terry, MM
  iteration, one virtual draw each against a 1500 player), pinned so that Maia
  at 1500 is 1500: the middle of Lichess's range, where Maia was trained on the
  most games. Results in `scratch/fit.json`.

About 2,500 games in all; 30 to 40 per match, so each number is good to
roughly 50 to 100 points.

## Results (scale pinned at Maia 1500 = 1500)

| Player | Strength |
|---|---|
| Completely random moves (`maiar:200:1000:400`) | 235 |
| Maia 200, very loose, rarer moves allowed (`maiar:200:30:200`) | 224 |
| Maia 200 loosened (`maiat:200:12:60`) | 426 |
| Maia 200 loosened (`maiat:200:6:40`) | 494 |
| Maia 200 loosened (`maiat:200:3:30`) | 623 |
| Maia set to 200 | 713 |
| Maia set to 400 | 852 |
| Maia set to 600 | 1052 |
| Maia set to 800 | 1220 |
| Maia set to 1000 | 1321 |
| Maia set to 1200 | 1422 |
| Maia set to 1500 | 1500 |
| Maia set to 1800 | 1535 |
| Maia set to 2100 | 1712 |
| Maia set to 2400 | 1742 |
| Maia 2400 sharpened (temperature 0.1) | 1976 |
| Maia 2400 plus Stockfish check (depth 8, 4 moves) on half the moves | 2215 |
| Maia 2400 plus Stockfish check (depth 8, 4 moves) | 2393 |
| Maia 2400 plus Stockfish check (depth 12, 6 moves) | 2539 |
| Old bot "200" / "400" / "700" | 668 / 950 / 1315 |

Stockfish at low Skill Levels beat Maia far more often than its other results
suggest (Skill 6, depth 2: 98% against Maia 1200). Engine-style and human-style
players don't sit on one scale (an engine punishes human mistakes ruthlessly;
people learn to exploit an engine's odd blunders), so Stockfish levels aren't
used to rate bots, and the Stockfish numbers in `scratch/fit.json` should be
read with care.

Random moves measure about 235, the same as the weakest setting: that is the floor.
Bo (100), Grace (150) and Finn (200) all play at it.

## How the app uses it

- `logic/botStrength.ts`: the measured ladder; `botPlan(rating)` blends the two
  neighbouring rungs. `standInRating` sets the old bot lower while it stands in
  for Maia.
- `logic/humanBot.ts`: picks the move from Maia's likelihoods; the check
  (engine/opponent.ts) runs Stockfish on Maia's few likeliest moves.
- Maia (a one-off 44 MB) now starts downloading five seconds after the app opens.
