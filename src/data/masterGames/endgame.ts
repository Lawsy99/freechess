// Capablanca v Tartakower, New York 1924. Moves as published (chessgames.com,
// from the tournament book; the ending matches published extracts). Notes our
// own, every claim checked against Stockfish 19 (depth 20+, three lines per
// position): scratch/report-endgame.txt.
import type { MasterGame } from './types'

export const ENDGAME: MasterGame = {
  id: 'endgame',
  title: 'The king walks in',
  white: 'José Raúl Capablanca',
  black: 'Savielly Tartakower',
  players: 'Capablanca v Tartakower',
  place: 'New York',
  year: 1924,
  result: '1-0',
  theme: 'Activity beats material in the ending',
  orientation: 'white',
  legend: 'capablanca',
  intro:
    'Capablanca was world champion and perhaps the greatest endgame player who ever lived. The first half of this game is a quiet Dutch Defence. The second half is one of the most famous endings in chess: Capablanca gives away two pawns so that his king can walk into Black’s position, and wins with a rook, a king and one pawn.',
  plans:
    'Watch for the moment the queens come off, at move 25. From there the game is about activity. Capablanca opens the h-file for his rook, puts it on the seventh rank, and then marches his king up the board behind a passed pawn, letting Black take pawns on the way. Material matters less than which pieces are doing something.',
  pgn: '1. d4 e6 2. Nf3 f5 3. c4 Nf6 4. Bg5 Be7 5. Nc3 O-O 6. e3 b6 7. Bd3 Bb7 8. O-O Qe8 9. Qe2 Ne4 10. Bxe7 Nxc3 11. bxc3 Qxe7 12. a4 Bxf3 13. Qxf3 Nc6 14. Rfb1 Rae8 15. Qh3 Rf6 16. f4 Na5 17. Qf3 d6 18. Re1 Qd7 19. e4 fxe4 20. Qxe4 g6 21. g3 Kf8 22. Kg2 Rf7 23. h4 d5 24. cxd5 exd5 25. Qxe8+ Qxe8 26. Rxe8+ Kxe8 27. h5 Rf6 28. hxg6 hxg6 29. Rh1 Kf8 30. Rh7 Rc6 31. g4 Nc4 32. g5 Ne3+ 33. Kf3 Nf5 34. Bxf5 gxf5 35. Kg3 Rxc3+ 36. Kh4 Rf3 37. g6 Rxf4+ 38. Kg5 Re4 39. Kf6 Kg8 40. Rg7+ Kh8 41. Rxc7 Re8 42. Kxf5 Re4 43. Kf6 Rf4+ 44. Ke5 Rg4 45. g7+ Kg8 46. Rxa7 Rg1 47. Kxd5 Rc1 48. Kd6 Rc2 49. d5 Rc1 50. Rc7 Ra1 51. Kc6 Rxa4 52. d6',
  chapters: [
    {
      ply: 52,
      title: 'The ending',
      text: 'Queens and a pair of rooks are gone: rook and bishop against rook and knight, with pawns level, and the engine calls White only a little better. Capablanca’s plan: open the h-file, get his rook to the seventh rank, then bring the king forward. In rook endings, activity is everything.',
    },
    {
      ply: 59,
      arrows: ['h7c7'],
      title: 'The seventh rank',
      text: 'The rook is on the seventh rank, behind Black’s pawns, attacking c7 and keeping Black’s king on the back row. A rook there ties down the whole Black army. Next, White’s kingside pawns and king come up to support it.',
    },
    {
      ply: 69,
      arrows: ['g3h4', 'h4g5', 'g5f6'],
      title: 'Activity over material',
      text: 'White has given the bishop for the knight, and Black is about to take the c-pawn and the f-pawn. Capablanca doesn’t mind: his king is heading for f6, behind the g-pawn, where with the rook on h7 it will trap Black’s king. Black’s extra pawns will be too slow to matter.',
    },
    {
      ply: 77,
      title: 'The winning set-up',
      text: 'King on f6, pawn on g6, rook on h7: Black’s king is boxed in on the back rank. Notice that White’s king walked past the f5 pawn instead of taking it: that pawn now shields it from rook checks from below. Black’s pawns will now fall one by one.',
    },
  ],
  notes: [
    // 1. d4
    'The queen’s pawn takes a share of the centre.',
    // 1... e6
    'A flexible reply. The f-pawn comes next.',
    // 2. Nf3
    'The knight develops and watches e5.',
    // 2... f5
    'The Dutch Defence: the f-pawn fights for e4. Ambitious, but it loosens Black’s kingside. 2…d5 or 2…Nf6 was slightly better.',
    // 3. c4
    'White takes more space. The engine’s choice.',
    // 3... Nf6
    'The knight develops and adds a guard to e4. The best move.',
    // 4. Bg5
    'The bishop pins the knight to the queen behind it. 4.g3 was the engine’s choice.',
    // 4... Be7
    'Black breaks the pin. 4…Bb4+ was slightly better.',
    // 5. Nc3
    'Another piece out. 5.e3 was just as good.',
    // 5... O-O
    'Black castles. The best move.',
    // 6. e3
    'White opens the way for the other bishop. The engine’s choice.',
    // 6... b6
    'Black prepares …Bb7, aiming at e4 and the long diagonal. The best move.',
    // 7. Bd3
    'The bishop develops, eyeing e4 and f5. The engine’s choice.',
    // 7... Bb7
    'The bishop takes the long diagonal. 7…c5 was slightly better.',
    // 8. O-O
    'White castles. The engine’s choice.',
    // 8... Qe8
    'A typical Dutch idea: the queen heads for h5 to attack the kingside. 8…c5 was better.',
    // 9. Qe2
    'The queen steps off the d-file and connects the rooks. 9.a3 was better.',
    // 9... Ne4
    'The knight jumps to e4, the square Black’s f-pawn fights for, and offers trades. The best move.',
    // 10. Bxe7
    'White trades bishops. The engine’s choice.',
    // 10... Nxc3
    'Black swaps knights first. Taking back at once with 10…Qxe7 was a little better.',
    // 11. bxc3
    'White takes back. The c-pawns are doubled, but the b-file opens for White’s rooks. The engine’s choice.',
    // 11... Qxe7
    'The queen takes back. The best move.',
    // 12. a4
    'White gains a little space on the queenside. 12.Rad1 was a touch better.',
    // 12... Bxf3
    'Black gives the bishop for the knight, so Black now has a knight against White’s bishop. 12…Nc6 was a little better.',
    // 13. Qxf3
    'Taking with the queen keeps White’s kingside pawns together. The engine’s choice.',
    // 13... Nc6
    'The last Black piece develops. The best move.',
    // 14. Rfb1
    'The rook takes the half-open b-file. 14.e4 was a little better.',
    // 14... Rae8
    'Black’s rook comes to the e-file.',
    // 15. Qh3
    'The queen eyes f5 and the kingside. 15.Rb2 was a little better.',
    // 15... Rf6
    'The rook can swing along the sixth rank. 15…Qf7 was better.',
    // 16. f4
    'White fixes Black’s f-pawn and takes e5 under control.',
    // 16... Na5
    'The knight hits the pawn on c4. The best move.',
    // 17. Qf3
    'The queen comes back to the centre.',
    // 17... d6
    'Black stops e5 for good. 17…c5 was better.',
    // 18. Re1
    'The rook backs up the coming e4 break. The engine’s choice.',
    // 18... Qd7
    'The queen steps off the e-file.',
    // 19. e4
    'The break: White opens the e-file. The engine’s choice.',
    // 19... fxe4
    'Black takes. The best move.',
    // 20. Qxe4
    'The queen takes back. 20.Rxe4 was a little better.',
    // 20... g6
    'Black blocks the diagonal from White’s queen and bishop to h7. The best move.',
    // 21. g3
    'A quiet move. 21.h4 was slightly better.',
    // 21... Kf8
    'The king steps towards the centre. 21…Kg7 was a little better.',
    // 22. Kg2
    'White’s king steps up too. 22.Qe3 was better.',
    // 22... Rf7
    'The rook guards the second rank. 22…e5 was better.',
    // 23. h4
    'White starts to use the kingside pawns. The engine’s choice.',
    // 23... d5
    'A mistake: it lets White trade queens into an ending that suits White. 23…Nxc4 was the engine’s choice.',
    // 24. cxd5
    'White takes. The engine’s choice.',
    // 24... exd5
    'Black takes back. The best move.',
    // 25. Qxe8+
    'White’s queen takes the rook, and everything on the e-file comes off. The engine’s choice.',
    // 25... Qxe8
    'Black takes back. The best move.',
    // 26. Rxe8+
    'White takes the queen. The engine’s choice.',
    // 26... Kxe8
    'Material is level: rook and bishop against rook and knight.',
    // 27. h5
    'The key idea: open the h-file so White’s rook can get into Black’s position. 27.Rh1 was just as good.',
    // 27... Rf6
    'Black guards the sixth rank. The best move.',
    // 28. hxg6
    'White opens the h-file.',
    // 28... hxg6
    'Black takes back. 28…Rxg6 would lose the rook to 29.Bxg6+.',
    // 29. Rh1
    'The rook takes the open h-file. The engine’s choice.',
    // 29... Kf8
    'The king guards the back rank. The best move.',
    // 30. Rh7
    'The rook reaches the seventh rank, attacking c7 and a7. A rook on the seventh is one of the strongest things in an ending. The engine’s choice.',
    // 30... Rc6
    'The rook defends c7 and attacks the pawn on c3. The best move.',
    // 31. g4
    'The kingside pawns move up to support the rook. 31.Rd7 was a little better.',
    // 31... Nc4
    'The knight heads for e3. 31…Nb3 was a touch better.',
    // 32. g5
    'The pawn takes f6 and h6 away from Black’s pieces. 32.Kf2 was about the same.',
    // 32... Ne3+
    'The knight checks. The best move.',
    // 33. Kf3
    'The king steps up. The engine’s choice.',
    // 33... Nf5
    'The decisive mistake, though a natural one: the knight looks good on f5, but now White can change the whole position. 33…Nd1, going after the c-pawn, was the defence.',
    // 34. Bxf5
    'Bishop for knight, and Black must take back with the g-pawn. Capablanca sees that the rook ending, with his king walking in, is winning. The engine’s choice by a long way.',
    // 34... gxf5
    'Black takes back. The best move.',
    // 35. Kg3
    'The point. The king heads for h4 and then f6, and the c-pawn is left to its fate. Activity over material. The engine’s choice.',
    // 35... Rxc3+
    'Black takes a pawn with check. 35…a6 was about the same.',
    // 36. Kh4
    'The king marches on. The engine’s choice.',
    // 36... Rf3
    'A mistake: Black goes after the f4 pawn, but White’s g-pawn will run. 36…a6 was better.',
    // 37. g6
    'The passed pawn runs, and White lets a second pawn go: if Black takes on f4, it’s with check, but the king just comes closer. The engine’s choice.',
    // 37... Rxf4+
    'Black takes the second pawn. The best move.',
    // 38. Kg5
    'The king comes up behind the pawn. The engine’s choice.',
    // 38... Re4
    'The rook cuts the king off along the fourth rank. 38…Rxd4 was a little better.',
    // 39. Kf6
    'The winning set-up: king on f6, pawn on g6, rook on h7. The engine’s choice.',
    // 39... Kg8
    'Black’s king tries to hold the corner. The best move.',
    // 40. Rg7+
    'The rook checks, on its way to collect the queenside pawns. The engine’s choice.',
    // 40... Kh8
    'The king hides in the corner. 40…Kf8 was a little more stubborn.',
    // 41. Rxc7
    'The rook eats the pawns on the seventh rank. The engine’s choice.',
    // 41... Re8
    'Black must watch for mate: 41…Re6+ 42.Kxe6 and 41…Re5 42.dxe5 both lose to a quick mate on the back rank. The best move.',
    // 42. Kxf5
    'Now the king takes, its job done. The engine’s choice.',
    // 42... Re4
    'The rook keeps checking from behind. 42…a5 was slightly better.',
    // 43. Kf6
    'Back to f6. The engine’s choice.',
    // 43... Rf4+
    'A check. The best move.',
    // 44. Ke5
    'The king goes after the d5 pawn. The engine’s choice.',
    // 44... Rg4
    'The rook attacks the g-pawn. The best move.',
    // 45. g7+
    'The pawn advances with check. The engine’s choice.',
    // 45... Kg8
    'Black blocks the pawn with the king. 45…Rxg7 was more stubborn, though still lost.',
    // 46. Rxa7
    'Another pawn falls. The engine’s choice.',
    // 46... Rg1
    'The rook heads round to harass the king.',
    // 47. Kxd5
    'The king takes the d5 pawn, and now White has a passed d-pawn too. The engine’s choice.',
    // 47... Rc1
    'The rook cuts the king off along the c-file.',
    // 48. Kd6
    'The king supports the d-pawn. As good as anything.',
    // 48... Rc2
    'Black waits.',
    // 49. d5
    'The d-pawn starts to run.',
    // 49... Rc1
    'Black waits again.',
    // 50. Rc7
    'The rook takes the c-file from Black’s rook. 50.Re7 was a touch better.',
    // 50... Ra1
    'The rook goes after the a-pawn.',
    // 51. Kc6
    'The king clears the way for the d-pawn.',
    // 51... Rxa4
    'Black takes the last White pawn on the queenside.',
    // 52. d6
    'The d-pawn runs, and with the g7 pawn tying Black’s king down, nothing can stop it. Tartakower resigned.',
  ],
  stops: [
    {
      ply: 66,
      prompt: 'Black’s knight has just come to f5. Your bishop could take it. Should it?',
      options: [
        {
          san: 'Bxf5',
          best: true,
          text: 'Yes: after 34…gxf5 your king can walk in through g3 and h4, and the rook ending is winning. The engine rates White clearly better.',
        },
        {
          san: 'Ke2',
          text: 'After 34…Rxc3 your king is too far from the action, and White is only a little better.',
        },
        {
          san: 'Kg4',
          text: 'The knight comes back with 34…Ne3+ and goes after c3. White is only slightly better.',
        },
      ],
    },
    {
      ply: 68,
      prompt: 'Black is about to take your c-pawn with check. Where should your king go?',
      options: [
        {
          san: 'Kg3',
          best: true,
          text: 'Towards h4, h5 and f6. Let the c-pawn go: the king is worth more in the attack. The engine’s choice by a long way.',
        },
        {
          san: 'Ke2',
          text: 'After 35…Rxc3 the king is too passive, and White is only slightly better.',
        },
        {
          san: 'Kg2',
          text: 'After 35…Rxc3 the king is out of play, and White is only slightly better.',
        },
      ],
    },
    {
      ply: 72,
      prompt: 'Black’s rook is attacking your f-pawn. Defend it, or push?',
      options: [
        {
          san: 'g6',
          best: true,
          text: 'Push! If 37…Rxf4+, the king follows with 38.Kg5 and the pawn keeps running. The engine rates White winning.',
        },
        {
          san: 'Kh5',
          text: 'Too slow: after 37…Rxf4 Black’s rook is active, and White is better but not winning.',
        },
        {
          san: 'Rxc7',
          text: 'It grabs a pawn, but after 37…Rxf4+ Black’s rook gets behind your pawns, and White is only slightly better.',
        },
      ],
    },
    {
      ply: 76,
      prompt: 'Black’s rook has cut off your king along the fourth rank. Where does the king go?',
      options: [
        {
          san: 'Kf6',
          best: true,
          text: 'Into the winning set-up: king on f6, pawn on g6, rook on h7. Black’s king is trapped on the back rank.',
        },
        {
          san: 'Rd7',
          text: 'It goes after d5, but 39…f4 gives Black counterplay. White is better, not winning.',
        },
        {
          san: 'Rh8+',
          text: 'A check, but after 39…Kg7 Black’s king escapes the box. White is only better.',
        },
      ],
    },
  ],
  ending: 'Tartakower resigned.',
  lessons: [
    'In the ending, activity beats material. Capablanca gave two pawns to get his king and rook into Black’s position.',
    'Rooks belong on open files and on the seventh rank. White opened the h-file just to get the rook to h7.',
    'The king is a fighting piece in the ending: White’s king walked from g2 to f6, and later to d5 and c6.',
    'A passed pawn supported by the king and rook is very hard to stop.',
  ],
}
