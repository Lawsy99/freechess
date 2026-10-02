// The Evergreen Game, Berlin 1852. Moves as published (Wikipedia, "Evergreen
// Game"), replayed by the rules. Notes our own, every claim checked against
// Stockfish 19 (depth 20+, three lines per position): scratch/report-evergreen.txt.
import type { MasterGame } from './types'

export const EVERGREEN: MasterGame = {
  id: 'evergreen',
  title: 'The Evergreen Game',
  white: 'Adolf Anderssen',
  black: 'Jean Dufresne',
  place: 'Berlin',
  year: 1852,
  result: '1-0',
  theme: 'King safety: castle, or pay for it',
  orientation: 'white',
  legend: 'anderssen',
  intro:
    'A casual game played in Berlin in 1852. Steinitz, the first world champion, later called it “the evergreen in Anderssen’s laurel wreath”, and the name stuck. It ends with one of the most beautiful combinations ever played, and it is a lesson in why castling matters.',
  plans:
    'White plays the Evans Gambit: a pawn offered on move 4 to gain time and build a big centre. But the real story is king safety. White castles on move 7. Black, busy keeping the extra pawns and chasing White’s queen, never castles. When the position opens, it becomes a race: Black attacks White’s king down the g-file, White attacks Black’s king in the centre. The side whose king is safer wins the race.',
  pgn: '1. e4 e5 2. Nf3 Nc6 3. Bc4 Bc5 4. b4 Bxb4 5. c3 Ba5 6. d4 exd4 7. O-O d3 8. Qb3 Qf6 9. e5 Qg6 10. Re1 Nge7 11. Ba3 b5 12. Qxb5 Rb8 13. Qa4 Bb6 14. Nbd2 Bb7 15. Ne4 Qf5 16. Bxd3 Qh5 17. Nf6+ gxf6 18. exf6 Rg8 19. Rad1 Qxf3 20. Rxe7+ Nxe7 21. Qxd7+ Kxd7 22. Bf5+ Ke8 23. Bd7+ Kf8 24. Bxe7#',
  chapters: [
    {
      ply: 13,
      title: 'Pawns against time',
      text: 'Black is two pawns up. In return White has castled, has more pieces ready to come out, and has open lines for them. White’s plan: use those lines, the diagonal towards f7 and soon the e-file, before Black gets castled. Black’s plan should be simple: develop and castle, even if it costs a pawn back.',
    },
    {
      ply: 28,
      title: 'The king in the centre',
      text: 'Black could have castled on move 14 and chose to develop the bishop instead. Now the king stays on e8 for the rest of the game. White’s plan: open the e-file and the d-file towards it, and bring the knight to e4, heading for the squares next to Black’s king.',
    },
    {
      ply: 36,
      title: 'The race',
      text: 'Both kings are under fire. Black’s rook has the open g-file, the queen is close, and g2 is a target: if Black ever gets time for …Qxf3, mate on g2 is coming. Black’s king is stuck on e8, and the knight on e7 is pinned by White’s rook. White’s plan: bring in the last rook and strike first, with checks, so Black never gets that time.',
    },
  ],
  notes: [
    // 1. e4
    'The king’s pawn opens lines for the queen and bishop and claims the centre.',
    // 1... e5
    'Black answers in kind.',
    // 2. Nf3
    'A knight out towards the centre, attacking the pawn on e5.',
    // 2... Nc6
    'The most natural defence: the knight develops and protects e5.',
    // 3. Bc4
    'The Italian Game. The bishop aims at f7, the weak point next to Black’s king.',
    // 3... Bc5
    'Black mirrors it: the bishop aims at f2.',
    // 4. b4
    'The Evans Gambit. White offers a pawn to gain time: when the bishop takes it, c3 will hit the bishop and prepare d4, building a big centre. The engine rates it as perfectly playable.',
    // 4... Bxb4
    'Black takes, the engine’s choice too.',
    // 5. c3
    'The point of the gambit: the bishop is attacked, and d4 is coming.',
    // 5... Ba5
    'The best square. The bishop keeps an eye on c3: that pawn will be pinned to White’s king once the d-pawn moves.',
    // 6. d4
    'White builds the centre. Development and space are the payment for the pawn.',
    // 6... exd4
    'Black takes a second pawn. White can’t take back with the c-pawn, because it’s pinned by the bishop on a5. 6…d6, holding the centre, was a touch more solid.',
    // 7. O-O
    'White castles, and that also unpins the c3 pawn, so cxd4 is now possible. White’s king is safe; Black’s will never be.',
    // 7... d3
    'Black pushes the pawn on rather than let it be taken. It keeps the extra material for now, but costs another move that isn’t development. 7…Nf6 was better.',
    // 8. Qb3
    'The queen lines up behind the bishop on c4, so the f7 pawn is attacked twice. The engine’s choice.',
    // 8... Qf6
    'Black protects f7 with the queen, the best defence.',
    // 9. e5
    'White gains time by attacking the queen, and takes the f6 square away from her for good.',
    // 9... Qg6
    'The queen moves again. The best square she has.',
    // 10. Re1
    'The rook backs up the pawn on e5. The engine prefers 10.Rd1, aiming at the pawn on d3, but the plan is the same: rooks to the open files.',
    // 10... Nge7
    'Black develops and gets ready to castle. The best move.',
    // 11. Ba3
    'The bishop aims at the knight on e7, and behind it at f8, the square Black’s king passes through to castle. The engine slightly prefers 11.Qd1, and gives Black the better position after this.',
    // 11... b5
    'Black gives a pawn back to drag White’s queen away. It’s a mistake: 11…d5!, opening lines for Black’s pieces, was strong.',
    // 12. Qxb5
    'White takes. 12.Bxb5 was a little better.',
    // 12... Rb8
    'The rook attacks the queen and takes the open b-file. The best move.',
    // 13. Qa4
    'The queen steps away with a double purpose: she attacks the bishop on a5 and pins the knight on c6 to Black’s king.',
    // 13... Bb6
    'The bishop escapes. 13…Bb7, developing with pressure on the long diagonal, was slightly better.',
    // 14. Nbd2
    'The last knight develops, heading for e4. The engine prefers 14.Qd1 first.',
    // 14... Bb7
    'The turning point. Black develops the bishop instead of castling. The engine’s choice by far was 14…O-O: the king gets safe and White’s attack has no target. From now on, Black’s king is stuck in the centre.',
    // 15. Ne4
    'The knight heads for d6 and f6, squares next to Black’s king. The engine’s choice.',
    // 15... Qf5
    'A serious mistake. The queen attacks the knight, but now if White’s bishop reaches d3, any knight jump with check will uncover an attack on the queen. 15…d2, giving the pawn back on Black’s terms, was much better.',
    // 16. Bxd3
    'White takes the pawn and sets up the trap: Nf6+ or Nd6+ would now win Black’s queen. The engine’s choice.',
    // 16... Qh5
    'The queen steps off the bishop’s diagonal. 16…Qe6 was a little more stubborn.',
    // 17. Nf6+
    'The famous sacrifice: the knight gives itself up to rip open Black’s king. A modern footnote: the engine says this throws away most of the advantage, because it also opens the g-file for Black’s rook. The quiet 17.Rad1, bringing the last rook in, kept White close to winning.',
    // 17... gxf6
    'Black takes. Moving the king instead would lose the queen to Nxh5.',
    // 18. exf6
    'Now the e-file is open and the knight on e7 is pinned to Black’s king by the rook on e1. The bishop on a3 attacks it too.',
    // 18... Rg8
    'Black hits back. The rook takes the open g-file and aims at g2, next to White’s king. The engine’s choice.',
    // 19. Rad1
    'The famous quiet move: the last rook comes in to take the d-file, setting up the finish. The engine’s verdict is more sober: 19.Be4 was a little better, and Black could now have held with 19…Bd4!.',
    // 19... Qxf3
    'Black takes the knight and threatens mate with …Qxg2. But White moves first, and every White move from here is a check. 19…Bd4 was the way to hold.',
    // 20. Rxe7+
    'The rook takes the pinned knight with check, and Black must answer.',
    // 20... Nxe7
    'Taking with the knight allows a forced mate. 20…Kd8 was the only way to fight on, though White would still be winning.',
    // 21. Qxd7+
    'The queen sacrifice: the d-file opens, and Black’s king is pulled forward into a double check.',
    // 21... Kxd7
    'Taking is the only move that doesn’t allow mate at once: 21…Kf8 would run into 22.Qxe7 mate.',
    // 22. Bf5+
    'Double check: the bishop checks from f5 and the rook checks from d1. Against a double check, the king has to move.',
    // 22... Ke8
    'The alternative, 22…Kc6, runs into 23.Bd7 mate.',
    // 23. Bd7+
    'The bishop checks again, driving the king to f8 or d8. Either way, the next move is mate.',
    // 23... Kf8
    'Going to d8 instead allows the same mate.',
    // 24. Bxe7#
    'Checkmate. The bishop from a3 finally reaches e7, protected by the pawn on f6, which also covers g7. Black’s king never castled, and it never got out of the centre.',
  ],
  stops: [
    {
      ply: 24,
      prompt: 'Your queen on b5 is attacked by the rook on b8. Where should she go?',
      options: [
        {
          san: 'Qa4',
          best: true,
          text: 'She attacks the bishop on a5 and pins the knight on c6 to Black’s king, all in one move. The engine’s choice.',
        },
        {
          san: 'Nh4',
          text: 'A big mistake: the queen is still attacked, and 13…Rxb5 wins her.',
        },
        {
          san: 'Qxb8',
          text: 'Giving the queen for a rook. After 13…Nxb8 Black is clearly winning.',
        },
      ],
    },
    {
      ply: 32,
      prompt: 'Black’s king is still in the centre. Would you sacrifice, or keep building?',
      options: [
        {
          san: 'Nf6+',
          best: true,
          text: 'The famous sacrifice, and it worked in the game. But the engine says it lets Black off the hook: opening the g-file gives Black’s rook counterplay against your king.',
        },
        {
          san: 'Rad1',
          text: 'The engine’s top choice: bring in the last rook first. Black’s king can’t escape, and White stays close to winning without giving anything away.',
        },
        {
          san: 'Ng3',
          text: 'Also strong: the knight attacks the queen and White keeps a big advantage. Calmer than the game, and better by the engine’s count.',
        },
      ],
    },
    {
      ply: 38,
      prompt: 'Black has just taken your knight and threatens …Qxg2 mate. What now?',
      options: [
        {
          san: 'Rxe7+',
          best: true,
          text: 'A check, so Black has no time for …Qxg2. The rook takes the pinned knight and the attack rolls on with checks.',
        },
        {
          san: 'Be4',
          text: 'It blocks the queen’s path to g2, but after 20…Qxf6 Black has taken a lot of material and is winning.',
        },
        {
          san: 'Qe4',
          text: 'It offers a queen trade, but 20…Qxf2+ breaks through to your king and Black wins.',
        },
      ],
    },
    {
      ply: 40,
      prompt: 'There’s a forced mate in four. Get it wrong, though, and Black mates you instead. What’s the first move?',
      options: [
        {
          san: 'Qxd7+',
          best: true,
          text: 'The queen sacrifice. After 21…Kxd7 22.Bf5+ is a double check, and mate follows.',
        },
        {
          san: 'Be4',
          text: 'Too slow: 21…Rxg2+ and Black mates you in three.',
        },
        {
          san: 'Qe4',
          text: 'Too slow: 21…Qxf2+ and Black mates you in three.',
        },
      ],
    },
  ],
  ending: 'Black is checkmated.',
  lessons: [
    'Castle. Black had a good chance on move 14 and chose to develop instead; by the time the king needed safety, it was too late.',
    'A pawn grabbed in the opening often costs more time than it’s worth. Black’s extra pawns did nothing; White’s extra moves did everything.',
    'When both sides are attacking, checks come first. From move 20 every White move was a check, so Black’s mate on g2 never happened.',
    'A modern footnote: the engine shows the famous sacrifice 17.Nf6+ let Black back into the game. Quiet moves that bring the last piece in are often stronger than a sacrifice.',
  ],
}
