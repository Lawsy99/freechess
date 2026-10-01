// The Learn path (Joseph, Sep 2026): Duolingo-style units of short lessons.
// Every lesson is mostly doing, not reading: a two- or three-sentence idea,
// then puzzles on it (real positions, find the move), a harder challenge
// with one try each, and in some lessons a position to play out against the
// engine or an opening to play through. Pass to unlock the next lesson.
//
// Puzzles come from the Lichess set by theme, pitched around your rating;
// play-outs from data/endgameDrills.ts; openings from data/openingLessons.ts.
import type { OpeningDrill } from './openingLessons'

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
  /** How the pieces move, hands on (data/rulesTutorial.ts), for complete beginners. */
  | { kind: 'rules' }
  /** Your own opening, as you play it, with the slips put right (logic/myOpenings.ts). */
  | { kind: 'my-opening'; drill: OpeningDrill }

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
      // (Sep 2026: for friends who've never played. One tap skips it.)
      { id: 'rules', title: 'How the pieces move', steps: [{ kind: 'rules' }] },
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
      {
        id: 'queens-gambit',
        title: 'The Queen’s Gambit (White)',
        steps: [
          { kind: 'idea', text: 'After d4 d5, play c4: it attacks their centre pawn from the side. If they take, you win the pawn back. Then develop and castle.' },
          { kind: 'opening', drill: 'queens-gambit' },
        ],
      },
      {
        id: 'ruy-lopez',
        title: 'The Ruy Lopez (White)',
        steps: [
          { kind: 'idea', text: 'Like the Italian, but the bishop goes to b5, attacking the knight that guards e5. Castle, Re1, c3, then d4 for a big centre.' },
          { kind: 'opening', drill: 'ruy-lopez' },
        ],
      },
      {
        id: 'caro-kann',
        title: 'The Caro-Kann (Black)',
        steps: [
          { kind: 'idea', text: 'Against e4: c6, then d5. Bring your light bishop out before playing e6, so it isn’t shut in. Solid and safe.' },
          { kind: 'opening', drill: 'caro-kann' },
        ],
      },
      {
        id: 'sicilian',
        title: 'The Sicilian (Black)',
        steps: [
          { kind: 'idea', text: 'Against e4: c5. When White plays d4, swap your c-pawn for their centre pawn, then develop fast. Sharp and full of chances.' },
          { kind: 'opening', drill: 'sicilian' },
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
      {
        id: 'queen-mate',
        title: 'Mate with the queen',
        steps: [
          { kind: 'idea', text: 'A queen and king against a lone king is always a win, if you avoid stalemate. Box the king in with your queen, a knight’s move away, then bring your king up to help.' },
          { kind: 'endgame', drill: 'queen-mate' },
        ],
      },
      {
        id: 'rook-mate',
        title: 'Mate with the rook',
        steps: [
          { kind: 'idea', text: 'Harder than the queen, but always a win. Your rook cuts the king off; your king does the pushing. Take the opposition, then check.' },
          { kind: 'endgame', drill: 'rook-mate' },
        ],
      },
      {
        id: 'key-squares',
        title: 'Key squares',
        steps: [
          { kind: 'idea', text: 'In king and pawn endings, your king wins by reaching a key square: two ranks in front of the pawn. Get there first, and the pawn walks home.' },
          { kind: 'endgame', drill: 'key-squares' },
        ],
      },
      {
        id: 'opposition',
        title: 'Hold the draw',
        steps: [
          { kind: 'idea', text: 'A pawn down is often only a draw if you know how. Stand face to face with their king, one square between, and make them move first: the opposition.' },
          { kind: 'endgame', drill: 'opposition' },
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
  // Three more units (Sep 2026), from puzzle themes the path didn't use yet.
  {
    id: 'attack',
    title: 'Attacking the king',
    about: 'Open up the king and finish it off.',
    colour: '#ff6b6b',
    lessons: [
      tactic('kingside-attack', 'Attack the castled king', 'kingsideAttack', 'A castled king has pawns in front of it. Bring pieces close, open a line with a pawn push or a sacrifice, then strike. Count your attackers against their defenders first.'),
      tactic('exposed-king', 'Hunt the open king', 'exposedKing', 'A king with no pawns around it is in danger. Keep checking, bring more pieces in, and don’t let it run to safety.'),
      tactic('attraction', 'Lure it in', 'attraction', 'Sometimes you give up a piece to drag the king (or another piece) onto a square where it gets caught. Ask: which square would I love their king to be on?'),
      tactic('remove-defender', 'Take the defender', 'capturingDefender', 'If one piece holds their position together, take it. Whatever it was guarding is then yours.'),
    ],
  },
  {
    id: 'advanced-tactics',
    title: 'Advanced tactics',
    about: 'The ideas that separate club players from beginners.',
    colour: '#4fd1c5',
    lessons: [
      tactic('intermezzo', 'In-between moves', 'intermezzo', 'Before taking back, look for something stronger first: a check or a threat they have to answer. Then take back.'),
      tactic('clearance', 'Clear the way', 'clearance', 'Your own piece is in the way. Move it with a threat, and the line opens for the piece behind it.'),
      tactic('interference', 'Get in the way', 'interference', 'Put a piece between two of theirs, so one can no longer guard the other.'),
      tactic('x-ray', 'X-ray attacks', 'xRayAttack', 'A piece can attack, or defend, straight through another piece on the same line. Look beyond the first piece in the way.'),
      tactic('zugzwang', 'Zugzwang', 'zugzwang', 'Sometimes the player to move loses just because they must move. Find the quiet move that leaves them only bad choices.'),
    ],
  },
  {
    id: 'endgame-mastery',
    title: 'Endgame mastery',
    about: 'Turn small advantages into wins.',
    colour: '#a3e635',
    lessons: [
      tactic('passed-pawns', 'Passed pawns', 'advancedPawn', 'A pawn with no enemy pawns in front of it is dangerous. Push it, protect it, and use it to pull their pieces away.'),
      tactic('bishop-endings', 'Bishop endings', 'bishopEndgame', 'Bishops love open boards and long diagonals. Put your pawns on the other colour to your bishop, and use your king.'),
      tactic('knight-endings', 'Knight endings', 'knightEndgame', 'Knights are slow over long distances but tricky up close. Watch for forks, and keep your king active.'),
      {
        id: 'lucena',
        title: 'The Lucena position',
        steps: [
          { kind: 'idea', text: 'The most important winning rook ending. Build a bridge: bring your rook to the fourth rank, so it can block the checks when your king steps out.' },
          { kind: 'endgame', drill: 'lucena' },
        ],
      },
      {
        id: 'philidor',
        title: 'The Philidor defence',
        steps: [
          { kind: 'idea', text: 'The most important drawing rook ending. Keep your rook on the sixth rank so their king can’t come forward; when the pawn advances, go to the back and check from behind.' },
          { kind: 'endgame', drill: 'philidor' },
        ],
      },
      tactic('queen-endings', 'Queen endings', 'queenEndgame', 'With queens on, checks come from everywhere. Look for forks and for ways to trade queens into a won pawn ending.'),
    ],
  },
]

/** Every lesson in order, for unlocking one after another. */
export const ALL_LESSONS: Lesson[] = LEARN_PATH.flatMap((u) => u.lessons)
