// Rotlewi v Rubinstein, Łódź 1907, "Rubinstein's Immortal". Moves as
// published (chessgames.com and Wikipedia agree), replayed by the rules. Notes
// our own, every claim checked against Stockfish 19 (depth 20+, three lines
// per position): scratch/report-rubinstein.txt; the mating lines replayed.
import type { MasterGame } from './types'

export const RUBINSTEIN: MasterGame = {
  id: 'rubinstein',
  title: 'Rubinstein’s Immortal',
  white: 'Gersz Rotlewi',
  black: 'Akiba Rubinstein',
  place: 'Łódź',
  year: 1907,
  result: '0-1',
  theme: 'Two bishops aimed at the king',
  orientation: 'black',
  intro:
    'Akiba Rubinstein was one of the strongest players of the early 1900s, famous for his positional play and his endgames. This game, played in Łódź in 1907 (then in the Russian Empire, today in Poland), is known as Rubinstein’s Immortal. You watch it from Black’s side.',
  plans:
    'The game is famous for its finish, one of the most beautiful combinations ever played. But the combination only works because of what comes first. Black develops every piece to a square aimed at White’s king, while White spends extra moves with the queen and bishop and then pushes the pawns in front of his own king. Each pawn move opens a diagonal, and Black’s two bishops end up pointing straight at g1 and g2.',
  pgn: '1. d4 d5 2. Nf3 e6 3. e3 c5 4. c4 Nc6 5. Nc3 Nf6 6. dxc5 Bxc5 7. a3 a6 8. b4 Bd6 9. Bb2 O-O 10. Qd2 Qe7 11. Bd3 dxc4 12. Bxc4 b5 13. Bd3 Rd8 14. Qe2 Bb7 15. O-O Ne5 16. Nxe5 Bxe5 17. f4 Bc7 18. e4 Rac8 19. e5 Bb6+ 20. Kh1 Ng4 21. Be4 Qh4 22. g3 Rxc3 23. gxh4 Rd2 24. Qxd2 Bxe4+ 25. Qg2 Rh3',
  chapters: [
    {
      ply: 28,
      title: 'Development with a purpose',
      text: 'Count the moves. White’s light-squared bishop has moved three times and the queen twice; Black has used the time to bring every piece out. And look where Black’s pieces point: the bishop on b7 down the long diagonal towards g2, the bishop on d6 at h2, the rook on the open d-file. White’s plan should be quiet: castle and leave the pawns in front of the king alone.',
    },
    {
      ply: 33,
      arrows: ['b7g2'],
      title: 'Loosening the king',
      text: 'White has pushed the f-pawn, and the e-pawn will follow. Each of those moves opens a diagonal towards White’s own king: the long one for the bishop on b7, and the one from b6 to g1 for the dark-squared bishop. Black’s plan: keep the bishops aimed at g1 and g2, bring the last rook in, and wait for the lines to open.',
    },
    {
      ply: 42,
      title: 'The defenders',
      text: 'Black threatens …Qxh2 mate. White is holding on thanks to two pieces: the bishop on e4, which blocks the long diagonal, and the knight on c3, which protects that bishop. Look at what Black does to each of them.',
    },
  ],
  notes: [
    // 1. d4
    'The queen’s pawn takes a share of the centre.',
    // 1... d5
    'Black meets it head on, holding the centre with a pawn.',
    // 2. Nf3
    'A knight out towards the centre.',
    // 2... e6
    'Black opens the diagonal for the bishop on f8. The bishop on c8 is shut in for now; Black will find it a new diagonal later.',
    // 3. e3
    'Solid but modest: the pawn shuts in White’s own bishop on c1. 3.c4 was more ambitious.',
    // 3... c5
    'Black strikes at d4. In queen’s pawn openings, the c-pawn is the main way to challenge White’s centre.',
    // 4. c4
    'White does the same against d5. The engine’s choice.',
    // 4... Nc6
    'Black develops and adds pressure on d4.',
    // 5. Nc3
    'Another piece out.',
    // 5... Nf6
    'Black develops the second knight. The best move.',
    // 6. dxc5
    'White releases the tension, and Black’s bishop will be developed in one move when it takes back. 6.cxd5 was a little better.',
    // 6... Bxc5
    'The bishop takes back and is developed at the same time. The best move.',
    // 7. a3
    'White prepares b4, to gain space on the queenside and chase the bishop. The engine’s choice.',
    // 7... a6
    'Black copies, so that …b5 is possible too. 7…O-O was more accurate.',
    // 8. b4
    'White gains space and kicks the bishop. The engine’s choice.',
    // 8... Bd6
    'The bishop drops back to d6, from where it aims at h2, next to White’s future king. The best move.',
    // 9. Bb2
    'White’s bishop takes the long diagonal towards Black’s kingside. 9.cxd5 first was about as good.',
    // 9... O-O
    'Black castles. The best move.',
    // 10. Qd2
    'A poor square for the queen. She stands on the d-file, where a Black rook will soon arrive, and she’ll have to move again. 10.cxd5 was better.',
    // 10... Qe7
    'The queen steps off the d-file and makes way for a rook on d8. Black doesn’t mind giving the d5 pawn for quick development. The engine’s choice.',
    // 11. Bd3
    'White develops, but after Black takes on c4, this bishop will have to move again. 11.cxd5 was better, and now Black is slightly better.',
    // 11... dxc4
    'Black takes, so that White’s bishop has to move a second time. The best move.',
    // 12. Bxc4
    'The bishop takes back. The engine’s choice.',
    // 12... b5
    'And now a third time: the pawn chases the bishop, takes space on the queenside and makes room for Black’s bishop on b7. The best move.',
    // 13. Bd3
    'The bishop goes back to d3. The engine’s choice.',
    // 13... Rd8
    'The rook takes the open d-file, opposite White’s queen. The best move.',
    // 14. Qe2
    'The queen steps off the d-file, as she had to. 14.O-O first was slightly better.',
    // 14... Bb7
    'The last Black piece comes out, aiming down the long diagonal at g2. For now the knight on c6 is in the way, but not for long. The best move.',
    // 15. O-O
    'White castles. The engine’s choice.',
    // 15... Ne5
    'The knight offers a trade, and by moving it clears the long diagonal for the bishop on b7. The best move.',
    // 16. Nxe5
    'White takes. The engine’s choice.',
    // 16... Bxe5
    'The bishop takes back and now aims at h2 and at the knight on c3. The best move.',
    // 17. f4
    'A weakening move. White kicks the bishop, but the f-pawn no longer guards e3 and g3, and once the e-pawn moves too, the diagonal from b6 to g1 will be open. 17.Rfd1 was better.',
    // 17... Bc7
    'The bishop drops back, still aimed at the kingside. 17…Bb8 was a tiny bit better.',
    // 18. e4
    'Another pawn forward, and now the diagonal to g1 is open: …Bb6+ is in the air. 18.Rac1 was better.',
    // 18... Rac8
    'The last rook comes to the open c-file. Every Black piece is now active. 18…Nh5 was slightly stronger.',
    // 19. e5
    'The decisive mistake. White kicks the knight, but the pawn leaves e4, and now the bishop on b7 sees all the way to g2. 19.Rf3 was the way to keep fighting.',
    // 19... Bb6+
    'The other bishop checks down the newly opened diagonal. 19…Ng4 first was about as good.',
    // 20. Kh1
    'The only reasonable move: 20.Rf2 or 20.Qf2 would lose much more.',
    // 20... Ng4
    'The knight jumps in towards h2 and e3. Taking it with 21.Qxg4 would leave the bishop on d3 to 21…Rxd3, with Black still winning. The best move.',
    // 21. Be4
    'White blocks the long diagonal with the bishop, the natural defence. 21.Qxg4 was about as good; White is losing either way.',
    // 21... Qh4
    'The queen joins in, threatening …Qxh2 mate: the knight guards h2 and the bishop on b6 covers g1. The best move.',
    // 22. g3
    'White attacks the queen. 22.h3 was the only way to fight on, though Black would still be winning.',
    // 22... Rxc3
    'The start of the combination. Black leaves the queen to be taken and removes the knight that protects the bishop on e4. If 23.Bxc3, then 23…Bxe4+ 24.Qxe4 Qxh2 is mate.',
    // 23. gxh4
    'White takes the queen. 23.Bxb7 lasted longer, but Black was winning anyway.',
    // 23... Rd2
    'A second rook offered, this time to the queen. It attacks her, and if she takes it she can no longer guard e4. Whatever White does, Black mates. The engine’s choice.',
    // 24. Qxd2
    'White takes. Every other move loses too.',
    // 24... Bxe4+
    'Now the long diagonal is open: the bishop takes on e4 with check. The best move.',
    // 25. Qg2
    'The queen blocks. 25.Rf3 was the other try, with the same result.',
    // 25... Rh3
    'The quiet finish. …Rxh2 mate is coming, with the knight guarding h2 and the bishop on b6 covering g1. White can only delay it by giving up pieces, so White resigned.',
  ],
  stops: [
    {
      ply: 39,
      prompt: 'Your bishops now aim at g1 and g2. How do you bring another piece into the attack?',
      options: [
        {
          san: 'Ng4',
          best: true,
          text: 'The knight jumps towards h2 and e3, and it can’t be taken without losing the bishop on d3. The engine rates Black winning.',
        },
        {
          san: 'Rxd3',
          text: 'Giving the rook for the bishop at once (20…Rxd3 21.Qxd3) keeps Black on top, but less clearly than the game.',
        },
        {
          san: 'Nd5',
          text: 'Too quiet: after 21.Nxd5 Bxd5 the attack slows down and White breathes again. Black is only somewhat better.',
        },
      ],
    },
    {
      ply: 43,
      prompt: 'White has just attacked your queen with g3. Do you move her?',
      options: [
        {
          san: 'Rxc3',
          best: true,
          text: 'No! The rook takes the knight that protects the bishop on e4. If White takes the queen, a second sacrifice follows; if 23.Bxc3, then 23…Bxe4+ 24.Qxe4 Qxh2 mate.',
        },
        {
          san: 'Qe7',
          text: 'Safe, and Black is still winning, but White can now defend with 23.Rf3. The combination was much stronger.',
        },
        {
          san: 'Bxe4+',
          text: 'It gives up the pressure: after 23.Nxe4 the knight defends, and Black is still clearly better, but the attack is over.',
        },
      ],
    },
    {
      ply: 45,
      prompt: 'White has taken your queen. You have a forced mate. What’s the first move?',
      options: [
        {
          san: 'Rd2',
          best: true,
          text: 'The rook attacks White’s queen. If she takes it, she no longer guards e4, and 24…Bxe4+ breaks through.',
        },
        {
          san: 'Re3',
          text: 'After 24.Qxe3 Bxe3 Black has given back too much, and the game is roughly level.',
        },
        {
          san: 'Bxe4+',
          text: 'Too soon: after 24.Qxe4 the queen covers the long diagonal, and White is now better.',
        },
      ],
    },
  ],
  ending: 'White resigned: mate on h2 could only be delayed.',
  lessons: [
    'Develop with a purpose. Every Black piece was aimed at White’s king before the attack began.',
    'Pawn moves in front of your own king open lines for enemy bishops. White’s f4, e4 and e5 each opened one.',
    'Don’t move the same piece again and again in the opening. White’s bishop moved three times and the queen twice.',
    'In a combination, look for the defenders and remove them: 22…Rxc3 took away the knight guarding e4, and 23…Rd2 dragged the queen away from it.',
  ],
}
