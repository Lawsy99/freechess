// The Immortal Game, London 1851. Moves as published (Wikipedia, "Immortal
// Game"), replayed by the rules. Notes our own, every claim checked against
// Stockfish 19 (depth 20+, three lines per position): scratch/report-immortal.txt.
import type { MasterGame } from './types'

export const IMMORTAL: MasterGame = {
  id: 'immortal',
  title: 'The Immortal Game',
  white: 'Adolf Anderssen',
  black: 'Lionel Kieseritzky',
  place: 'London',
  year: 1851,
  result: '1-0',
  theme: 'Time and activity beat material',
  orientation: 'white',
  legend: 'anderssen',
  intro:
    'A casual game played in London in 1851, during a break in the first international tournament. It was given its name a few years later. By modern standards it’s wild, and the engine finds mistakes on both sides, which we show honestly. What made it immortal is the finish: White gives up almost everything and still mates.',
  plans:
    'This is chess from the Romantic era, when players offered material freely to attack. White gives a pawn, then a bishop, then both rooks, and finally the queen. Black takes almost everything, but spends move after move with the queen while the rest of the army stays at home. The thread to follow: every capture costs Black time, and White uses that time to bring pieces close to Black’s king. Material only counts if the pieces can take part.',
  pgn: '1. e4 e5 2. f4 exf4 3. Bc4 Qh4+ 4. Kf1 b5 5. Bxb5 Nf6 6. Nf3 Qh6 7. d3 Nh5 8. Nh4 Qg5 9. Nf5 c6 10. g4 Nf6 11. Rg1 cxb5 12. h4 Qg6 13. h5 Qg5 14. Qf3 Ng8 15. Bxf4 Qf6 16. Nc3 Bc5 17. Nd5 Qxb2 18. Bd6 Bxg1 19. e5 Qxa1+ 20. Ke2 Na6 21. Nxg7+ Kd8 22. Qf6+ Nxf6 23. Be7#',
  chapters: [
    {
      ply: 7,
      title: 'The gambit bargain',
      text: 'White has given a pawn and can no longer castle. In return, White has a strong pawn on e4 and quick development ahead, while Black’s queen is out very early. White’s plan: bring pieces out fast, each one with a threat if possible. Black’s best plan would be to develop too, and give the pawn back if needed. Grabbing more material will cost time.',
    },
    {
      ply: 22,
      title: 'Hunting the queen',
      text: 'Black is a bishop up. But the queen on g5 is short of squares, and only one other Black piece has moved. White’s plan: attack the queen with pawns and pieces, so that every attack also gains space or develops something, and Black never gets time to bring out the rest.',
    },
    {
      ply: 30,
      title: 'Count the pieces',
      text: 'After fifteen moves, Black’s queen is the only piece that has left its starting square. Black is still a piece up, but the extra pieces are all at home. White has queen, bishop and knight in play and another knight on the way. The plan: bring the last pieces in and aim everything at Black’s king, which is stuck in the middle.',
    },
    {
      ply: 36,
      arrows: ['d6f8'],
      title: 'The mating net',
      text: 'White has lost a rook and the other is about to go. It doesn’t matter if Black’s king can be trapped. The bishop on d6 takes e7 and f8 from it, the knights on d5 and f5 cover c7, e7 and g7, and the queen is ready on f3. Black’s queen is far away, and most of Black’s pieces are still at home.',
    },
  ],
  notes: [
    // 1. e4
    'The king’s pawn opens lines for the queen and bishop and claims the centre.',
    // 1... e5
    'Black answers in kind.',
    // 2. f4
    'The King’s Gambit, the favourite opening of the age. White offers a pawn to pull Black’s e-pawn away from the centre, planning to follow with d4 and fast development. Modern engines rate it slightly dubious, but it leads to exactly the kind of open, fast game you’re about to see.',
    // 2... exf4
    'Black accepts the pawn. The engine agrees with taking it.',
    // 3. Bc4
    'The Bishop’s Gambit: the bishop aims at f7, the weak point next to Black’s king. It allows a queen check, which White accepts as the price.',
    // 3... Qh4+
    'The queen checks, and White’s king has to move, so White can never castle. Simple development with 3…Nc6 was a touch better, but the check is a normal reply, not a mistake.',
    // 4. Kf1
    'The only good move. 4.g3 would lose to 4…fxg3, and 4.Ke2 walks into the open. On f1 the king is awkward but safe enough.',
    // 4... b5
    'The Bryan Countergambit: Black gives a pawn back to drag White’s bishop away from f7. It’s playable, but it’s a second gambit from the side that is already behind in development. 4…d5, returning the pawn to free Black’s pieces, was cleaner.',
    // 5. Bxb5
    'White takes. Each side has now given a pawn and taken one.',
    // 5... Nf6
    'Black develops and attacks the pawn on e4. 5…c6, hitting the bishop first, was a little more accurate.',
    // 6. Nf3
    'A developing move that also attacks Black’s queen. This is the theme of the whole game: White brings pieces out while gaining time against the queen.',
    // 6... Qh6
    'The queen steps back but keeps an eye on the kingside. The best square.',
    // 7. d3
    'Solid: it protects the e4 pawn and opens the way for the other bishop. 7.d4, taking more of the centre, was stronger.',
    // 7... Nh5
    'The knight jumps forward with a threat: …Ng3+ would fork White’s king and the rook on h1, and if the h-pawn takes the knight, the h-file opens for Black’s queen to take the rook. But it puts the knight on the edge of the board. 7…c6, chasing the bishop, was better.',
    // 8. Nh4
    'White meets the threat his own way. The knight blocks the h-file, so the …Ng3+ trick no longer wins the rook, and it’s heading for f5, a great square near Black’s king. The engine prefers 8.Rg1, simply stepping the rook out of the fork.',
    // 8... Qg5
    'The queen attacks the knight on h4 and the pawn on g2. But it’s yet another queen move. 8…g6, keeping White’s knight out of f5, was best.',
    // 9. Nf5
    'The knight escapes to f5, where it attacks g7 and is protected by the pawn on e4. It will be a thorn in Black’s side for the rest of the game.',
    // 9... c6
    'Black finally chases the bishop. 9…g6, kicking the knight off f5, was more to the point.',
    // 10. g4
    'A daring pawn move: it attacks the knight on h5 and grabs space. The engine prefers saving the bishop with 10.Ba4, and finds that Black could now have answered 10…g6! with the better position. Anderssen was playing for the initiative, not for safety.',
    // 10... Nf6
    'The knight retreats. 10…g6 was the move: after 11.gxh5 gxf5 Black is better.',
    // 11. Rg1
    'Anderssen leaves his bishop on b5 to be taken. The rook comes out of the corner and protects the pawn on g4. White is betting that time matters more than a bishop, and here the engine agrees this was the best move.',
    // 11... cxb5
    'Black takes the bishop and is a piece up. But look at the cost: the queen on g5 now has very few squares. 11…h5, hitting the g4 pawn, was the engine’s choice and kept Black better.',
    // 12. h4
    'The pawn attacks the queen, and she has only one safe square. Taking the knight on f5, or defending with …h6, would cost Black far too much.',
    // 12... Qg6
    'The only square.',
    // 13. h5
    'And again. Each pawn move gains time, because Black has to move the queen instead of developing.',
    // 13... Qg5
    'The queen goes back to g5. Giving the knight back with 13…Nxh5 was the engine’s slight preference, but either way White is now better.',
    // 14. Qf3
    'The queen joins the attack. The f4 pawn is now attacked twice, and Bxf4 would hit Black’s queen yet again. The engine’s top choice.',
    // 14... Ng8
    'A sad retreat: the knight goes home to clear f6 as an escape square for the queen. Black is a piece up, but this knight on g8 shows what has gone wrong. 14…Bb7, developing, was better.',
    // 15. Bxf4
    'White wins the pawn back with a threat to the queen, and another piece joins the attack.',
    // 15... Qf6
    'The queen takes the square the knight just cleared. 15…Qd8 was a little better.',
    // 16. Nc3
    'The last minor piece comes out, heading for d5, where it will hit the queen again.',
    // 16... Bc5
    'Black develops a piece at last, attacking the rook on g1. But it’s the wrong moment: 16…Qc6, keeping the queen out of danger, was better.',
    // 17. Nd5
    'The knight leaps in, attacking the queen and the pawn on c7. Exciting, but the engine shows 17.d4!, hitting the bishop and blocking its line to g1, was even stronger. White is winning either way.',
    // 17... Qxb2
    'Black’s queen takes a pawn and attacks the rook on a1, so both of White’s rooks are now under attack. The engine’s choice: Black goes after material.',
    // 18. Bd6
    'The most famous move of the game. Anderssen ignores both rooks. The bishop takes e7 and f8 away from Black’s king and attacks the bishop on c5. The idea: Black’s king will be trapped in the middle while Black’s queen is far away. A modern footnote: the engine says this throws away most of the advantage, because 18…Qxa1+ 19.Ke2 Qb2! keeps the game roughly level. Simply moving the rook with 18.Re1 kept a winning position.',
    // 18... Bxg1
    'Black takes the first rook. This lets White back in: 18…Qxa1+ first, followed by 19…Qb2, was the way to hold.',
    // 19. e5
    'A quiet move in the middle of the storm. The pawn blocks the long diagonal, so Black’s queen can never come back to defend g7 and the kingside. By the engine’s count 19.Re1, saving the other rook, was a little stronger, but White is winning either way.',
    // 19... Qxa1+
    'Black takes the second rook, with check.',
    // 20. Ke2
    'The king steps out of check. White is a bishop and two rooks down, but look at where the pieces are: White’s queen, two knights and bishop are all close to Black’s king, while most of Black’s army is still on its starting squares.',
    // 20... Na6
    'Black develops a knight to guard c7, but it’s too late, and it allows a forced mate. 20…Ba6 was the only defence, and even then White is winning.',
    // 21. Nxg7+
    'The knight takes on g7 with check and drives the king to d8.',
    // 21... Kd8
    'The only move: f8 is covered by the bishop on d6.',
    // 22. Qf6+
    'The queen sacrifice. The knight on g8 is the only piece guarding e7, and the queen drags it away.',
    // 22... Nxf6
    'Black takes the queen. Blocking with 22…Ne7 would allow 23.Qxe7 mate.',
    // 23. Be7#
    'Checkmate with three minor pieces. The bishop gives check, the knight on d5 protects it and covers c7, and the knight on g7 covers e8. Black still has every piece, a queen, two rooks and a bishop more than White, and is mated.',
  ],
  stops: [
    {
      ply: 22,
      prompt: 'Black’s queen on g5 is running short of squares. What would you play?',
      options: [
        {
          san: 'h4',
          best: true,
          text: 'The pawn attacks the queen and she has only one safe square, g6. Next comes h5, gaining more time. The engine’s choice by a long way.',
        },
        {
          san: 'Qf3',
          text: 'Natural, but Black hits back with 12…h5!, attacking your g4 pawn, and the engine says Black is better.',
        },
        {
          san: 'Nc3',
          text: 'It develops, but gives Black a free move: 12…h5 again, and Black is better.',
        },
      ],
    },
    {
      ply: 26,
      prompt: 'Black’s queen is almost trapped. How can you add to the pressure?',
      options: [
        {
          san: 'Qf3',
          best: true,
          text: 'The queen joins the attack and hits the f4 pawn a second time. Bxf4 is coming, and it will attack Black’s queen again.',
        },
        {
          san: 'Nd2',
          text: 'Too slow. After 14…Ng8 Black frees f6 for the queen, and the engine calls it level.',
        },
        {
          san: 'e5',
          text: 'Too hasty. After 14…Nd5 Black’s knight lands on a great central square, and the engine says Black is better.',
        },
      ],
    },
    {
      ply: 34,
      prompt: 'Both your rooks are attacked: the bishop on c5 hits g1 and the queen hits a1. What would you play?',
      options: [
        {
          san: 'Bd6',
          best: true,
          text: 'The famous move: ignore both rooks, take e7 and f8 from Black’s king and attack the bishop on c5. It worked in the game, but the engine finds a hole: 18…Qxa1+ 19.Ke2 Qb2! and Black is roughly level.',
        },
        {
          san: 'Re1',
          text: 'The engine’s top choice: move the rook on a1 to safety. White keeps a winning attack without giving anything away. Less beautiful, more certain.',
        },
        {
          san: 'd4',
          text: 'Also strong: the pawn attacks the bishop on c5 and blocks its line to g1. The engine rates White winning after this too.',
        },
      ],
    },
    {
      ply: 42,
      prompt: 'Black’s king is trapped on d8. There’s a mate in two. Can you find it?',
      options: [
        {
          san: 'Qf6+',
          best: true,
          text: 'The queen sacrifice. After 22…Nxf6 the knight has left g8, where it guarded e7, and 23.Be7 is mate.',
        },
        {
          san: 'Qxf7',
          text: 'Still a forced mate, but it takes four moves. There’s a faster way.',
        },
        {
          san: 'd4',
          text: 'Still winning, but slow: the mate takes eight moves. Look for a check.',
        },
      ],
    },
  ],
  ending:
    'Black is checkmated. Kieseritzky is reported to have resigned before the final moves; the finish shown is the one usually published, and it is a forced mate.',
  lessons: [
    'Time is a resource. Black’s queen made eight moves, and by move 15 every other Black piece was still on its starting square.',
    'Gain time against the queen: Nf3, h4, h5, Qf3, Bxf4 and Nd5 all came with a threat, so Black was always reacting.',
    'Material only counts if the pieces can play. At the end Black had a queen, two rooks and a bishop more, and lost.',
    'A modern footnote: the engine shows that 18.Bd6 should not have worked, and Black could have held. Romantic chess relied on defenders missing the best reply. Today, sacrifice when you can see it works, or when the safe move is clearly worse.',
  ],
}
