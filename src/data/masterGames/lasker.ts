// Edward Lasker v Thomas, London 1912. Moves as published (Wikipedia),
// replayed by the rules. Notes our own, every claim checked against Stockfish
// 19 (depth 20+, three lines per position): scratch/report-lasker.txt.
import type { MasterGame } from './types'

export const LASKER: MasterGame = {
  id: 'lasker',
  title: 'The great king hunt',
  white: 'Edward Lasker',
  black: 'George Alan Thomas',
  place: 'London',
  year: 1912,
  result: '1-0',
  theme: 'Aim at h7, then hunt the king',
  orientation: 'white',
  intro:
    'A casual game played in London in 1912. Edward Lasker was a strong master and engineer (not the world champion Emanuel Lasker); Thomas later became British champion. It contains the most famous king hunt in chess: Black’s king is dragged from g8 all the way to g1.',
  plans:
    'Black plays the Dutch Defence, pushing the f-pawn to fight for e4. It’s a fighting choice, but it loosens the pawns in front of Black’s king. White’s plan: win the fight for e4, put knights on strong central squares, and aim the bishop and queen at h7, the one point that only Black’s king defends. Then, once the king is pulled out, every move is a check.',
  pgn: '1. d4 e6 2. Nf3 f5 3. Nc3 Nf6 4. Bg5 Be7 5. Bxf6 Bxf6 6. e4 fxe4 7. Nxe4 b6 8. Ne5 O-O 9. Bd3 Bb7 10. Qh5 Qe7 11. Qxh7+ Kxh7 12. Nxf6+ Kh6 13. Neg4+ Kg5 14. h4+ Kf4 15. g3+ Kf3 16. Be2+ Kg2 17. Rh2+ Kg1 18. Kd2#',
  chapters: [
    {
      ply: 16,
      title: 'Aiming at h7',
      text: 'Black has castled, but the f-pawn has gone and the bishop from f8 is on f6, so nothing but the king guards h7. White’s knights stand on e4 and e5. The plan: bring the bishop to d3 and the queen to h5, all aimed at h7.',
    },
    {
      ply: 22,
      title: 'The king hunt',
      text: 'Black’s king has been pulled out of its shelter. Now every White move is a check, so Black never gets a free move to bring the queen or rooks to help. The plan: keep checking, and drive the king towards White’s pieces.',
    },
  ],
  notes: [
    // 1. d4
    'The queen’s pawn takes a share of the centre.',
    // 1... e6
    'A flexible reply, keeping several defences open.',
    // 2. Nf3
    'The knight develops and keeps an eye on e5.',
    // 2... f5
    'The Dutch Defence: the f-pawn fights for e4. It’s an ambitious choice, but it loosens the pawns in front of Black’s king. The engine prefers 2…Nf6 or 2…d5.',
    // 3. Nc3
    'White prepares e4, to break open the centre. The engine slightly prefers 3.c4.',
    // 3... Nf6
    'Black develops and adds a guard to e4. The best move.',
    // 4. Bg5
    'The bishop attacks the knight that guards e4. The engine’s choice.',
    // 4... Be7
    'Solid, but passive. 4…Bb4!, pinning White’s knight, would have kept up the fight for e4.',
    // 5. Bxf6
    'White removes a defender of e4. The engine’s choice.',
    // 5... Bxf6
    'Taking back with the bishop keeps Black’s kingside pawns together. The best move.',
    // 6. e4
    'The break White has been preparing. The engine’s choice.',
    // 6... fxe4
    'Black takes, the best move.',
    // 7. Nxe4
    'The knight takes back and lands on a superb central square, eyeing the bishop on f6.',
    // 7... b6
    'Black plans …Bb7 to fight for e4 along the long diagonal. Reasonable, but it does nothing for the kingside. 7…Be7 was a little better.',
    // 8. Ne5
    'The second knight takes a strong central post too. It also clears the way for the queen to reach h5. The engine slightly prefers 8.c3 or 8.Bd3.',
    // 8... O-O
    'Black castles, the best move.',
    // 9. Bd3
    'The bishop aims at h7, through the knight on e4. A modern footnote: the engine says Black could now take over with 9…Bxe5!, removing one of the dangerous knights. 9.g3 was safer.',
    // 9... Bb7
    'Black misses 9…Bxe5 and develops instead. White is slightly better again.',
    // 10. Qh5
    'The queen joins the bishop in aiming at h7. 10.Qg4 or castling was a little better, and the engine calls this level. But Black now has to find the one defence.',
    // 10... Qe7
    'The losing move, though it looks natural. Now White has a forced mate in seven. The defence was 10…Bxe5!, removing a knight so the attack below can’t work.',
    // 11. Qxh7+
    'The queen sacrifice. Black must take, and the king leaves its shelter.',
    // 11... Kxh7
    'Forced.',
    // 12. Nxf6+
    'Double check: the knight checks from f6, and the bishop on d3 checks along the diagonal the knight has just opened. The king has to move.',
    // 12... Kh6
    'Going back with 12…Kh8 runs into 13.Ng6 mate.',
    // 13. Neg4+
    'The right knight: the one from e5 checks from g4. Using the other knight lets the king escape.',
    // 13... Kg5
    'The only move.',
    // 14. h4+
    'The pawn drives the king on. 14.f4+ was just as quick.',
    // 14... Kf4
    'The only move.',
    // 15. g3+
    'Another pawn check, and the king is pushed deeper.',
    // 15... Kf3
    'The only move. Black’s king is now on White’s side of the board.',
    // 16. Be2+
    'The bishop checks. A modern footnote: 16.O-O or 16.Kf1 would have mated a move sooner, with 17.Nh2 mate next.',
    // 16... Kg2
    'The only move.',
    // 17. Rh2+
    'The rook checks, driving the king to its final square.',
    // 17... Kg1
    'The only move: the king has walked from g8 to g1.',
    // 18. Kd2#
    'Checkmate, by the king! Moving the king uncovers a check from the rook on a1 along the first rank. 18.O-O-O, castling with mate, would have done it too.',
  ],
  stops: [
    {
      ply: 20,
      prompt: 'Your bishop and queen are aimed at h7, and only Black’s king defends it. What would you play?',
      options: [
        {
          san: 'Qxh7+',
          best: true,
          text: 'The queen sacrifice. After 11…Kxh7 12.Nxf6+ is a double check, and the king is hunted down. The engine sees mate in seven.',
        },
        {
          san: 'O-O',
          text: 'Safe, and White stays a little better. But there was a forced mate.',
        },
        {
          san: 'Nxf6+',
          text: 'After 11…gxf6 the attack fizzles out, and the game is roughly level.',
        },
      ],
    },
    {
      ply: 24,
      prompt: 'Black’s king is on h6. Which knight should check from g4?',
      options: [
        {
          san: 'Neg4+',
          best: true,
          text: 'The knight from e5. The one on f6 stays put, covering h5, h7 and g8, so the king has to come forward.',
        },
        {
          san: 'Nfg4+',
          text: 'The wrong knight: after 13…Kh5 the king slips away and the game is level.',
        },
        {
          san: 'Nh7',
          text: 'Too slow: Black gets a free move and wins the knight. The engine says Black is clearly better.',
        },
      ],
    },
    {
      ply: 30,
      prompt: 'Black’s king is on f3. The game finished with mate in three, but there’s a mate in two. Can you find one?',
      options: [
        {
          san: 'Be2+',
          best: true,
          text: 'What Lasker played: mate in three, finishing with a king move.',
        },
        {
          san: 'O-O',
          text: 'Mate in two! Castling, then 17.Nh2 is mate whatever Black does.',
        },
        {
          san: 'Kf1',
          text: 'Mate in two as well: 17.Nh2 is mate next.',
        },
      ],
    },
  ],
  ending: 'Black is checkmated.',
  lessons: [
    'Know which squares only your king defends. Here it was h7, and White aimed three pieces at it.',
    'A double check is the strongest check: the king must move, and nothing can block or capture.',
    'Once the king is out in the open, keep checking. Every check is a move your opponent can’t use to defend.',
    'A modern footnote: Black could have defused the whole attack twice, with 9…Bxe5 and 10…Bxe5. Removing an attacking piece is often the best defence.',
  ],
}
