// Alekhine v Nimzowitsch, San Remo 1930: "Alekhine's gun". Moves as published
// (chessgames.com and Wikipedia agree; Wikipedia adds four more moves before
// the resignation, we end where chessgames does). Notes our own, every claim
// checked against Stockfish 19 (depth 20+, three lines per position):
// scratch/report-gun.txt; every Black move in the final position scored.
import type { MasterGame } from './types'

export const GUN: MasterGame = {
  id: 'gun',
  title: 'Alekhine’s gun',
  white: 'Alexander Alekhine',
  black: 'Aron Nimzowitsch',
  players: 'Alekhine v Nimzowitsch',
  place: 'San Remo',
  year: 1930,
  result: '1-0',
  theme: 'Space, an outpost and the open file',
  orientation: 'white',
  legend: 'alekhine',
  intro:
    'Alekhine was world champion, at the height of his powers; Nimzowitsch was the great teacher of strategy. Here the teacher is beaten at his own game: Alekhine takes space, plants a knight, and lines up both rooks and his queen on the one open file. The formation, with the queen behind the rooks, is still called “Alekhine’s gun”.',
  plans:
    'A French Defence with a closed centre. Black’s usual plan is counterplay on the queenside and the c-file. Alekhine takes both away: his pawns grab space on the queenside, a knight lands on d6 where no Black pawn can touch it, and the c-file, the only open line on the board, becomes his. By the end Black’s pieces are so tied to defending c6 and c7 that almost every move loses something.',
  pgn: '1. e4 e6 2. d4 d5 3. Nc3 Bb4 4. e5 c5 5. Bd2 Ne7 6. Nb5 Bxd2+ 7. Qxd2 O-O 8. c3 b6 9. f4 Ba6 10. Nf3 Qd7 11. a4 Nbc6 12. b4 cxb4 13. cxb4 Bb7 14. Nd6 f5 15. a5 Nc8 16. Nxb7 Qxb7 17. a6 Qf7 18. Bb5 N8e7 19. O-O h6 20. Rfc1 Rfc8 21. Rc2 Qe8 22. Rac1 Rab8 23. Qe3 Rc7 24. Rc3 Qd7 25. R1c2 Kf8 26. Qc1 Rbc8 27. Ba4 b5 28. Bxb5 Ke8 29. Ba4 Kd8 30. h4',
  chapters: [
    {
      ply: 7,
      title: 'The pawn chain',
      text: 'White’s pawns on d4 and e5 form a chain pointing at Black’s kingside, and the centre is closed. Nimzowitsch’s own rule: attack a pawn chain at its base. So Black will hit d4 with …c5. White’s plan: hold the chain and win space elsewhere.',
    },
    {
      ply: 25,
      arrows: ['b5d6'],
      title: 'The only open file',
      text: 'The c-file has opened, and it’s the only open file on the board. Whoever controls it controls the game. White also has more space on the queenside, and there’s a beautiful square waiting on d6 for a White knight, guarded by the pawn on e5.',
    },
    {
      ply: 33,
      title: 'The squeeze',
      text: 'Black’s queenside is frozen: the pawn on a6 takes b7 away for good, and Black’s queenside pawns can barely move. All Black can do is defend c6 and c7. White’s plan is simple and slow: put every heavy piece on the c-file.',
    },
    {
      ply: 51,
      title: 'Alekhine’s gun',
      text: 'Two rooks and the queen, one behind the other on the c-file, all aimed at c6. Black has piled up defenders too, but they are stuck there, and White has more to bring: the bishop and the b-pawn.',
    },
  ],
  notes: [
    // 1. e4
    'The king’s pawn opens lines for the queen and bishop and claims the centre.',
    // 1... e6
    'The French Defence. Black prepares …d5. It’s solid, but the bishop on c8 is shut in behind the e6 pawn, the French’s lifelong problem.',
    // 2. d4
    'White takes the whole centre. The engine’s choice.',
    // 2... d5
    'Black challenges e4 at once. The best move.',
    // 3. Nc3
    'The knight defends e4. 3.e5 was a touch better.',
    // 3... Bb4
    'The Winawer Variation: the bishop pins the knight. 3…Nf6 was a little better.',
    // 4. e5
    'White grabs space and closes the centre. The engine’s choice.',
    // 4... c5
    'Black strikes at d4, the base of White’s pawn chain. The best move.',
    // 5. Bd2
    'A quiet move that breaks the pin. 5.a3, asking the bishop at once, was stronger.',
    // 5... Ne7
    'The knight develops to e7, so as not to block the f-pawn. The best move.',
    // 6. Nb5
    'An unusual idea. The knight gets out of the way, so White’s bishop now attacks the bishop on b4, and it eyes d6. 6.Nf3 or 6.a3 was a touch better.',
    // 6... Bxd2+
    'Black trades bishops. The best move. But without a dark-squared bishop, Black will find d6 hard to guard.',
    // 7. Qxd2
    'The queen takes back. The engine’s choice.',
    // 7... O-O
    'Black castles. The best move.',
    // 8. c3
    'White supports d4. 8.f4 was a touch stronger.',
    // 8... b6
    'Black plans …Ba6, to trade off the bad light-squared bishop. A good idea, but slow: 8…f6, hitting the pawn on e5, was the engine’s choice.',
    // 9. f4
    'White backs up the e5 pawn with another one. The engine’s choice.',
    // 9... Ba6
    'The bishop finally gets out. The best move.',
    // 10. Nf3
    'White develops. The engine’s choice.',
    // 10... Qd7
    'The queen steps up. 10…Nbc6 was better.',
    // 11. a4
    'The start of Alekhine’s queenside plan: the pawn takes b5 under control and prepares b4. The engine’s choice.',
    // 11... Nbc6
    'The last Black piece develops.',
    // 12. b4
    'White attacks c5 and opens the c-file on his own terms. The engine’s choice.',
    // 12... cxb4
    'Black takes. 12…cxd4 was about the same.',
    // 13. cxb4
    'The c-file is open. It will be the battlefield for the rest of the game. The engine’s choice.',
    // 13... Bb7
    'The bishop drops back. 13…Bc8 was a touch better.',
    // 14. Nd6
    'The knight lands on d6, guarded by the e5 pawn. Black has no pawn that can ever attack it, and no dark-squared bishop to trade it off. It eyes b7, f7 and c8. The engine’s choice.',
    // 14... f5
    'A serious mistake. Black closes the kingside for good, so now Black has no active plan anywhere. 14…a5, fighting on the queenside, was better.',
    // 15. a5
    'White pushes on, to open more lines on the queenside. 15.Qc3!, taking the c-file at once, was stronger.',
    // 15... Nc8
    'Another mistake. Black wants to swap off the knight on d6, but it costs time and lets White’s pawns roll forward. 15…a6, blocking the a-pawn, was much better.',
    // 16. Nxb7
    'Rather than let Black swap the knight off, White gives it for Black’s bishop, so that 17.a6 comes with gain of time. The engine’s choice.',
    // 16... Qxb7
    'The queen takes back. The best move.',
    // 17. a6
    'The pawn attacks the queen and, from a6, takes b7 away from Black for good. The engine’s choice.',
    // 17... Qf7
    'The queen steps aside. The best move.',
    // 18. Bb5
    'The bishop develops at last, to a strong square: it presses on the knight on c6, which will soon be attacked down the c-file too. The engine’s choice.',
    // 18... N8e7
    'The knight comes back to defend c6. The best move.',
    // 19. O-O
    'White castles. 19.Rc1 was slightly better.',
    // 19... h6
    'A loss of time. 19…Rfc8, contesting the c-file, was better.',
    // 20. Rfc1
    'The first rook comes to the c-file.',
    // 20... Rfc8
    'Black contests the file. The best move.',
    // 21. Rc2
    'The rook steps up to make room for the second one behind it. The engine’s choice.',
    // 21... Qe8
    'The queen adds a guard to the knight on c6. The best move.',
    // 22. Rac1
    'Both rooks on the c-file. The engine’s choice.',
    // 22... Rab8
    'Black’s other rook comes across. The best move.',
    // 23. Qe3
    'The queen heads round towards the c-file. 23.Rc3 first was a touch more accurate.',
    // 23... Rc7
    'Black doubles rooks too. The best move.',
    // 24. Rc3
    'The front rook steps up again. The engine’s choice.',
    // 24... Qd7
    'The queen guards c6 and c7 from d7. 24…Rbc8 was a touch better.',
    // 25. R1c2
    'The second rook follows, leaving c1 free for the queen. The engine’s choice.',
    // 25... Kf8
    'The king heads towards the queenside to help defend. 25…Rbc8 was a touch better.',
    // 26. Qc1
    'Alekhine’s gun: rook, rook and queen behind them, all on the c-file.',
    // 26... Rbc8
    'Black has to defend c6 and c7 with everything. The best move.',
    // 27. Ba4
    'The bishop pins the knight on c6 to the queen on d7, and threatens 28.b5, attacking the pinned knight with a pawn. The engine’s choice.',
    // 27... b5
    'Black gives a pawn to stop b5.',
    // 28. Bxb5
    'White takes it, and the bishop can come back to a4 to renew the threat. The engine’s choice.',
    // 28... Ke8
    'The king comes to help. 28…Kg8 was a little better.',
    // 29. Ba4
    'The pin again. 29.Rc5 was a little stronger.',
    // 29... Kd8
    'The king guards c7, so that if b5 comes, the knight can move without the rook on c7 dropping.',
    // 30. h4
    'A quiet move: White has all the time in the world. Black is paralysed: almost every piece move loses material on the spot, and only a few pawn and king moves are left. A modern footnote: it isn’t a true zugzwang, as Black still had moves like 30…g6 that lose nothing at once, but the engine has White about six pawns up whatever Black does.',
  ],
  stops: [
    {
      ply: 30,
      prompt: 'Black has just played …Nc8, offering to trade off your knight on d6. What do you do?',
      options: [
        {
          san: 'Nxb7',
          best: true,
          text: 'Take the bishop first. After 16…Qxb7 17.a6 the pawn hits the queen and takes b7 for good. The engine rates White winning.',
        },
        {
          san: 'Nxc8',
          text: 'Trading the knight for the other knight lets Black’s bishop live. White is still clearly better, but much less so.',
        },
        {
          san: 'Nxf5',
          text: 'It grabs a pawn, but after 16…bxa5 Black gets play on the queenside. White is better, but much less so.',
        },
      ],
    },
    {
      ply: 32,
      prompt: 'Black’s queen has just taken back on b7. How do you keep the squeeze going?',
      options: [
        {
          san: 'a6',
          best: true,
          text: 'The pawn attacks the queen, and on a6 it takes b7 away from Black for the rest of the game.',
        },
        {
          san: 'Ng5',
          text: 'Active, but it lets Black untangle. White is still clearly better, but the bind is gone.',
        },
        {
          san: 'Be2',
          text: 'Too slow: after 17…a6 Black stops the pawn, and White is only somewhat better.',
        },
      ],
    },
    {
      ply: 54,
      prompt: 'Black has given a pawn with …b5 to stop your b5. Take it, or keep the bishop where it is?',
      options: [
        {
          san: 'Bxb5',
          best: true,
          text: 'Take it: the bishop can come back to a4 to renew the pin, and your b-pawn is free to advance again. The engine rates White winning easily.',
        },
        {
          san: 'Bb3',
          text: 'Retreating lets Black’s pawn stay on b5 and blocks your b-pawn for good. White is only a little better.',
        },
        {
          san: 'Rc5',
          text: 'After 28…bxa4 Black has won the bishop, and the game is level.',
        },
      ],
    },
  ],
  ending: 'Nimzowitsch resigned.',
  lessons: [
    'Space is a weapon: White’s pawns on a6 and b4 left Black’s queenside with no moves at all.',
    'A knight on an outpost, a square no enemy pawn can attack, can be worth more than a bishop.',
    'Control the open file. When there’s only one, line up everything on it: the queen behind the rooks is the strongest way.',
    'When your opponent has no counterplay, there’s no hurry. Alekhine made quiet moves and let Black run out of useful ones.',
  ],
}
