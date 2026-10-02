// Sämisch v Nimzowitsch, Copenhagen 1923, "the Immortal Zugzwang Game".
// Moves as published (Wikipedia), replayed by the rules. Notes our own, every
// claim checked against Stockfish 19 (depth 20+, three lines per position):
// scratch/report-zugzwang.txt; every White move in the final position scored
// with scratch/allMoves.mjs.
import type { MasterGame } from './types'

export const ZUGZWANG: MasterGame = {
  id: 'zugzwang',
  title: 'The Immortal Zugzwang',
  white: 'Friedrich Sämisch',
  black: 'Aron Nimzowitsch',
  place: 'Copenhagen',
  year: 1923,
  result: '0-1',
  theme: 'Space, squares and the quiet move',
  orientation: 'black',
  intro:
    'Aron Nimzowitsch was one of the founders of modern strategic chess, and his book My System is still read today. This game is a different kind of masterpiece from the attacking games: no early fireworks, just Black slowly taking space until White runs out of useful moves. You watch it from Black’s side.',
  plans:
    'Nimzowitsch controls the centre with pieces as much as pawns, then takes space on the queenside with …a6, …b5 and …b4, pushing White’s knight back to its starting square. Then he switches to the kingside with …f5, and opens the f-file for his rooks. Watch how Black’s pieces gain squares while White’s lose them, until White’s whole army is tied up.',
  pgn: '1. d4 Nf6 2. c4 e6 3. Nf3 b6 4. g3 Bb7 5. Bg2 Be7 6. Nc3 O-O 7. O-O d5 8. Ne5 c6 9. cxd5 cxd5 10. Bf4 a6 11. Rc1 b5 12. Qb3 Nc6 13. Nxc6 Bxc6 14. h3 Qd7 15. Kh2 Nh5 16. Bd2 f5 17. Qd1 b4 18. Nb1 Bb5 19. Rg1 Bd6 20. e4 fxe4 21. Qxh5 Rxf2 22. Qg5 Raf8 23. Kh1 R8f5 24. Qe3 Bd3 25. Rce1 h6',
  chapters: [
    {
      ply: 22,
      title: 'Space on the queenside',
      text: 'Black has gained ground with …a6 and …b5, and the c-file is open. Black’s plan: push the queenside pawns to drive White’s pieces back (…b4 will kick the knight on c3), then switch to the other side of the board. White’s plan: use the c-file and the active bishop on f4.',
    },
    {
      ply: 32,
      title: 'Space on both wings',
      text: 'With …f5 Black has taken space on the kingside too, and controls e4. Black’s plan: kick White’s knight back with …b4, aim the bishops at White’s king, and prepare to open the f-file for the rooks. White’s pieces are drifting to passive squares.',
    },
    {
      ply: 42,
      title: 'A knight for the second rank',
      text: 'Black has given up a knight for two pawns. In return, a rook has reached White’s second rank, White’s queen is far from home and the knight on b1 is stuck. Black’s plan: double the rooks on the f-file and tie every White piece down.',
    },
    {
      ply: 50,
      title: 'Zugzwang',
      text: 'Zugzwang is German for “compulsion to move”: a position where any move makes things worse. White’s knight on b1 can’t move without being taken by the b4 pawn, and most moves by the queen, rooks and bishops lose material on the spot. White resigned here.',
    },
  ],
  notes: [
    // 1. d4
    'The queen’s pawn takes a share of the centre. Unlike a pawn on e4, it’s protected by the queen from the start, one reason queen’s pawn openings tend to be slower and more strategic.',
    // 1... Nf6
    'A flexible reply: the knight develops towards the centre and stops e4 for now, while Black keeps the pawns uncommitted. The engine’s choice.',
    // 2. c4
    'White takes more space. The pawn on c4 also eyes d5, so a Black pawn there can always be challenged.',
    // 2... e6
    'Black opens the diagonal for the bishop on f8 and prepares …d5 or …Bb4.',
    // 3. Nf3
    'A solid developing move. 3.Nc3 would have allowed 3…Bb4, the Nimzo-Indian Defence, named after the man playing Black.',
    // 3... b6
    'The Queen’s Indian Defence: the bishop will go to b7 and control e4 from a distance. Controlling the centre with pieces rather than pawns was one of Nimzowitsch’s big ideas.',
    // 4. g3
    'White prepares to put the bishop on g2, to oppose Black’s bishop on the long diagonal. The engine’s choice.',
    // 4... Bb7
    'The bishop takes the long diagonal from b7 to h1, aiming at e4 and, further on, at White’s kingside. A modern footnote: 4…Ba6, hitting the pawn on c4, is the main line today, and the engine slightly prefers it.',
    // 5. Bg2
    'White’s bishop faces Black’s on the long diagonal. Whoever controls that diagonal has a say over e4, the key square of this opening.',
    // 5... Be7
    'Black gets ready to castle. Quiet and solid; 5…Bb4+ was a touch more active.',
    // 6. Nc3
    'Another piece out, adding control of e4 and d5.',
    // 6... O-O
    'Black castles, the best move: the king is safe before anything opens up.',
    // 7. O-O
    'White castles too, the engine’s choice. Both kings are safe, so the fight will be about space and squares.',
    // 7... d5
    'Black now claims the centre with a pawn as well, backing up the pieces that were already watching it.',
    // 8. Ne5
    'The knight jumps to a strong central square and opens the long diagonal for White’s bishop on g2. The engine’s choice.',
    // 8... c6
    'Black supports d5 and blunts White’s bishop. 8…Nbd7, challenging the knight, was a little better.',
    // 9. cxd5
    'White releases the tension, and the c-file will open for both sides. 9.e4!, striking in the centre while Black’s pieces are a little awkward, was stronger.',
    // 9... cxd5
    'Black takes back with the c-pawn, keeping a solid pawn on d5. The c-file is now open for both sides’ rooks. The best move.',
    // 10. Bf4
    'White develops the last minor piece, which also supports the knight on e5. The engine’s choice.',
    // 10... a6
    'Black prepares …b5, to gain space on the queenside. 10…Nc6 was a little more accurate.',
    // 11. Rc1
    'The rook takes the open c-file, hoping to reach c7 one day. The engine’s choice.',
    // 11... b5
    'Black gains space on the queenside. The engine’s choice. Next, …b4 can drive White’s knight away.',
    // 12. Qb3
    'The queen joins the queenside and eyes the pawn on b5. 12.a4, challenging Black’s pawns, was slightly better.',
    // 12... Nc6
    'Black develops and challenges the knight on e5.',
    // 13. Nxc6
    'White trades knights, swapping off the best-placed White piece. 13.Nxd5 was a little better.',
    // 13... Bxc6
    'Black takes back with the bishop, which now watches b5 and the long diagonal. The best move.',
    // 14. h3
    'A slow move, and from here Black is slightly better. 14.Ne4 was the engine’s choice and kept the balance.',
    // 14... Qd7
    'Black connects the rooks and stays flexible. The engine’s choice.',
    // 15. Kh2
    'Another slow move, and now Black is clearly better. 15.Nb1, heading for d2, was better.',
    // 15... Nh5
    'The knight attacks the bishop on f4. The engine’s choice.',
    // 16. Bd2
    'The bishop steps back rather than be swapped for the knight. 16.Be3 was about as good.',
    // 16... f5
    'Black grabs space on the kingside and takes control of e4. Now Black has space on both wings. The engine preferred 16…b4 first, and calls the game level after this.',
    // 17. Qd1
    'The queen goes back towards the kingside, but it’s passive. 17.Nb1 was better.',
    // 17... b4
    'The pawn kicks the knight, and its best square is b1, at the back. The engine’s choice.',
    // 18. Nb1
    'Back where it started: other squares cost material, since 18.Nxd5 exd5 just loses the knight for a pawn. This knight will not move again.',
    // 18... Bb5
    'The bishop switches diagonals, aiming at e2 and at White’s rook on f1. The engine’s choice.',
    // 19. Rg1
    'The rook steps off the bishop’s diagonal. White is now completely passive, waiting to see what Black does. 19.Bf3 or 19.a3 was a little better.',
    // 19... Bd6
    'The second bishop aims at g3 and, behind it, White’s king on h2. 19…a5 was slightly better.',
    // 20. e4
    'White tries to break free, but it’s a serious mistake: it opens lines when Black’s pieces are much better placed. 20.Bf3 was the move.',
    // 20... fxe4
    'Black takes and leaves the knight on h5 to be captured. The engine’s choice: Black has seen further.',
    // 21. Qxh5
    'White takes the knight and is a piece up for a pawn, for the moment.',
    // 21... Rxf2
    'The point. For the knight, Black has two pawns and a rook on White’s second rank, attacking both bishops, right next to White’s king.',
    // 22. Qg5
    'The queen heads back to defend, but too slowly. 22.Kh1 or 22.a3 held better.',
    // 22... Raf8
    'Black doubles rooks on the f-file. Every Black piece is now in the game. 22…h6 was about as good.',
    // 23. Kh1
    'The king steps into the corner. 23.Qh4 was a little better.',
    // 23... R8f5
    'The rook attacks the queen. The engine’s choice.',
    // 24. Qe3
    'The queen retreats to defend. 24.Qh4 was better.',
    // 24... Bd3
    'The bishop lands on d3, cutting White’s position in two: it attacks the knight on b1 and covers e2 and f1. 24…Re2!, attacking the queen, was even stronger.',
    // 25. Rce1
    'The rook comes to e1 to stop …Re2.',
    // 25... h6
    'The most famous waiting move in chess. Black gives the king a little air and simply passes the move back. Most White moves now lose material at once: 26.g4 or 26.Kh2 allow …Rf3, 26.Bc1 lets the bishop on d3 take the knight on b1, and the queen has no safe square. White has a few pawn moves left, but they solve nothing. A modern footnote: the engine doesn’t fully agree this is zugzwang. White’s best try, 26.Bc1, is no worse than if White could pass. Either way White is lost, by about six pawns.',
  ],
  stops: [
    {
      ply: 33,
      prompt: 'White’s knight is on c3. How can you use your queenside pawns?',
      options: [
        {
          san: 'b4',
          best: true,
          text: 'The pawn kicks the knight back to b1, where it will stay for the rest of the game. The engine’s choice.',
        },
        {
          san: 'f4',
          text: 'Opens the f-file at once, but it’s premature, and Black is only slightly better.',
        },
        {
          san: 'Nf6',
          text: 'Solid but slow. Black stays only slightly better.',
        },
      ],
    },
    {
      ply: 39,
      prompt: 'White has just played e4. Would you take on e4, even though it leaves your knight on h5 to be captured?',
      options: [
        {
          san: 'fxe4',
          best: true,
          text: 'Yes! After 21.Qxh5 Rxf2 Black has two pawns for the knight, a rook on White’s second rank and a crushing position. The engine agrees: Black is clearly winning.',
        },
        {
          san: 'Nxg3',
          text: 'It grabs a pawn, but after 21.fxg3 the position is about level.',
        },
        {
          san: 'g6',
          text: 'Too timid. After 21.e5 White gains space and is a little better.',
        },
      ],
    },
    {
      ply: 41,
      prompt: 'White has taken your knight. How do you continue?',
      options: [
        {
          san: 'Rxf2',
          best: true,
          text: 'The rook takes a second pawn and lands on White’s second rank, attacking both bishops. The engine’s choice.',
        },
        {
          san: 'Rf5',
          text: 'Nearly as strong: it hits the queen first, and …Rxf2 can follow next move.',
        },
        {
          san: 'g6',
          text: 'Chasing the queen first lets White organise. Black is still better, but much less so.',
        },
      ],
    },
  ],
  ending: 'White resigned.',
  lessons: [
    'Space is a weapon. Black gained ground on the queenside, then the kingside, until White’s pieces had nowhere good to go.',
    'Bad pieces lose games. White’s knight went back to b1 on move 18 and never moved again.',
    'Material isn’t everything. At the end White was a knight up for two pawns, and had no useful move.',
    'Sometimes the strongest move is a quiet one that hands the problem back to your opponent.',
  ],
}
