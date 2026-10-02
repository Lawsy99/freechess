// Lasker v Capablanca, St Petersburg 1914. Moves as published (chessgames.com,
// matched move for move against the German Wikipedia article), replayed by the
// rules. Notes our own, every claim checked against Stockfish 19 (depth 20+,
// three lines per position): scratch/report-laskercapa.txt.
import type { MasterGame } from './types'

export const LASKERCAPA: MasterGame = {
  id: 'laskercapa',
  title: 'The hole on e6',
  white: 'Emanuel Lasker',
  black: 'José Raúl Capablanca',
  players: 'Lasker v Capablanca',
  place: 'St Petersburg',
  year: 1914,
  result: '1-0',
  theme: 'Pawn structure, outposts and a second front',
  orientation: 'white',
  legend: 'lasker',
  intro:
    'Two world champions: Lasker, champion at the time, and Capablanca, who would take the title from him in 1921. Lasker was chasing Capablanca in the tournament and needed to win, yet he chose a quiet opening and traded queens on move 6. This is how to win a game without an attack: with pawn structure, a knight on a perfect square, and patience. Lasker won and finished ahead of Capablanca.',
  plans:
    'After the early queen trade it’s a question of trumps. White has the healthier pawns: four against three on the kingside, which can make a passed pawn. Black has the two bishops. Watch Lasker take away Black’s trumps one by one: a pawn move that leaves a permanent hole on e6, a knight planted there, a trade of bishops, and then a second front on the kingside, where his king and pawns march up and open a file for his rooks.',
  pgn: '1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 4. Bxc6 dxc6 5. d4 exd4 6. Qxd4 Qxd4 7. Nxd4 Bd6 8. Nc3 Ne7 9. O-O O-O 10. f4 Re8 11. Nb3 f6 12. f5 b6 13. Bf4 Bb7 14. Bxd6 cxd6 15. Nd4 Rad8 16. Ne6 Rd7 17. Rad1 Nc8 18. Rf2 b5 19. Rfd2 Rde7 20. b4 Kf7 21. a3 Ba8 22. Kf2 Ra7 23. g4 h6 24. Rd3 a5 25. h4 axb4 26. axb4 Rae7 27. Kf3 Rg8 28. Kf4 g6 29. Rg3 g5+ 30. Kf3 Nb6 31. hxg5 hxg5 32. Rh3 Rd7 33. Kg3 Ke8 34. Rdh1 Bb7 35. e5 dxe5 36. Ne4 Nd5 37. N6c5 Bc8 38. Nxd7 Bxd7 39. Rh7 Rf8 40. Ra1 Kd8 41. Ra8+ Bc8 42. Nc5',
  chapters: [
    {
      ply: 13,
      title: 'Whose trumps count?',
      text: 'Queens are off after seven moves. White’s four pawns against three on the kingside can make a passed pawn; Black’s extra queenside pawn is doubled and can’t easily do the same. Black’s trump is the pair of bishops, which love open positions. White’s plan: advance the kingside pawns, keep the position closed for the bishops, and trade one of them off.',
    },
    {
      ply: 23,
      arrows: ['b3d4', 'd4e6'],
      title: 'The hole on e6',
      text: 'With f5, White has given up the e5 square and left the e-pawn behind. In return, e6 is now a hole: with Black’s d-pawn gone and the f-pawn on f6, no Black pawn can ever cover it. And the pawn on f5 blocks the bishop on c8. White’s plan: get a knight to e6.',
    },
    {
      ply: 45,
      title: 'A second front',
      text: 'The queenside is locked, and Black’s pieces are tied to the weak pawn on d6 and to the knight on e6. Now White opens a second front: the kingside pawns, backed by the king, will open the h-file for the rooks. One weakness can be defended; two usually can’t.',
    },
    {
      ply: 69,
      title: 'The breakthrough',
      text: 'White gives the e-pawn to open lines for the knights. White’s rooks already own the h-file, and Black’s pieces are spread out defending. Now everything joins the attack.',
    },
  ],
  notes: [
    // 1. e4
    'The king’s pawn opens lines for the queen and bishop and claims the centre.',
    // 1... e5
    'Black answers in kind.',
    // 2. Nf3
    'A knight out, attacking e5.',
    // 2... Nc6
    'The knight defends e5.',
    // 3. Bb5
    'The Ruy Lopez, or Spanish Game: the bishop attacks the knight that defends e5. The most respected of the old openings.',
    // 3... a6
    'Black asks the bishop at once.',
    // 4. Bxc6
    'The Exchange Variation. White gives up the bishop pair to damage Black’s pawns. The engine slightly prefers 4.Ba4, but Lasker wanted a particular kind of game: simple, with clear pawn structures.',
    // 4... dxc6
    'Taking with the d-pawn opens the d-file and frees the bishop on c8. The best move.',
    // 5. d4
    'White opens the centre at once, heading for an ending. The engine rates it the same as the modern 5.O-O.',
    // 5... exd4
    'Black takes. The best move.',
    // 6. Qxd4
    'White offers to trade queens. The engine’s choice.',
    // 6... Qxd4
    'Black accepts. Capablanca, the great endgame player, was happy to simplify. The best move.',
    // 7. Nxd4
    'Queens are off. Now pawn structure matters more than anything: White’s kingside majority is healthy, Black’s queenside one is crippled by the doubled c-pawns. The engine’s choice.',
    // 7... Bd6
    'The bishop develops. 7…Bd7, keeping the option of castling queenside, was a touch better.',
    // 8. Nc3
    'Another piece out. 8.Be3 was a touch better.',
    // 8... Ne7
    'The knight develops. The best move.',
    // 9. O-O
    'White castles. 9.Bg5 or 9.Be3 was a shade better.',
    // 9... O-O
    'Black castles too. 9…Bd7 was a shade better.',
    // 10. f4
    'White sets the kingside majority moving, gaining space and threatening e5 against the bishop. 10.Rd1 was a touch better.',
    // 10... Re8
    'The rook goes opposite the e4 pawn, so e5 is harder to play. The best move.',
    // 11. Nb3
    'The knight steps back, out of reach of …c5. 11.Nf3 was a little better.',
    // 11... f6
    'Black stops e5 for good, but it costs a square: e6 can never be guarded by a pawn again. 11…b6 was better.',
    // 12. f5
    'The famous move. It looks wrong: the e4 pawn is now left behind, and Black gets the e5 square. But it makes e6 a permanent hole and shuts in Black’s bishop on c8. The engine agrees it’s the best move.',
    // 12... b6
    'Black prepares …Bb7, to get the bishop out another way. 12…c5 was about as good.',
    // 13. Bf4
    'White offers to trade the dark-squared bishops. Without one of them, Black’s bishop pair is gone. The engine’s choice.',
    // 13... Bb7
    'A mistake: after 14.Bxd6 Black has to take back with the c-pawn and is left with a weak pawn on d6. 13…Bxf4 was the engine’s choice.',
    // 14. Bxd6
    'White trades. The engine’s choice.',
    // 14... cxd6
    'The only good way to take back. Now d6 is a weak pawn that White’s rooks can attack.',
    // 15. Nd4
    'The knight heads for e6, the hole made by 11…f6. The engine’s choice.',
    // 15... Rad8
    'Black brings the last rook to the d-file. 15…Bc8, guarding e6, was the right idea.',
    // 16. Ne6
    'The knight lands on e6, attacking the rook on d8. No pawn can drive it away, and Black’s light-squared bishop, the only piece that could swap it off, is shut in behind its own pawns. The engine’s choice.',
    // 16... Rd7
    'The rook steps off d8. The best move.',
    // 17. Rad1
    'The rook comes to the d-file to attack the weak pawn on d6. The engine’s choice.',
    // 17... Nc8
    'The knight comes back to defend d6. 17…c5 was slightly better.',
    // 18. Rf2
    'Preparing to double rooks on the d-file. 18.b3 or 18.g4 was a little better.',
    // 18... b5
    'Black gains space on the queenside. 18…d5, freeing the position, was better.',
    // 19. Rfd2
    'Both rooks now press on d6, and Black’s pieces are tied to defending it. The engine’s choice.',
    // 19... Rde7
    'Black’s rooks go to the e-file, opposite the knight.',
    // 20. b4
    'White fixes the pawn on b5, so it can’t advance to b4 and chase the knight on c3. The engine’s choice.',
    // 20... Kf7
    'The king steps up to help against the knight on e6. 20…h5, stopping g4, was a little better.',
    // 21. a3
    'A small useful move. 21.Rd3 was a touch better.',
    // 21... Ba8
    'The bishop has nothing to do. The engine shows Black’s best chance was 21…Rxe6!, giving a rook for the knight just to be rid of it. Without that knight, Black’s position would breathe.',
    // 22. Kf2
    'The king heads for the centre, as kings should in endings. 22.g4 was the engine’s choice.',
    // 22... Ra7
    'The rook can swing along the seventh rank. 22…h5, stopping g4, was better.',
    // 23. g4
    'The kingside majority rolls forward. The plan: g5, open lines near Black’s king, and bring the rooks across. The engine’s choice.',
    // 23... h6
    'Black guards g5. 23…g6 was slightly better.',
    // 24. Rd3
    'The rook prepares to swing to the kingside. 24.h4 at once was stronger.',
    // 24... a5
    'Black looks for play on the queenside. 24…Rae7 was better.',
    // 25. h4
    'Now h4 and g5 will open the kingside. The engine’s choice.',
    // 25... axb4
    'Black opens the a-file.',
    // 26. axb4
    'White takes back. The engine’s choice.',
    // 26... Rae7
    'The rook comes back to the e-file.',
    // 27. Kf3
    'The king heads for f4 to support the pawns. 27.g5 at once was a bit stronger.',
    // 27... Rg8
    'Black prepares …g6 or …g5 to fight back on the kingside.',
    // 28. Kf4
    'The king marches up behind its pawns. In an ending, the king is a fighting piece.',
    // 28... g6
    'Black tries to break White’s pawn chain. 28…Rh8 was better.',
    // 29. Rg3
    'The rook guards g4. 29.g5! was stronger, the engine says.',
    // 29... g5+
    'Black closes the kingside, hoping to keep it shut. 29…Rh8 was better.',
    // 30. Kf3
    'The king steps back; the h-file is about to open. The engine’s choice.',
    // 30... Nb6
    'A serious mistake. The knight leaves the defence of d6 and wanders to the queenside, while the h-file opens. 30…Rge8 was better.',
    // 31. hxg5
    'White opens the h-file. The engine’s choice.',
    // 31... hxg5
    'Black takes back. 31…fxg5 was about the same.',
    // 32. Rh3
    'The rook takes the open h-file. The engine’s choice.',
    // 32... Rd7
    'The rook defends d6.',
    // 33. Kg3
    'A quiet king move, tucking the king in behind its pawns before the rooks invade. The engine’s choice.',
    // 33... Ke8
    'Black’s king leaves the kingside, where the h-file is open. 33…Na4 was a bit better.',
    // 34. Rdh1
    'Both rooks on the h-file. 34.e5! at once was even stronger.',
    // 34... Bb7
    'The bishop finally tries to come into play. 34…c5 or 34…d5 was better.',
    // 35. e5
    'The breakthrough. White gives the backward e-pawn to open lines for the knights. The engine’s choice.',
    // 35... dxe5
    'Black takes. 35…c5 was about the same.',
    // 36. Ne4
    'The second knight joins, heading for d6, c5 and f6. The engine’s choice.',
    // 36... Nd5
    'The knight comes to the centre. The best move.',
    // 37. N6c5
    'The knight attacks the rook on d7 and the bishop on b7. 37.Rh6 was a little stronger.',
    // 37... Bc8
    'The bishop guards the rook. 37…Re7 was better.',
    // 38. Nxd7
    'White wins the exchange: a knight for a rook. The engine’s choice.',
    // 38... Bxd7
    'Black takes back. 38…Kxd7 was a little better.',
    // 39. Rh7
    'A rook on the seventh rank, attacking the bishop and hemming in Black’s king. The engine’s choice.',
    // 39... Rf8
    'Black defends. 39…Kd8 was a little better.',
    // 40. Ra1
    'The last rook heads for a8 and the back rank. The engine’s choice.',
    // 40... Kd8
    '40…Nb6 held out longer.',
    // 41. Ra8+
    'Check on the back rank. The engine’s choice.',
    // 41... Bc8
    'Black blocks.',
    // 42. Nc5
    'The knight joins in, threatening 43.Ne6+, forking the king and the rook on f8. Every Black piece is tied up, and Capablanca resigned.',
  ],
  stops: [
    {
      ply: 22,
      prompt: 'Black has just played …f6 to stop e5. How do you use your kingside pawns?',
      options: [
        {
          san: 'f5',
          best: true,
          text: 'It leaves your e-pawn behind, but makes e6 a permanent hole for your knight and shuts in Black’s bishop on c8. The engine’s choice.',
        },
        {
          san: 'Bd2',
          text: 'It develops, but after 12…a5 Black gains space on the queenside, and the engine prefers Black slightly.',
        },
        {
          san: 'Kf2',
          text: 'Sensible in an ending, but it gives Black time for …b6 and …Bb7, and the engine prefers Black slightly.',
        },
      ],
    },
    {
      ply: 30,
      prompt: 'Your knight is on d4 and Black has not covered e6. What now?',
      options: [
        {
          san: 'Ne6',
          best: true,
          text: 'The knight takes the hole on e6, attacking the rook on d8, and no pawn can ever drive it away. The engine rates White clearly better.',
        },
        {
          san: 'Rae1',
          text: 'It supports e4, but gives Black time for …Bc8, guarding e6. The game is level.',
        },
        {
          san: 'g4',
          text: 'Too early: after 16…Bc8 Black covers e6, and the game is level.',
        },
      ],
    },
    {
      ply: 68,
      prompt: 'Both your rooks are on the h-file. How do you open more lines?',
      options: [
        {
          san: 'e5',
          best: true,
          text: 'The breakthrough: give the e-pawn so your knights can reach e4, c5 and d6. The engine’s choice.',
        },
        {
          san: 'Rh8',
          text: 'Trading a pair of rooks also wins, but more slowly: White has fewer pieces left to attack with.',
        },
        {
          san: 'Rh6',
          text: 'Good too, but slower. Black gets time for …Na4 to swap off a knight.',
        },
      ],
    },
  ],
  ending: 'Capablanca resigned.',
  lessons: [
    'Pawn structure decides endings. White’s healthy kingside majority was worth more than Black’s two bishops.',
    'A hole is a square no enemy pawn can ever cover. 11…f6 made one on e6, and 12.f5 made sure it stayed one.',
    'Put a knight on a hole and it can dominate the game: the knight on e6 tied down Black’s whole army.',
    'Make a second front. Black could defend d6 or the kingside, but not both.',
    'In the ending, use your king: Lasker’s king marched to f4 to support the pawns.',
  ],
}
