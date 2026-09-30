// Opening lessons (Joseph, Sep 2026: "a lot of people aren't great at
// openings... where do I move my first few pieces"). Two simple, sound ways
// to start as White, each with the three ideas behind every opening: take
// the centre, get your pieces out, castle.
//
// Each has a worked demonstration, then a drill: you play the White moves,
// Pemberton plays Black (varying his replies), and a wrong move gets the
// principle it breaks, not just "no". Lines are checked for legality by
// src/logic/openingDrill.test.ts.
import type { WrittenStep } from '../logic/demo'

export type OpeningDrill = {
  id: string
  name: string
  /** The side you play (White if not set). */
  colour?: 'w' | 'b'
  /** Pemberton plays it through first. */
  demo: WrittenStep[]
  /** The lines you practise, as White, including his replies. */
  lines: string[]
  /** Why each White move is played, by how it's written (shown after you play it). */
  why: Record<string, string>
  /** Run-throughs in the drill. */
  runs: number
}

export const OPENING_DRILLS: Record<string, OpeningDrill> = {
  italian: {
    id: 'italian',
    name: 'the Italian Game',
    demo: [
      {
        caption:
          'Every good opening does three things: takes the centre, gets the pieces out, and tucks the king away. Here is a simple way to do all three as White. The Italian Game.',
      },
      { caption: 'A centre pawn first. It takes space and opens the way for your queen and bishop.', moves: '1. e4 e5' },
      { caption: 'A knight out, towards the middle. It attacks Black’s pawn on e5 as well.', moves: '2. Nf3 Nc6' },
      {
        caption: 'The bishop to c4, aiming at f7. That’s the weakest square near Black’s king: only the king guards it.',
        moves: '3. Bc4 Bc5',
      },
      { caption: 'Then c3 and d3 for a solid centre, and castle. Your king is safe and a rook joins in.', moves: '4. c3 Nf6 5. d3 d6 6. O-O O-O' },
      { caption: 'Centre, pieces, king. Six moves, and you’re ready for a real game. Now you play it.' },
    ],
    lines: [
      '1. e4 e5 2. Nf3 Nc6 3. Bc4 Bc5 4. c3 Nf6 5. d3 d6 6. O-O O-O',
      '1. e4 e5 2. Nf3 Nc6 3. Bc4 Nf6 4. d3 Be7 5. O-O O-O 6. Re1 d6',
      '1. e4 e5 2. Nf3 d6 3. Bc4 Nf6 4. Nc3 Be7 5. d3 O-O 6. O-O c6',
    ],
    why: {
      e4: 'A centre pawn. It takes space and lets your queen and bishop out.',
      Nf3: 'Knight out, towards the centre, and it attacks e5.',
      Bc4: 'The bishop to its best diagonal, aiming at f7.',
      c3: 'c3 prepares d4 later, for a bigger centre.',
      d3: 'd3 guards e4 and opens the way for your other bishop.',
      Nc3: 'The other knight out. It guards e4 too.',
      'O-O': 'Castle early: your king is safe, and a rook joins the game.',
      Re1: 'The rook comes to the middle, where the game will open up.',
    },
    runs: 2,
  },
  london: {
    id: 'london',
    name: 'the London System',
    demo: [
      {
        caption:
          'Another way to start, and one that works against almost anything: the London System. You play the same set-up every game, so there’s less to remember.',
      },
      { caption: 'A centre pawn again, the queen’s pawn this time.', moves: '1. d4 d5' },
      { caption: 'The bishop comes out straight away, before e3 shuts it in. That’s the whole idea of the London.', moves: '2. Bf4 Nf6' },
      { caption: 'Then e3, the knight, and c3: a wall of pawns holding d4.', moves: '3. e3 e6 4. Nf3 c5 5. c3' },
      {
        caption: 'The other knight goes to d2, the last bishop to d3, then castle. If they try to swap off your good bishop, step it back to g3.',
        moves: '5... Nc6 6. Nbd2 Bd6 7. Bg3 O-O 8. Bd3',
      },
      { caption: 'Same plan against almost everything. Now you play it.' },
    ],
    lines: [
      '1. d4 d5 2. Bf4 Nf6 3. e3 e6 4. Nf3 c5 5. c3 Nc6 6. Nbd2 Bd6 7. Bg3 O-O 8. Bd3',
      '1. d4 Nf6 2. Bf4 g6 3. e3 Bg7 4. Nf3 O-O 5. Be2 d6 6. O-O',
      '1. d4 d5 2. Bf4 c5 3. e3 Nc6 4. c3 Nf6 5. Nd2 e6 6. Ngf3 Bd6 7. Bg3 O-O 8. Bd3',
    ],
    why: {
      d4: 'A centre pawn: the queen’s pawn.',
      Bf4: 'The bishop out before e3 shuts it in. That’s the London.',
      e3: 'e3 supports d4 and opens the other bishop.',
      Nf3: 'Knight out, towards the centre.',
      Ngf3: 'Knight out, towards the centre.',
      c3: 'c3 makes d4 rock solid.',
      Nbd2: 'The other knight to d2, where it supports e4 later.',
      Nd2: 'The other knight to d2, where it supports e4 later.',
      Bd3: 'The last bishop out, aimed at the king’s side.',
      Bg3: 'Step the bishop back rather than let it be swapped for a knight.',
      Be2: 'A quiet square, ready to castle.',
      'O-O': 'Castle: king safe, rook in the game.',
    },
    runs: 2,
  },

  // --- Act 2: the same three ideas, as Black ---
  'black-e4': {
    id: 'black-e4',
    name: 'the answer to 1.e4',
    colour: 'b',
    demo: [
      {
        caption: 'Now from the other side. When White opens with the king’s pawn, meet it in the centre: pawn to e5. The same three ideas as before.',
      },
      { caption: 'Your own centre pawn, straight away. It stops White having the middle to themselves.', moves: '1. e4 e5' },
      { caption: 'Their knight attacks your pawn, so a knight defends it and comes out at the same time.', moves: '2. Nf3 Nc6' },
      { caption: 'Your bishop to its best diagonal, then the other knight. Every move develops something.', moves: '3. Bc4 Bc5 4. c3 Nf6' },
      { caption: 'A solid d6, then castle. Your king is as safe as theirs.', moves: '5. d3 d6 6. O-O O-O' },
      { caption: 'Against the other main moves the ideas are the same: centre, pieces, king. Now you play Black.' },
    ],
    lines: [
      '1. e4 e5 2. Nf3 Nc6 3. Bc4 Bc5 4. c3 Nf6 5. d3 d6 6. O-O O-O',
      '1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 4. Ba4 Nf6 5. O-O Be7',
      '1. e4 e5 2. Nf3 Nc6 3. d4 exd4 4. Nxd4 Nf6 5. Nxc6 bxc6 6. Bd3 d5',
    ],
    why: {
      e5: 'Your own centre pawn. Now the middle is shared.',
      Nc6: 'The knight defends e5 and develops at the same time.',
      Bc5: 'The bishop to its best diagonal, aiming at f2.',
      Nf6: 'The other knight out, and it attacks e4.',
      d6: 'd6 holds e5 and opens the way for your other bishop.',
      'O-O': 'Castle: your king is safe, and a rook joins in.',
      a6: 'a6 asks the bishop what it’s doing. It has to decide.',
      Be7: 'A quiet square for the bishop, ready to castle.',
      exd4: 'Take the pawn back: they gave up the centre, you don’t have to.',
      bxc6: 'Take back towards the centre. The pawns look odd but d5 is coming.',
      d5: 'Now d5: a centre of your own.',
    },
    runs: 2,
  },
  'black-d4': {
    id: 'black-d4',
    name: 'the answer to 1.d4',
    colour: 'b',
    demo: [
      {
        caption: 'When White opens with the queen’s pawn, the simplest answer is the one strong players have trusted for a century: d5, e6, and develop. The Queen’s Gambit Declined.',
      },
      { caption: 'Your centre pawn opposite theirs.', moves: '1. d4 d5' },
      { caption: 'If they offer the c-pawn, you don’t have to take it. e6 holds d5 and opens your bishop.', moves: '2. c4 e6' },
      { caption: 'Knight out, bishop out, castle. No drama.', moves: '3. Nc3 Nf6 4. Bg5 Be7 5. e3 O-O' },
      { caption: 'h6 asks their bishop to make up its mind. Now you play Black.', moves: '6. Nf3 h6' },
    ],
    lines: [
      '1. d4 d5 2. c4 e6 3. Nc3 Nf6 4. Bg5 Be7 5. e3 O-O 6. Nf3 h6',
      '1. d4 d5 2. Nf3 Nf6 3. Bf4 e6 4. e3 Be7 5. Bd3 O-O',
      '1. d4 d5 2. c4 e6 3. Nf3 Nf6 4. g3 Be7 5. Bg2 O-O 6. O-O dxc4',
    ],
    why: {
      d5: 'Your centre pawn, opposite theirs.',
      e6: 'e6 holds d5 and opens the way for your bishop.',
      Nf6: 'Knight out, towards the centre.',
      Be7: 'The bishop out, ready to castle.',
      'O-O': 'Castle: king safe, rook in the game.',
      h6: 'h6 asks their bishop what it wants to do.',
      dxc4: 'Now take the pawn: they’ve castled, and you can give it back later if you need to.',
    },
    runs: 2,
  },
  // --- More openings (FreeChess, Sep 2026) ---
  'queens-gambit': {
    id: 'queens-gambit',
    name: 'the Queen’s Gambit',
    demo: [
      { caption: 'One of the oldest and most respected openings: the Queen’s Gambit. You offer a pawn to pull Black’s centre pawn away.' },
      { caption: 'The queen’s pawn to the centre, met by theirs.', moves: '1. d4 d5' },
      { caption: 'Now c4. It attacks d5 from the side. If they take, you usually win the pawn back, so it isn’t really a gift.', moves: '2. c4 e6' },
      { caption: 'Knights and bishops out. Bg5 pins the knight that guards d5.', moves: '3. Nc3 Nf6 4. Bg5 Be7' },
      { caption: 'e3 opens your other bishop, the knight comes out, and castling is next.', moves: '5. e3 O-O 6. Nf3' },
      { caption: 'Pressure on d5, every piece heading somewhere useful. Now you play it.' },
    ],
    lines: [
      '1. d4 d5 2. c4 e6 3. Nc3 Nf6 4. Bg5 Be7 5. e3 O-O 6. Nf3 h6 7. Bh4',
      '1. d4 d5 2. c4 dxc4 3. e3 Nf6 4. Bxc4 e6 5. Nf3 c5 6. O-O',
      '1. d4 d5 2. c4 c6 3. Nf3 Nf6 4. e3 e6 5. Nc3 Nbd7 6. Bd3',
    ],
    why: {
      d4: 'The queen’s pawn to the centre.',
      c4: 'c4 attacks their d-pawn from the side: the gambit.',
      Nc3: 'Knight out, adding pressure on d5.',
      Bg5: 'The bishop pins the knight that guards d5.',
      e3: 'e3 supports d4 and opens your other bishop.',
      Nf3: 'Knight out, towards the centre.',
      Bh4: 'Keep the pin: step back rather than swap.',
      Bxc4: 'Win the pawn back, and develop the bishop at the same time.',
      'O-O': 'Castle: king safe, rook in the game.',
      Bd3: 'The bishop to a good diagonal, ready to castle.',
    },
    runs: 2,
  },
  'ruy-lopez': {
    id: 'ruy-lopez',
    name: 'the Ruy Lopez',
    demo: [
      { caption: 'The Ruy Lopez, or Spanish Game: played by world champions for 150 years. Same start as the Italian, but the bishop goes to b5.' },
      { caption: 'Centre pawn, and the knight attacks e5.', moves: '1. e4 e5 2. Nf3 Nc6' },
      { caption: 'Bb5 attacks the knight that guards e5. It’s a slow threat, but it never goes away.', moves: '3. Bb5' },
      { caption: 'a6 asks the bishop to decide. Step back to a4 and keep the pressure. Then castle.', moves: '3... a6 4. Ba4 Nf6 5. O-O Be7' },
      { caption: 'Re1 guards e4, the bishop retreats to b3 aiming at f7, and c3 prepares d4.', moves: '6. Re1 b5 7. Bb3 d6 8. c3 O-O' },
      { caption: 'A strong centre is coming with d4. Now you play it.' },
    ],
    lines: [
      '1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 4. Ba4 Nf6 5. O-O Be7 6. Re1 b5 7. Bb3 d6 8. c3 O-O',
      '1. e4 e5 2. Nf3 Nc6 3. Bb5 Nf6 4. O-O Be7 5. Re1 d6 6. c3 O-O 7. d4',
      '1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 4. Bxc6 dxc6 5. O-O f6 6. d4 exd4 7. Nxd4',
    ],
    why: {
      e4: 'A centre pawn: space for your queen and bishop.',
      Nf3: 'Knight out, and it attacks e5.',
      Bb5: 'The bishop attacks the knight that guards e5.',
      Ba4: 'Keep the pressure on the knight rather than swap.',
      'O-O': 'Castle early: king safe, rook ready for e1.',
      Re1: 'The rook guards e4 and eyes the e-file.',
      Bb3: 'Back to b3, where it aims at f7.',
      c3: 'c3 prepares d4, for a big centre.',
      d4: 'd4: now you have the centre.',
      Bxc6: 'Swap the bishop for the knight: their pawns are left doubled.',
      Nxd4: 'Take back with the knight, right in the centre.',
    },
    runs: 2,
  },
  'caro-kann': {
    id: 'caro-kann',
    name: 'the Caro-Kann',
    colour: 'b',
    demo: [
      { caption: 'A solid answer to 1.e4: the Caro-Kann. You challenge the centre without leaving anything loose.' },
      { caption: 'c6 first. It prepares d5, and keeps a pawn ready to take back on d5.', moves: '1. e4 c6' },
      { caption: 'Now d5: their e-pawn is attacked.', moves: '2. d4 d5' },
      { caption: 'Take, then bring the bishop out before you play e6, so it isn’t shut in.', moves: '3. Nc3 dxe4 4. Nxe4 Bf5' },
      { caption: 'When the bishop is chased, step back to g6 and keep it. Then develop.', moves: '5. Ng3 Bg6 6. Nf3 Nd7' },
      { caption: 'Solid, safe, and every piece has a future. Now you play Black.' },
    ],
    lines: [
      '1. e4 c6 2. d4 d5 3. Nc3 dxe4 4. Nxe4 Bf5 5. Ng3 Bg6 6. Nf3 Nd7',
      '1. e4 c6 2. d4 d5 3. e5 Bf5 4. Nf3 e6 5. Be2 c5 6. O-O Nc6',
      '1. e4 c6 2. d4 d5 3. exd5 cxd5 4. Bd3 Nc6 5. c3 Nf6 6. Bf4 Bg4',
    ],
    why: {
      c6: 'c6 prepares d5.',
      d5: 'Now d5 challenges their centre.',
      dxe4: 'Take the pawn in the centre.',
      Bf5: 'The bishop out before e6 shuts it in.',
      Bg6: 'Step back and keep the bishop: it’s your best piece.',
      Nd7: 'Knight out, and it can come to f6 next.',
      e6: 'Now e6, with the bishop already outside the pawns.',
      c5: 'c5 hits the base of their pawn chain.',
      Nc6: 'Knight out, adding pressure on d4.',
      cxd5: 'Take back towards the centre.',
      Nf6: 'Knight out, towards the centre.',
      Bg4: 'The bishop pins their knight.',
    },
    runs: 2,
  },
  sicilian: {
    id: 'sicilian',
    name: 'the Sicilian',
    colour: 'b',
    demo: [
      { caption: 'The most popular answer to 1.e4 at every level: the Sicilian. It fights for the centre from the side and makes the game unbalanced.' },
      { caption: 'c5: a side pawn, but it controls d4.', moves: '1. e4 c5' },
      { caption: 'When White pushes d4, swap your c-pawn for their centre pawn. Now you have two centre pawns to their one.', moves: '2. Nf3 d6 3. d4 cxd4' },
      { caption: 'Knight out, attacking e4. Then a6: a small move that stops their pieces landing on b5.', moves: '4. Nxd4 Nf6 5. Nc3 a6' },
      { caption: 'e5 chases their knight and claims the centre. Then develop and castle.', moves: '6. Be2 e5 7. Nb3 Be7' },
      { caption: 'Sharp, rich and full of chances for both sides. Now you play Black.' },
    ],
    lines: [
      '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 a6 6. Be2 e5 7. Nb3 Be7',
      '1. e4 c5 2. c3 d5 3. exd5 Qxd5 4. d4 Nf6 5. Nf3 e6',
      '1. e4 c5 2. Nc3 Nc6 3. g3 g6 4. Bg2 Bg7 5. d3 d6',
    ],
    why: {
      c5: 'c5 controls d4 from the side.',
      d6: 'd6 keeps e5 covered and opens your bishop.',
      cxd4: 'Swap your side pawn for their centre pawn.',
      Nf6: 'Knight out, attacking e4.',
      a6: 'a6 keeps their pieces off b5.',
      e5: 'e5 chases the knight and takes the centre.',
      Be7: 'Bishop out, ready to castle.',
      d5: 'Strike the centre straight away.',
      Qxd5: 'Take back with the queen: it’s safe there for now.',
      e6: 'e6 opens your bishop and holds d5.',
      Nc6: 'Knight out, towards the centre.',
      g6: 'g6 makes room for the bishop on the long diagonal.',
      Bg7: 'The bishop on the long diagonal, aiming at their queenside.',
    },
    runs: 2,
  },
}
