// Botvinnik v Capablanca, AVRO 1938 (Rotterdam). Moves as published
// (chessgames.com and Wikipedia agree), replayed by the rules. Notes our own,
// every claim checked against Stockfish 19 (depth 20+, three lines per
// position): scratch/report-avro.txt.
import type { MasterGame } from './types'

export const AVRO: MasterGame = {
  id: 'avro',
  title: 'Centre against wing',
  white: 'Mikhail Botvinnik',
  black: 'José Raúl Capablanca',
  players: 'Botvinnik v Capablanca',
  place: 'Rotterdam',
  year: 1938,
  result: '1-0',
  theme: 'A pawn centre, a plan, and a combination',
  orientation: 'white',
  intro:
    'Botvinnik, who would become world champion ten years later, against Capablanca, the former champion, at the great AVRO tournament in the Netherlands. It’s one of the most admired games ever played: a clear strategic plan carried out move by move, then finished with a beautiful combination.',
  plans:
    'In the opening White accepts doubled c-pawns in return for the two bishops and a strong centre. Black closes the queenside and sends a knight on a long trip to win a pawn there. Meanwhile White pushes the centre pawns, e4, e5, f4 and f5, straight towards Black’s king, where Black’s queen and knight are now missing. A pawn reaches e6, and a bishop that sat quietly on b2 all game finishes it.',
  pgn: '1. d4 Nf6 2. c4 e6 3. Nc3 Bb4 4. e3 d5 5. a3 Bxc3+ 6. bxc3 c5 7. cxd5 exd5 8. Bd3 O-O 9. Ne2 b6 10. O-O Ba6 11. Bxa6 Nxa6 12. Bb2 Qd7 13. a4 Rfe8 14. Qd3 c4 15. Qc2 Nb8 16. Rae1 Nc6 17. Ng3 Na5 18. f3 Nb3 19. e4 Qxa4 20. e5 Nd7 21. Qf2 g6 22. f4 f5 23. exf6 Nxf6 24. f5 Rxe1 25. Rxe1 Re8 26. Re6 Rxe6 27. fxe6 Kg7 28. Qf4 Qe8 29. Qe5 Qe7 30. Ba3 Qxa3 31. Nh5+ gxh5 32. Qg5+ Kf8 33. Qxf6+ Kg8 34. e7 Qc1+ 35. Kf2 Qc2+ 36. Kg3 Qd3+ 37. Kh4 Qe4+ 38. Kxh5 Qe2+ 39. Kh4 Qe4+ 40. g4 Qe1+ 41. Kh5',
  chapters: [
    {
      ply: 11,
      title: 'The trade-off',
      text: 'White has doubled c-pawns, but also the two bishops and a solid centre. Black’s plan: put pressure on the c-pawns and swap off White’s light-squared bishop. White’s plan: f3 and e4, a big pawn centre that will push Black back on the kingside.',
    },
    {
      ply: 28,
      arrows: ['f2f3', 'e3e4'],
      title: 'The queenside closes',
      text: 'With …c4 Black has locked the queenside. Black’s targets are there now, the pawn on a4 above all. White’s are in the centre and on the kingside: f3 and e4, then e5 and f5, all aimed at Black’s king. It’s a race between the two plans.',
    },
    {
      ply: 38,
      arrows: ['e4e5', 'f3f4'],
      title: 'A pawn against time',
      text: 'Black has won the a4 pawn. But look where Black’s queen and knight are: a4 and b3, as far from Black’s king as they can be. White’s centre pawns are about to roll forward, and Black has few pieces left to stop them.',
    },
    {
      ply: 58,
      arrows: ['b2a3', 'a3e7'],
      title: 'The blockade',
      text: 'Black’s queen is blockading the passed pawn on e6. If she can be dragged away, the pawn will run. White’s queen and knight are close to Black’s king; Black’s knight on b3 is far away.',
    },
  ],
  notes: [
    // 1. d4
    'The queen’s pawn takes a share of the centre.',
    // 1... Nf6
    'A flexible reply: the knight stops e4 for now.',
    // 2. c4
    'White takes more space.',
    // 2... e6
    'Black opens the diagonal for the bishop on f8.',
    // 3. Nc3
    'White prepares e4, to build a big centre.',
    // 3... Bb4
    'The Nimzo-Indian Defence: the bishop pins the knight and stops e4. Nimzowitsch’s invention. The best move.',
    // 4. e3
    'A solid line. 4.Qc2 was a touch better.',
    // 4... d5
    'Black takes a share of the centre. 4…O-O was slightly better.',
    // 5. a3
    'White asks the bishop to decide at once. 5.Qa4+ was slightly better.',
    // 5... Bxc3+
    'Black gives up the bishop for the knight and doubles White’s c-pawns. The best move.',
    // 6. bxc3
    'White’s pawns are a little damaged, but White has the two bishops and a solid centre. That trade-off is the theme of the opening. The engine’s choice.',
    // 6... c5
    'Black hits the centre. 6…b6 was about the same.',
    // 7. cxd5
    'White trades off the front c-pawn, which could have become a target. The engine’s choice.',
    // 7... exd5
    'Black takes back. The best move.',
    // 8. Bd3
    'The bishop develops. The engine’s choice.',
    // 8... O-O
    'Black castles. The best move.',
    // 9. Ne2
    'The knight goes to e2, leaving f3 free for the f-pawn: White’s plan is f3 and e4. The engine’s choice.',
    // 9... b6
    'Black prepares …Ba6, to swap off White’s good bishop. The best move.',
    // 10. O-O
    'White castles. The engine’s choice.',
    // 10... Ba6
    'Black offers the bishop trade. The best move.',
    // 11. Bxa6
    'White takes. The engine’s choice.',
    // 11... Nxa6
    'The knight takes back. It looks offside on a6, but it will come back. The best move.',
    // 12. Bb2
    'The bishop looks passive behind the c3 pawn, but its day will come. 12.Qd3 was a little better.',
    // 12... Qd7
    'The queen develops. The best move.',
    // 13. a4
    'White gains space on the queenside. As good as anything.',
    // 13... Rfe8
    'The rook takes the half-open e-file.',
    // 14. Qd3
    'The queen develops. 14.c4 was a touch better.',
    // 14... c4
    'Black closes the queenside. Now Black can aim at White’s queenside pawns, but White’s centre is free to advance. The best move.',
    // 15. Qc2
    'The queen steps back. 15.Qd2 was just as good.',
    // 15... Nb8
    'The start of a long journey: the knight goes b8, c6, a5, b3, all to win the a4 pawn. It costs a lot of time. 15…h5 or 15…Nc7 was better.',
    // 16. Rae1
    'The rook goes behind the e-pawn: e4 is coming. 16.Ng3 was slightly better.',
    // 16... Nc6
    'The knight continues. The best move.',
    // 17. Ng3
    'The knight eyes e4, f5 and h5: it’s heading for the kingside. The engine’s choice.',
    // 17... Na5
    'The knight trip goes on, further from the kingside where the battle will be. 17…Ne4 was the engine’s choice and kept Black in the game.',
    // 18. f3
    'Preparing e4. The engine’s choice.',
    // 18... Nb3
    'The knight arrives, and Black is ready to take on a4. The best move.',
    // 19. e4
    'The centre moves forward, and White lets the a4 pawn go. The engine’s choice.',
    // 19... Qxa4
    'Black wins the pawn. But now the queen and the knight on b3 are both far from the kingside. 19…h5 was a touch better.',
    // 20. e5
    'The pawn drives away the knight on f6, the main defender of Black’s king. The engine’s choice.',
    // 20... Nd7
    'The knight retreats. The best move.',
    // 21. Qf2
    'The queen gets ready to support f4. 21.f4 at once was a touch better.',
    // 21... g6
    'Black covers f5 and h5. The best move.',
    // 22. f4
    'Now f5 is coming, to break open Black’s kingside. The engine’s choice.',
    // 22... f5
    'Black blocks the f-pawn. The best move.',
    // 23. exf6
    'White takes en passant: when a pawn moves two squares and lands beside an enemy pawn, that pawn may take it as if it had moved only one. This opens lines. The engine’s choice.',
    // 23... Nxf6
    'The knight takes back. The best move.',
    // 24. f5
    'The f-pawn pushes on, attacking g6 and opening lines towards Black’s king. The engine’s choice by a long way.',
    // 24... Rxe1
    'Black trades a pair of rooks. The best move.',
    // 25. Rxe1
    'White takes back. The engine’s choice.',
    // 25... Re8
    'A mistake: Black contests the e-file, but that’s where White is strongest. 25…Rf8 was much better.',
    // 26. Re6
    'The rook lands on e6, protected by the f5 pawn, and attacks the knight on f6 and the pawn on b6. The engine’s choice.',
    // 26... Rxe6
    'Black trades. The best move.',
    // 27. fxe6
    'Now White has a passed pawn on e6, deep in Black’s position. The engine’s choice.',
    // 27... Kg7
    'The king guards f7 and f6. The best move.',
    // 28. Qf4
    'The queen heads for the dark squares near Black’s king. The engine’s choice.',
    // 28... Qe8
    'Black’s queen comes all the way back to stop the e-pawn. The best move.',
    // 29. Qe5
    'The queen takes the long diagonal and pins the knight on f6 to Black’s king. 29.Qc7+ first was stronger.',
    // 29... Qe7
    'The losing mistake, though it looks natural: the queen stands right in front of the e-pawn. 29…h5 held on.',
    // 30. Ba3
    'The famous move. On e7 the queen stood on the bishop’s diagonal, and the bishop that sat on b2 all game offers itself to drag her off e7. Black is lost whether she takes it or not. The engine’s choice.',
    // 30... Qxa3
    'Black takes. The best move.',
    // 31. Nh5+
    'The knight gives itself up to break open Black’s king. 31…Kh6 or 31…Kg8 would lose even faster. The engine’s choice.',
    // 31... gxh5
    'Black takes. The best move.',
    // 32. Qg5+
    'The queen checks. The engine’s choice.',
    // 32... Kf8
    'The king steps away. The best move.',
    // 33. Qxf6+
    'The queen takes the knight with check. Black’s king is stripped bare, and the e-pawn is ready to run. The engine’s choice.',
    // 33... Kg8
    'The only move: 33…Ke8 34.Qf7+ Kd8 35.Qd7 is mate.',
    // 34. e7
    'The pawn is one step from queening. Black’s only hope is to give check forever. 34.Qg5+ or 34.Qf7+ first was a touch more precise.',
    // 34... Qc1+
    'Black starts checking.',
    // 35. Kf2
    'The king steps out, and it’s going to walk up the board. The engine’s choice.',
    // 35... Qc2+
    'Another check. 35…Qd2+ was a little better.',
    // 36. Kg3
    'The king keeps going. The engine’s choice.',
    // 36... Qd3+
    'Another check. 36…Qxc3+ lasted longer.',
    // 37. Kh4
    'The king heads towards Black’s pawns, which will shelter it. The engine’s choice.',
    // 37... Qe4+
    'Another check. The best move.',
    // 38. Kxh5
    'The king even takes a pawn. The engine’s choice.',
    // 38... Qe2+
    'Another check. The best move.',
    // 39. Kh4
    'Back again: the king will find shelter behind its g-pawn. 39.g4 was a touch quicker.',
    // 39... Qe4+
    'Another check.',
    // 40. g4
    'The pawn blocks the check and shields the king. The engine’s choice.',
    // 40... Qe1+
    'One more check.',
    // 41. Kh5
    'The checks are over: Black has no useful check left, and nothing can stop e8=Q. Capablanca resigned.',
  ],
  stops: [
    {
      ply: 46,
      prompt: 'You have just taken en passant, and Black’s knight is back on f6. How do you keep the attack going?',
      options: [
        {
          san: 'f5',
          best: true,
          text: 'The pawn attacks g6 and opens lines to Black’s king. The engine rates White clearly better.',
        },
        {
          san: 'h3',
          text: 'Too slow: Black trades rooks and gets organised, and White is only a little better.',
        },
        {
          san: 'Re5',
          text: 'After 24…Ng4 Black hits your queen and rook, and Black is slightly better.',
        },
      ],
    },
    {
      ply: 50,
      prompt: 'Black has just put a rook on the e-file. What now?',
      options: [
        {
          san: 'Re6',
          best: true,
          text: 'The rook goes to e6, protected by the f5 pawn, attacking the knight and the b6 pawn. After the trade you get a passed pawn on e6. The engine rates White winning.',
        },
        {
          san: 'fxg6',
          text: 'After 26…Rxe1+ 27.Qxe1 Qe8 the rooks are gone and the attack fizzles. White is only a little better.',
        },
        {
          san: 'Rxe8+',
          text: 'Trading rooks gives Black’s queen time to come back. About level.',
        },
      ],
    },
    {
      ply: 58,
      prompt: 'Black’s queen blockades your passed pawn from e7. Can you drag her away?',
      options: [
        {
          san: 'Ba3',
          best: true,
          text: 'The bishop offers itself. If 30…Qxa3, then 31.Nh5+ breaks open the king and the e-pawn runs. The engine rates White winning.',
        },
        {
          san: 'h4',
          text: 'It keeps the pressure, and White is still clearly better, but Black gets time for …h5 and …Nc6.',
        },
        {
          san: 'h3',
          text: 'Too slow: Black untangles, and White is only a little better.',
        },
      ],
    },
    {
      ply: 60,
      prompt: 'Black’s queen has taken your bishop. How do you get at Black’s king?',
      options: [
        {
          san: 'Nh5+',
          best: true,
          text: 'The knight sacrifice: after 31…gxh5 32.Qg5+ and 33.Qxf6+ Black’s king is bare and the e-pawn runs. The engine rates White winning.',
        },
        {
          san: 'Qc7+',
          text: 'Checks alone lead nowhere: after 31…Kh8 32.Qb8+ Kg7 it’s a draw by repetition at best.',
        },
        {
          san: 'Nf1',
          text: 'Defending against the queen’s checks, but it gives up the attack, and Black is now better.',
        },
      ],
    },
  ],
  ending: 'Capablanca resigned.',
  lessons: [
    'A plan beats a pawn. Black won the a4 pawn; White used the time to push the centre pawns at Black’s king.',
    'Pieces far from the king can’t defend it. Black’s queen and knight were on a4 and b3 when the attack came.',
    'A passed pawn deep in the enemy position ties the defence down: Black’s queen had to stand guard on e7.',
    'Look for deflections: 30.Ba3 dragged the queen away from the pawn, and the combination followed.',
    'When your king has to escape checks, walk it towards the enemy pawns: they make the best shelter.',
  ],
}
