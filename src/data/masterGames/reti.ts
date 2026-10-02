// Réti v Tartakower, Vienna 1910. Moves as published (Wikipedia), replayed by
// the rules. Notes our own, every claim checked against Stockfish 19 (depth
// 20+, three lines per position): scratch/report-reti.txt.
import type { MasterGame } from './types'

export const RETI: MasterGame = {
  id: 'reti',
  title: 'Mate on the open file',
  white: 'Richard Réti',
  black: 'Savielly Tartakower',
  place: 'Vienna',
  year: 1910,
  result: '1-0',
  theme: 'Don’t open the centre with your king in it',
  orientation: 'white',
  intro:
    'Réti and Tartakower became two of the great thinkers and writers of chess. This game, from Vienna in 1910, lasts eleven moves and is the classic example of a king caught on an open file.',
  plans:
    'Black chooses the solid Caro-Kann Defence, and for four moves all is well. Then Black opens the centre while the king is still on e8. The plan to watch: White answers by castling queenside, which puts a rook straight onto the open d-file, aimed at the square next to Black’s king.',
  pgn: '1. e4 c6 2. d4 d5 3. Nc3 dxe4 4. Nxe4 Nf6 5. Qd3 e5 6. dxe5 Qa5+ 7. Bd2 Qxe5 8. O-O-O Nxe4 9. Qd8+ Kxd8 10. Bg5+ Kc7 11. Bd8#',
  chapters: [
    {
      ply: 10,
      title: 'Opening the centre',
      text: 'Black has just struck in the centre, but Black’s king is still on e8 and only one Black piece is developed. Opening the centre helps the side that is better developed and whose king is safer. White’s plan: open the d-file, castle queenside, and put a rook opposite Black’s king.',
    },
    {
      ply: 15,
      title: 'The open file',
      text: 'White’s king is safe on c1, and the rook on d1 looks straight down the open d-file at d8, the square next to Black’s king. Black needs to get castled, or at least cover d8, before anything else.',
    },
  ],
  notes: [
    // 1. e4
    'The king’s pawn opens lines for the queen and bishop and claims the centre.',
    // 1... c6
    'The Caro-Kann Defence. Black prepares …d5 with a pawn behind it: solid and safe.',
    // 2. d4
    'White takes the whole centre. The engine’s choice.',
    // 2... d5
    'Black challenges the pawn on e4 at once.',
    // 3. Nc3
    'The knight defends e4. The engine slightly prefers 3.e5, but this is the main line.',
    // 3... dxe4
    'Black gives up the centre to free the pieces. The engine’s choice.',
    // 4. Nxe4
    'The knight takes back and stands proudly in the centre.',
    // 4... Nf6
    'Black develops and challenges the knight. The best move.',
    // 5. Qd3
    'An unusual move. The queen defends the knight, so …Nxe4 can be met by Qxe4, and she stands on the d-file. For now White’s own pawn on d4 blocks that file. The engine slightly prefers 5.Nxf6+, but this is fine.',
    // 5... e5
    'The mistake that starts it all. Black strikes in the centre to free the game, but it opens lines while Black’s king is still on e8, and after dxe5 the d-file will be open. 5…Nxe4, trading knights, was the engine’s choice.',
    // 6. dxe5
    'White takes the pawn, and the d-file is open, queen facing queen. The engine’s choice.',
    // 6... Qa5+
    'Black checks to win the pawn back, but the queen leaves d8, where she guarded the d-file. 6…Qxd3, trading queens, was best: without queens, Black’s king in the centre would be safe.',
    // 7. Bd2
    'White blocks the check with a developing move. The engine’s choice.',
    // 7... Qxe5
    'Black wins the pawn back, and now White’s knight on e4 is pinned: it can’t move without exposing White’s king on e1.',
    // 8. O-O-O
    'The answer to the pin, and much more. White’s king leaves the e-file, so the knight is free again, and the rook lands on d1, on the open file. The engine’s choice.',
    // 8... Nxe4
    'Black takes the knight, which looks like a fair trade. But it moves the knight off f6, where it was blocking the diagonal from g5 to d8, and Black’s king is still on e8 with the d-file open. 8…Be7, developing and getting ready to castle, kept Black in the game.',
    // 9. Qd8+
    'The queen sacrifice. Black has to take her, and the king is pulled onto the open file.',
    // 9... Kxd8
    'Forced: nothing else can deal with the check.',
    // 10. Bg5+
    'Double check: the bishop checks from g5 and the rook checks from d1. Against a double check, the king has to move.',
    // 10... Kc7
    'Going back with 10…Ke8 allows 11.Rd8 mate.',
    // 11. Bd8#
    'Checkmate. The bishop checks from d8, protected by the rook on d1, and Black’s own pieces on b8, c8, b7 and c6 hem the king in. A king in the centre, an open file, and a rook on it: that was all it took.',
  ],
  stops: [
    {
      ply: 14,
      prompt: 'Your knight on e4 is pinned to your king by Black’s queen. How do you deal with it?',
      options: [
        {
          san: 'O-O-O',
          best: true,
          text: 'Castling unpins the knight, makes your king safe and puts the rook on the open d-file, three jobs in one move. The engine’s choice by a long way.',
        },
        {
          san: 'f3',
          text: 'It supports the knight, but after 8…Nxe4 9.Qxe4 Qxe4+ the queens come off and the game is level.',
        },
        {
          san: 'Qg3',
          text: 'The queen leaves the knight undefended, and 8…Qxe4+ wins it with check.',
        },
      ],
    },
    {
      ply: 16,
      prompt: 'Black has just taken your knight. There’s a mate in three, and it starts with a sacrifice. Can you find it?',
      options: [
        {
          san: 'Qd8+',
          best: true,
          text: 'The queen sacrifice. After 9…Kxd8 10.Bg5+ is a double check, and 11.Bd8 is mate.',
        },
        {
          san: 'Re1',
          text: 'It pins Black’s knight again, and White is still a little better. But there was a mate.',
        },
        {
          san: 'Nf3',
          text: 'Develops, but it lets Black consolidate, and the engine says Black is better.',
        },
      ],
    },
  ],
  ending: 'Black is checkmated.',
  lessons: [
    'Don’t open the centre while your king is still in it, especially when your opponent is better developed.',
    'Open files lead to kings. When a file opens towards your king, cover it or castle at once.',
    'Look for moves that do several jobs: 8.O-O-O unpinned the knight, saved the king and brought the rook to the open file.',
  ],
}
