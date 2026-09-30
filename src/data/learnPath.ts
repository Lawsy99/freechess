// The Learn path (Joseph, Sep 2026): Duolingo-style units of short lessons.
// Every lesson is mostly doing, not reading: a two- or three-sentence idea,
// then puzzles on it (real positions, find the move), a harder challenge
// with one try each, and in some lessons a position to play out against the
// engine or an opening to play through. Pass to unlock the next lesson.
//
// Puzzles come from the Lichess set by theme, pitched around your rating;
// play-outs from data/endgameDrills.ts; openings from data/openingLessons.ts.

export type LearnStep =
  /** The idea, in a few sentences. The only step where you just read. */
  | { kind: 'idea'; text: string }
  /**
   * Puzzles on a theme. `pass`: how many must be solved cleanly. `offset`:
   * how far above or below your level they're pitched. `oneTry`: no second
   * go (the challenge round).
   */
  | { kind: 'puzzles'; title: string; themes: string[]; count: number; pass: number; offset: number; oneTry?: boolean }
  /** Play a position out against the engine (a drill set from endgameDrills.ts, by your rating). */
  | { kind: 'endgame'; drill: string }
  /** Play an opening's moves yourself (openingLessons.ts). */
  | { kind: 'opening'; drill: string }

export type Lesson = { id: string; title: string; steps: LearnStep[] }
export type Unit = { id: string; title: string; about: string; colour: string; lessons: Lesson[] }

/** The usual shape: the idea, a practice round, then a harder challenge with one try each. */
function tactic(id: string, title: string, theme: string, idea: string): Lesson {
  return {
    id,
    title,
    steps: [
      { kind: 'idea', text: idea },
      { kind: 'puzzles', title: 'Practice', themes: [theme], count: 5, pass: 4, offset: -200 },
      { kind: 'puzzles', title: 'Challenge: one try each', themes: [theme], count: 3, pass: 2, offset: 0, oneTry: true },
    ],
  }
}

export const LEARN_PATH: Unit[] = [
  {
    id: 'first-steps',
    title: 'First steps',
    about: 'Win material, give mate, keep your pieces safe.',
    colour: '#5fd38d',
    lessons: [
      tactic('free-pieces', 'Take the free piece', 'hangingPiece', 'Before anything else, look at every capture you have. If a piece is left undefended, take it. Then check nothing of yours is left the same way.'),
      tactic('mate-in-one', 'Checkmate in one', 'mateIn1', 'Checkmate: the king is in check and has no way out. Look at every check you have, and for each one count the king’s escape squares.'),
      {
        id: 'lone-king',
        title: 'Mate a lone king',
        steps: [
          { kind: 'idea', text: 'With a big material advantage, the win is checkmate, and you need a method. Push the king to the edge, step by step, then mate it. Watch out for stalemate: always leave it a move.' },
          { kind: 'endgame', drill: 'lone-king' },
        ],
      },
      tactic('stay-safe', 'Keep your pieces safe', 'defensiveMove', 'Every move your opponent makes might threaten something. Before you move, ask what their last move is attacking, and deal with it.'),
    ],
  },
  {
    id: 'tactics',
    title: 'Tactics',
    about: 'The tricks that win material at every level.',
    colour: '#6f9bff',
    lessons: [
      tactic('forks', 'Forks', 'fork', 'A fork attacks two things at once, so they can only save one. Knights are the best forkers. Look for squares where one piece hits two targets, especially the king.'),
      tactic('pins', 'Pins', 'pin', 'A pin attacks a piece that can’t move without exposing something more valuable behind it. Pinned pieces are targets: attack them again.'),
      tactic('skewers', 'Skewers', 'skewer', 'A skewer is a pin the other way round: attack the valuable piece, and when it moves, take what was behind it.'),
      tactic('discovered', 'Discovered attacks', 'discoveredAttack', 'Move one piece out of the way and another behind it attacks. The piece that moves can make its own threat too: two attacks at once.'),
      tactic('double-check', 'Double check', 'doubleCheck', 'Check with two pieces at once and the king must move: nothing can block or capture both. Often it leads straight to mate.'),
    ],
  },
  {
    id: 'mates',
    title: 'Checkmate patterns',
    about: 'Recognise the mates and you’ll find them in your games.',
    colour: '#ff9a5c',
    lessons: [
      tactic('back-rank', 'Back-rank mate', 'backRankMate', 'A king behind its own pawns has no escape along the back row. A rook or queen landing there is mate. Look for it, and give your own king an escape square.'),
      tactic('smothered', 'Smothered mate', 'smotheredMate', 'A king surrounded by its own pieces can be mated by a single knight. Often it starts with a queen sacrifice to block the last square.'),
      tactic('mate-in-two', 'Mate in two', 'mateIn2', 'Two moves to mate. Start with the most forcing moves: checks first, then captures, then threats. Work out every reply.'),
      tactic('mate-in-three', 'Mate in three', 'mateIn3', 'Longer, so be patient. Find a forcing first move, then keep checking until the king runs out of squares.'),
    ],
  },
  {
    id: 'openings',
    title: 'Openings',
    about: 'Play the first moves yourself, and know why.',
    colour: '#c792ea',
    lessons: [
      {
        id: 'italian',
        title: 'The Italian Game (White)',
        steps: [
          { kind: 'idea', text: 'Control the centre, bring out your knights and bishops, castle. The Italian does all three: e4, Nf3, Bc4 aiming at f7, then castle.' },
          { kind: 'opening', drill: 'italian' },
        ],
      },
      {
        id: 'london',
        title: 'The London System (White)',
        steps: [
          { kind: 'idea', text: 'A solid set-up you can play against almost anything: d4, Bf4, e3, Nf3, then c3 and Bd3. Easy to learn, hard to beat.' },
          { kind: 'opening', drill: 'london' },
        ],
      },
      {
        id: 'black-e4',
        title: 'Answering 1.e4 (Black)',
        steps: [
          { kind: 'idea', text: 'Meet e4 with e5: claim your share of the centre, then develop just as White does.' },
          { kind: 'opening', drill: 'black-e4' },
        ],
      },
      {
        id: 'black-d4',
        title: 'Answering 1.d4 (Black)',
        steps: [
          { kind: 'idea', text: 'Meet d4 with d5, and develop solidly: knights out, bishop out, castle.' },
          { kind: 'opening', drill: 'black-d4' },
        ],
      },
      tactic('opening-traps', 'Opening tricks', 'opening', 'Games are often decided in the first ten moves by a loose piece or a trap. Find the winning idea in each of these openings.'),
    ],
  },
  {
    id: 'endgames',
    title: 'Endgames',
    about: 'Turn an advantage into a win.',
    colour: '#f5c04a',
    lessons: [
      {
        id: 'king-pawn',
        title: 'King and pawn',
        steps: [
          { kind: 'idea', text: 'In pawn endings the king is a fighting piece. Put it in front of your pawn, and use the opposition: kings facing each other, the one not to move wins the ground.' },
          { kind: 'endgame', drill: 'king-pawn' },
          { kind: 'puzzles', title: 'Pawn endgames', themes: ['pawnEndgame'], count: 4, pass: 3, offset: -200 },
        ],
      },
      tactic('promotion', 'Promotion', 'promotion', 'A pawn that reaches the end becomes a queen. Clear its path, push it, and watch out for the pieces that can stop it.'),
      {
        id: 'rook-endings',
        title: 'Rook endings',
        steps: [
          { kind: 'idea', text: 'The most common endings of all. Rooks belong behind passed pawns, and the king comes forward. Cut the enemy king off with your rook.' },
          { kind: 'endgame', drill: 'rook-ending' },
          { kind: 'puzzles', title: 'Rook endgames', themes: ['rookEndgame'], count: 4, pass: 3, offset: -200 },
        ],
      },
    ],
  },
  {
    id: 'winning-ideas',
    title: 'Winning ideas',
    about: 'The deeper tricks strong players use.',
    colour: '#ff7a9c',
    lessons: [
      tactic('sacrifices', 'Sacrifices', 'sacrifice', 'Sometimes giving material wins more back, or breaks open the king. Calculate it through: what do you get for what you give?'),
      tactic('deflection', 'Deflection', 'deflection', 'A defender with two jobs can’t do both. Force it away from one, and what it was guarding falls.'),
      tactic('trapped', 'Trapped pieces', 'trappedPiece', 'A piece with no safe squares can be won just by attacking it. Look for pieces that have wandered too far.'),
      tactic('quiet-moves', 'Quiet moves', 'quietMove', 'Not every winning move is a check or a capture. Sometimes a quiet move sets up a threat they can’t stop.'),
    ],
  },
]

/** Every lesson in order, for unlocking one after another. */
export const ALL_LESSONS: Lesson[] = LEARN_PATH.flatMap((u) => u.lessons)
