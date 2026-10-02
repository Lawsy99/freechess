// Morphy's Opera Game, Paris 1858. Moves as published (Wikipedia, "Opera
// Game"), replayed by the rules. Notes our own, every claim checked against
// Stockfish 19 (depth 20+, three lines per position): scratch/report-opera.txt.
import type { MasterGame } from './types'

export const OPERA: MasterGame = {
  id: 'opera',
  title: 'The Opera Game',
  white: 'Paul Morphy',
  black: 'Duke Karl of Brunswick and Count Isouard',
  players: 'Morphy v the Duke and the Count',
  place: 'Paris',
  year: 1858,
  result: '1-0',
  theme: 'Develop fast, open lines, attack the king',
  orientation: 'white',
  legend: 'morphy',
  intro:
    'Morphy played this in a box at the Paris opera, against two noblemen consulting together, during a performance of The Barber of Seville. It lasts 17 moves and is the most taught game in chess, because it shows one idea perfectly: what a lead in development is worth.',
  plans:
    'Black chooses a solid but passive defence and then spends moves on the wrong piece. Watch the race to get pieces out. White’s plan is simple: develop every piece with a threat, open lines towards Black’s king before it can castle, and strike while Black is still catching up.',
  pgn: '1. e4 e5 2. Nf3 d6 3. d4 Bg4 4. dxe5 Bxf3 5. Qxf3 dxe5 6. Bc4 Nf6 7. Qb3 Qe7 8. Nc3 c6 9. Bg5 b5 10. Nxb5 cxb5 11. Bxb5+ Nbd7 12. O-O-O Rd8 13. Rxd7 Rxd7 14. Rd1 Qe6 15. Bxd7+ Nxd7 16. Qb8+ Nxb8 17. Rd8#',
  chapters: [
    {
      ply: 10,
      title: 'A lead in development',
      text: 'Count the pieces in play. White’s queen is already active and two more pieces are ready to come out. Black’s only developed piece, the bishop, has gone, and Black’s king will need several moves to castle. White’s plan: use every move to bring a piece out with a threat, so Black never gets a free move to catch up.',
    },
    {
      ply: 18,
      title: 'Time to open lines',
      text: 'Black has just weakened the pawns in front of the queenside, and the king is still on e8. When you are far ahead in development and the enemy king is in the centre, the right plan is to open lines at once, even if it costs material, before the opponent gets organised.',
    },
    {
      ply: 23,
      title: 'Pile up on the pin',
      text: 'Black’s knight on d7 is pinned: it can’t move without exposing the king. A pinned piece is a target. White’s plan now is to attack it again and again, faster than Black can defend it.',
    },
  ],
  notes: [
    // 1. e4
    'The king’s pawn opens lines for the queen and the light-squared bishop, and takes a share of the centre.',
    // 1... e5
    'Black matches it in the centre.',
    // 2. Nf3
    'A knight out towards the centre, with a threat: the pawn on e5.',
    // 2... d6
    'This is Philidor’s Defence. It guards e5 solidly, but it is a little passive: the pawn shuts in the bishop on f8. The engine prefers 2…Nc6, defending while developing a piece.',
    // 3. d4
    'Straight into the centre. Now e5 is attacked twice and Black has to decide what to do about it. Morphy’s style in one move: open the position while the opponent’s pieces are still at home.',
    // 3... Bg4
    'Black pins the knight that attacks e5. It looks active, but it’s the start of Black’s problems: this bishop is about to be traded, and the moves spent on it are moves not spent on development. 3…Nf6 or 3…exd4 kept Black close to level.',
    // 4. dxe5
    'Morphy takes. The engine slightly prefers quiet development with 4.Be3, but this forces the issue at once.',
    // 4... Bxf3
    'Black gives up the bishop for the knight. Taking back with 4…dxe5 would lose a pawn: 5.Qxd8+ Kxd8 6.Nxe5, and the knight also hits the bishop on g4 and the pawn on f7. But 4…Nc6 was better than this, keeping the bishop and developing. Now Black has spent two moves with the bishop just to trade it.',
    // 5. Qxf3
    'The queen takes back and is already in the game. Taking with the pawn would ruin White’s kingside pawns for nothing.',
    // 5... dxe5
    'Black wins the pawn back. Material is level, but look at the board: White has a queen out and is ready to develop the rest, while Black has nothing developed at all.',
    // 6. Bc4
    'Develops with a threat. The queen and bishop both aim at f7, the weak spot next to Black’s king that only the king defends, and Qxf7+ is coming.',
    // 6... Nf6
    'Natural, and it blocks the queen’s path to f7. But it’s Black’s first real mistake: it leaves b7 and f7 both loose, and White has a move that hits them together. 6…Qf6 or 6…Qd7, guarding f7 with the queen, held much better.',
    // 7. Qb3
    'Two targets at once. The queen lines up behind the bishop, so f7 is attacked twice, and she also attacks the pawn on b7.',
    // 7... Qe7
    'Black guards f7 and keeps the queen close to the king. 7…Bc5 was about as good.',
    // 8. Nc3
    'Pure Morphy. Instead of grabbing the free pawn on b7, he brings another piece into the game. A modern footnote: Stockfish prefers 8.Qxb7, when 8…Qb4+ 9.Qxb4 Bxb4+ leaves White a pawn up and clearly better in the endgame. Morphy wanted to keep the queens on and attack. Development is powerful, but a free pawn is a free pawn.',
    // 8... c6
    'Black guards the light squares d5 and b5 against White’s knight. The best move here.',
    // 9. Bg5
    'Another piece joins with a threat: the bishop pins the knight on f6 to Black’s queen on e7. White has now developed knight, both bishops and queen; Black has a knight and a queen out, and they are tied to defence.',
    // 9... b5
    'A serious mistake. Black wants to chase the bishop off its diagonal, but this opens the queenside while the king is still in the centre. 9…Na6, developing a piece, was the way to fight on.',
    // 10. Nxb5
    'Morphy gives a knight for two pawns to rip open the lines to Black’s king. He doesn’t need to calculate everything: he can see that every White piece will join the attack, while most of Black’s are still at home.',
    // 10... cxb5
    'Black takes the knight, which is natural and wrong. 10…Qb4+, forcing the queens off, was the best defence: without queens, an attack loses most of its force.',
    // 11. Bxb5+
    'Check, and the pawn is gone too. Now the bishop pins whatever blocks on d7 to Black’s king.',
    // 11... Nbd7
    'The knight blocks the check and develops, but it lands on a pinned square.',
    // 12. O-O-O
    'Castling with an attack: the king walks to safety and the rook arrives on the open d-file, where it hits the pinned knight on d7. Every one of White’s pieces is now in the attack.',
    // 12... Rd8
    'Black adds another defender to d7. 12…Rb8, chasing the bishop, was slightly better, but by now Black is lost whatever happens.',
    // 13. Rxd7
    'Morphy gives the rook for the knight to break the defence of d7 apart. Material no longer matters: what matters is that Black’s pieces can’t get to the king’s defence in time.',
    // 13... Rxd7
    'Black takes back with the rook, which leaves that rook pinned in turn. 13…Nxd7 kept a little more resistance.',
    // 14. Rd1
    'The second rook replaces the first. The pinned rook on d7 is attacked twice more, and Black runs out of ways to hold it.',
    // 14... Qe6
    'Black offers to trade queens. But on e6 the queen no longer guards d8, and she doesn’t watch b8 either: those are exactly the squares White needs. 14…Qd6, keeping an eye on b8, was the best defence.',
    // 15. Bxd7+
    'Bishop takes rook, with check. Every answer loses.',
    // 15... Nxd7
    'The fatal choice: now it’s mate in two. Taking back with the queen, 15…Qxd7, was the only way to avoid a forced mate, though White would still be winning.',
    // 16. Qb8+
    'The famous queen sacrifice. The queen offers herself on b8 so that Black’s knight has to leave d7, and the d-file opens for the rook.',
    // 16... Nxb8
    'Forced: it’s the only legal move.',
    // 17. Rd8#
    'Checkmate. The rook gives check on d8, protected by the bishop on g5, and Black’s own pieces block the king’s escape. White has only a rook and a bishop left, and they are enough, because they are the active ones.',
  ],
  stops: [
    {
      ply: 18,
      prompt: 'Black’s king is still in the centre and you’re far ahead in development. What would you play?',
      options: [
        {
          san: 'Nxb5',
          best: true,
          text: 'A knight for two pawns, and the lines to Black’s king are open. The engine rates White close to winning after this, far ahead of anything else.',
        },
        {
          san: 'Bxf6',
          text: 'Sensible, and White is still better. But after 10…Qxf6 Black’s queen joins the defence and much of the pressure is gone.',
        },
        {
          san: 'Be2',
          text: 'Too passive. Retreating gives Black the time to finish developing, and the advantage almost disappears.',
        },
      ],
    },
    {
      ply: 22,
      prompt: 'Black’s knight on d7 is pinned to the king by your bishop on b5. How do you add to the pressure?',
      options: [
        {
          san: 'O-O-O',
          best: true,
          text: 'Castling with an attack: your king gets safe and the rook lands on the open d-file, attacking the pinned knight in the same move.',
        },
        {
          san: 'Bxf6',
          text: 'Still winning, but 12…Qb4+ forces the queens off and the attack is over. Castling keeps the queens on and wins far more quickly.',
        },
        {
          san: 'Rd1',
          text: 'The rook gets to d1, but your king stays in the middle and Black gets time for …Rb8 and …Qb4. Better for White, but far less than castling.',
        },
      ],
    },
    {
      ply: 30,
      prompt: 'There’s a forced checkmate. Can you find the first move?',
      options: [
        {
          san: 'Qb8+',
          best: true,
          text: 'The queen sacrifice! After 16…Nxb8 the knight has left d7, and 17.Rd8 is checkmate.',
        },
        {
          san: 'Qb7',
          text: 'Still winning comfortably, but it lets the checkmate slip.',
        },
        {
          san: 'Qc3',
          text: 'Also winning, but slow. There’s something far better.',
        },
      ],
    },
  ],
  ending: 'Black is checkmated.',
  lessons: [
    'Develop with threats. Bc4, Qb3 and Bg5 each came with an attack, so Black spent every move reacting instead of developing.',
    'Don’t waste time in the opening. Black moved one bishop twice just to trade it, and never caught up.',
    'When you’re far ahead in development and the enemy king is in the centre, open lines at once, even at the cost of material.',
    'A pinned piece is a target: attack it again and again, faster than it can be defended.',
    'A modern footnote: the engine shows Morphy could simply have won a pawn on move 8. The attacking way isn’t the only way to win.',
  ],
}
