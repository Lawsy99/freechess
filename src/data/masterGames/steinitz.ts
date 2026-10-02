// Steinitz v von Bardeleben, Hastings 1895. Moves as published (chessgames.com
// and Wikipedia agree), replayed by the rules. Notes our own, every claim
// checked against Stockfish 19 (depth 20+, three lines per position):
// scratch/report-steinitz.txt. Steinitz's demonstrated mate replayed to mate.
import type { MasterGame } from './types'

export const STEINITZ: MasterGame = {
  id: 'steinitz',
  title: 'The rook that couldn’t be taken',
  white: 'Wilhelm Steinitz',
  black: 'Curt von Bardeleben',
  players: 'Steinitz v von Bardeleben',
  place: 'Hastings',
  year: 1895,
  result: '1-0',
  theme: 'The pin, the king in the centre, the outpost',
  orientation: 'white',
  intro:
    'Steinitz was the first world champion and the father of positional chess. At the great Hastings tournament of 1895 he won the first brilliancy prize with this game. The finish is famous: a rook that checks again and again in front of the king, and can never be taken.',
  plans:
    'An old, quiet opening, the Giuoco Piano. White builds a big pawn centre and gets castled; Black misses a chance to win a pawn and is left with the king in the middle. After a run of trades, the story is about one pin: White’s rook on the e-file stops Black from castling. Watch how White keeps the king stuck, opens one more line with a pawn sacrifice, and plants a knight on a square no pawn can attack.',
  pgn: '1. e4 e5 2. Nf3 Nc6 3. Bc4 Bc5 4. c3 Nf6 5. d4 exd4 6. cxd4 Bb4+ 7. Nc3 d5 8. exd5 Nxd5 9. O-O Be6 10. Bg5 Be7 11. Bxd5 Bxd5 12. Nxd5 Qxd5 13. Bxe7 Nxe7 14. Re1 f6 15. Qe2 Qd7 16. Rac1 c6 17. d5 cxd5 18. Nd4 Kf7 19. Ne6 Rhc8 20. Qg4 g6 21. Ng5+ Ke8 22. Rxe7+ Kf8 23. Rf7+ Kg8 24. Rg7+ Kh8 25. Rxh7+',
  chapters: [
    {
      ply: 17,
      title: 'Castled against uncastled',
      text: 'White has castled; Black’s king is still on e8 and the centre is open. The engine rates White clearly better. White’s plan: bring the rooks to the open files in the centre before Black’s king gets away.',
    },
    {
      ply: 27,
      title: 'The pin on the e-file',
      text: 'Many pieces have gone, and White has an isolated pawn on d4. But Black’s king can’t castle without losing the knight on e7: it’s pinned by the rook on e1, and only the king defends it. White’s plan: keep the king stuck and open more lines. Black’s plan: walk the king to f7, “castling by hand”, and untangle.',
    },
    {
      ply: 33,
      arrows: ['f3d4', 'd4e6'],
      title: 'A pawn for a square',
      text: 'White gives a pawn to clear d4 for the knight. From there it can jump to e6, a hole in Black’s position: with Black’s d-pawn gone and the f-pawn on f6, no Black pawn can ever attack e6. A knight on a square like that is often worth more than a rook.',
    },
    {
      ply: 42,
      title: 'Checks first',
      text: 'Both sides are threatening. Black’s queen attacks White’s queen, and Black’s rook is lined up against White’s on c1. White can’t afford a quiet move: from here, every White move has to be a check.',
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
    'The knight develops and defends e5.',
    // 3. Bc4
    'The Italian Game: the bishop aims at f7, the weak point next to Black’s king. The engine slightly prefers 3.Bb5.',
    // 3... Bc5
    'The Giuoco Piano, Italian for “quiet game”. Black’s bishop mirrors White’s and aims at f2.',
    // 4. c3
    'White prepares d4, to build a big pawn centre. This was Steinitz’s way: take the centre with pawns first, attack later.',
    // 4... Nf6
    'Black develops with a counterattack on e4. The best move.',
    // 5. d4
    'The centre push. Quietly protecting e4 with 5.d3 was the engine’s slight preference.',
    // 5... exd4
    'Black takes, the best move.',
    // 6. cxd4
    'Now White has two big pawns side by side in the centre, on d4 and e4.',
    // 6... Bb4+
    'Black checks, to harass White’s centre with gain of time. The best move.',
    // 7. Nc3
    'White blocks with the knight and lets the e4 pawn go. 7.Bd2 was the safer choice, and level.',
    // 7... d5
    'A natural move, but it lets White off the hook. 7…Nxe4!, simply taking the pawn, was the engine’s choice and left Black a little better.',
    // 8. exd5
    'White takes, the engine’s choice.',
    // 8... Nxd5
    'Black takes back. 8…Qe7+, a check that can force White’s king to move and give up castling, was a little more testing.',
    // 9. O-O
    'White castles, getting the king safe and a rook ready for the centre. The engine’s choice.',
    // 9... Be6
    'Black develops and guards the knight on d5. 9…Bxc3, trading first, was better.',
    // 10. Bg5
    'White develops with a threat: the bishop attacks Black’s queen. 10.Re1, pinning along the e-file at once, was much stronger, the engine says.',
    // 10... Be7
    'Black blocks and offers to trade. 10…Qd7 was better.',
    // 11. Bxd5
    'White starts a chain of trades, the engine’s choice. Every trade brings closer the moment when Black’s uncastled king stands alone.',
    // 11... Bxd5
    'The best way to take back. 11…Qxd5 would lose the queen to 12.Nxd5.',
    // 12. Nxd5
    'White takes again. The engine’s choice.',
    // 12... Qxd5
    'The queen takes back. The best move.',
    // 13. Bxe7
    'The last trade of minor pieces, and the important one: it brings a Black knight to e7, right on the e-file.',
    // 13... Nxe7
    'Black takes back with the knight; 13…Kxe7 would put the king out in the open.',
    // 14. Re1
    'The rook pins the knight to Black’s king. Black can’t castle now without losing the knight, because the king is its only defender.',
    // 14... f6
    'Black makes room for the king to step to f7, castling “by hand”. The best move.',
    // 15. Qe2
    'The queen joins the pressure on the pinned knight. 15.Qa4+ was stronger, the engine says.',
    // 15... Qd7
    'Black guards the knight a second time. The best move.',
    // 16. Rac1
    'The last White piece comes in, taking the open c-file. 16.Rad1 was a touch better.',
    // 16... c6
    'The mistake. Black covers d5 and blocks the c-file, but loses the moment: 16…Kf7, getting the king off the e-file, was the move. Now White strikes first.',
    // 17. d5
    'A pawn sacrifice. The point: after 17…cxd5, the d4 square is free for White’s knight, on its way to e6. The engine’s choice.',
    // 17... cxd5
    'Black takes, and helps White’s plan. 17…Kf7 was more stubborn.',
    // 18. Nd4
    'The knight heads for e6 and f5, squares close to Black’s king. The engine’s choice.',
    // 18... Kf7
    'Black finally gets the king off the e-file, so the knight on e7 is no longer pinned. The best move.',
    // 19. Ne6
    'The knight lands on e6, the hole no Black pawn can attack. From there it hits c7, d8, f8 and g7.',
    // 19... Rhc8
    'Black challenges White’s rook on the open c-file. But the rook leaves the kingside, and the engine preferred 19…Qd6 or 19…Nc6.',
    // 20. Qg4
    'The queen joins the attack, threatening Qxg7+. The engine’s choice by a long way.',
    // 20... g6
    'Black blocks the queen’s path to g7. The best move.',
    // 21. Ng5+
    'The knight checks from g5. Notice that Black’s queen now attacks White’s queen, along the diagonal the knight has just left.',
    // 21... Ke8
    'The only good move. After 21…Kg7 or 21…Kg8 nothing would protect Black’s queen, and 22.Qxd7 would simply win it.',
    // 22. Rxe7+
    'One of the most famous moves ever played. The rook can’t be taken: 22…Qxe7 23.Rxc8+ Rxc8 24.Qxc8+ wins a rook, and 22…Kxe7 23.Re1+ Kd6 24.Qb4+ Rc5 25.Re6+ also wins for White.',
    // 22... Kf8
    'Black steps away and now threatens two things: …Qxg4, and …Rxc1+, a back-rank mate now that White’s other rook has left the first rank. So White must keep checking.',
    // 23. Rf7+
    'Another check, and again the rook can’t be taken: the knight guards f7, and 23…Qxf7 24.Rxc8+ Rxc8 25.Qxc8+ wins a rook.',
    // 23... Kg8
    'The only way to keep the queen: 23…Ke8 would allow 24.Qxd7 mate.',
    // 24. Rg7+
    'And again! The king can’t take it either: 24…Kxg7 25.Qxd7+ wins Black’s queen with check.',
    // 24... Kh8
    '24…Kf8 25.Nxh7+ is even worse, and 24…Qxg7 25.Rxc8+ loses the rook on c8.',
    // 25. Rxh7+
    'The rook takes the h-pawn, opening the h-file for White’s queen. Von Bardeleben left the hall without resigning and lost on time. Steinitz then showed the spectators the forced mate: 25…Kg8 26.Rg7+ Kh8 27.Qh4+ Kxg7 28.Qh7+ Kf8 29.Qh8+ Ke7 30.Qg7+ Ke8 31.Qg8+ Ke7 32.Qf7+ Kd8 33.Qf8+ Qe8 34.Nf7+ Kd7 35.Qd6#.',
  ],
  stops: [
    {
      ply: 32,
      prompt: 'Black has just played …c6, blocking the c-file. Black’s king is still pinned to the e-file. How do you open things up?',
      options: [
        {
          san: 'd5',
          best: true,
          text: 'A pawn sacrifice that clears d4 for your knight, on its way to e6. The engine’s choice by a long way.',
        },
        {
          san: 'Qc4',
          text: 'Active, but it gives Black time for …Kf8 and …Kf7, and White is only a little better.',
        },
        {
          san: 'Nd2',
          text: 'The knight heads for e4, but it’s slow: Black gets the king to f7 and White is only slightly better.',
        },
      ],
    },
    {
      ply: 38,
      prompt: 'Your knight is on e6. Black has just challenged your rook on the c-file. What now?',
      options: [
        {
          san: 'Qg4',
          best: true,
          text: 'The queen joins the attack and threatens Qxg7+. The engine rates White winning.',
        },
        {
          san: 'Nc5',
          text: 'It wins a pawn after 20…Qd6 21.Nxb7, but lets Black organise. White is better, not winning.',
        },
        {
          san: 'Rxc8',
          text: 'Trading rooks takes the sting out of the attack. After 20…Rxc8 the game is roughly level.',
        },
      ],
    },
    {
      ply: 42,
      prompt: 'Black’s queen attacks yours, and Black threatens …Rxc1. Every move you make must be forcing. What is it?',
      options: [
        {
          san: 'Rxe7+',
          best: true,
          text: 'The famous rook sacrifice. Black can’t take the rook without losing more, and White keeps checking.',
        },
        {
          san: 'Nxh7',
          text: 'Not forcing enough: 22…Rxc1 strikes first, and White is only a little better.',
        },
        {
          san: 'Rxc8+',
          text: 'It removes the threat, but after 22…Rxc8 the attack is over and the game is roughly level.',
        },
      ],
    },
  ],
  ending: 'Black lost on time, facing a forced mate.',
  lessons: [
    'Castle early. Black’s king never castled, and a single pin on the e-file decided the game.',
    'A pinned piece can’t defend anything. White piled up on the knight on e7 until Black ran out of moves.',
    'Look for outposts: squares no enemy pawn can attack. White gave a pawn to reach one, and the knight on e6 dominated.',
    'When both sides are threatening, checks come first. From move 22, every White move was a check, so Black’s threats never happened.',
  ],
}
