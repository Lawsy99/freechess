// The Learn path (Joseph, Sep 2026): Duolingo-style units of short lessons.
// Every lesson is mostly doing, not reading: a two- or three-sentence idea,
// then drills (Oct 2026, after maiachess.com): you play positions out against
// Maia at your level, and get a report on each. Pass enough to unlock the
// next lesson. That keeps lessons distinct from puzzles: not "find the one
// move", but find it and play on like a real game.
//
// Tactics positions come from real games in the Lichess set, by theme;
// finishing positions from data/endgameDrills.ts; openings from
// data/openingLessons.ts (shown first, then played from move 1).
import type { DrillSpec } from '../logic/drills'
import type { OpeningDrill } from './openingLessons'

export type LearnStep =
  /** The idea, in a few sentences. The only step where you just read. */
  | { kind: 'idea'; text: string }
  /**
   * Drills against Maia: `count` of them, `pass` to be passed. Tactics
   * positions are pitched `offset` from your puzzle rating.
   */
  | { kind: 'drills'; title: string; spec: DrillSpec; count: number; pass: number; offset?: number }
  /** An opening's moves shown and practised, with why (openingLessons.ts), before its drills. */
  | { kind: 'opening'; drill: string }
  /** Build your own set of drills (the Drills card on Learn). */
  | { kind: 'build-drills' }
  /** How the pieces move, hands on (data/rulesTutorial.ts), for complete beginners. */
  | { kind: 'rules' }
  /** Your own opening, as you play it, with the slips put right (logic/myOpenings.ts). */
  | { kind: 'my-opening'; drill: OpeningDrill }

export type Lesson = { id: string; title: string; steps: LearnStep[] }
export type Unit = { id: string; title: string; about: string; colour: string; lessons: Lesson[] }

/** The usual shape: the idea, then positions from real games where it's in the air, played on for a few moves. */
function tactic(id: string, title: string, theme: string, idea: string): Lesson {
  return { id, title, steps: [{ kind: 'idea', text: idea }, themeDrills(title, theme)] }
}

function themeDrills(title: string, theme: string, moves = 6): LearnStep {
  return { kind: 'drills', title, spec: { kind: 'theme', theme, moves }, count: 3, pass: 2, offset: -150 }
}

/** An opening: shown move by move, then played from move 1 against Maia, 10 moves each. */
function opening(id: string, title: string, idea: string): Lesson {
  return {
    id,
    title,
    steps: [
      { kind: 'idea', text: idea },
      { kind: 'opening', drill: id },
      { kind: 'drills', title, spec: { kind: 'opening', opening: id, moves: 10 }, count: 3, pass: 2 },
    ],
  }
}

/** A finishing position, played to the end against Maia. */
function finishing(id: string, title: string, drill: string, idea: string, extra?: LearnStep): Lesson {
  const steps: LearnStep[] = [{ kind: 'idea', text: idea }, { kind: 'drills', title, spec: { kind: 'endgame', drill }, count: 1, pass: 1 }]
  return { id, title, steps: extra ? [...steps, extra] : steps }
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
      finishing('lone-king', 'Mate a lone king', 'lone-king', 'With a big material advantage, the win is checkmate, and you need a method. Push the king to the edge, step by step, then mate it. Watch out for stalemate: always leave it a move.'),
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
      opening('italian', 'The Italian Game (White)', 'Control the centre, bring out your knights and bishops, castle. The Italian does all three: e4, Nf3, Bc4 aiming at f7, then castle.'),
      opening('london', 'The London System (White)', 'A solid set-up you can play against almost anything: d4, Bf4, e3, Nf3, then c3 and Bd3. Easy to learn, hard to beat.'),
      opening('black-e4', 'Answering 1.e4 (Black)', 'Meet e4 with e5: claim your share of the centre, then develop just as White does.'),
      opening('black-d4', 'Answering 1.d4 (Black)', 'Meet d4 with d5, and develop solidly: knights out, bishop out, castle.'),
      opening('queens-gambit', 'The Queen’s Gambit (White)', 'After d4 d5, play c4: it attacks their centre pawn from the side. If they take, you win the pawn back. Then develop and castle.'),
      opening('ruy-lopez', 'The Ruy Lopez (White)', 'Like the Italian, but the bishop goes to b5, attacking the knight that guards e5. Castle, Re1, c3, then d4 for a big centre.'),
      opening('caro-kann', 'The Caro-Kann (Black)', 'Against e4: c6, then d5. Bring your light bishop out before playing e6, so it isn’t shut in. Solid and safe.'),
      opening('sicilian', 'The Sicilian (Black)', 'Against e4: c5. When White plays d4, swap your c-pawn for their centre pawn, then develop fast. Sharp and full of chances.'),
      tactic('opening-traps', 'Opening tricks', 'opening', 'Games are often decided in the first ten moves by a loose piece or a trap. Find the winning idea in each of these openings.'),
    ],
  },
  {
    id: 'endgames',
    title: 'Endgames',
    about: 'Turn an advantage into a win.',
    colour: '#f5c04a',
    lessons: [
      finishing('king-pawn', 'King and pawn', 'king-pawn', 'In pawn endings the king is a fighting piece. Put it in front of your pawn, and use the opposition: kings facing each other, the one not to move wins the ground.', themeDrills('Pawn endgames', 'pawnEndgame', 8)),
      finishing('queen-mate', 'Mate with the queen', 'queen-mate', 'A queen and king against a lone king is always a win, if you avoid stalemate. Box the king in with your queen, a knight’s move away, then bring your king up to help.'),
      finishing('rook-mate', 'Mate with the rook', 'rook-mate', 'Harder than the queen, but always a win. Your rook cuts the king off; your king does the pushing. Take the opposition, then check.'),
      finishing('key-squares', 'Key squares', 'key-squares', 'In king and pawn endings, your king wins by reaching a key square: two ranks in front of the pawn. Get there first, and the pawn walks home.'),
      finishing('opposition', 'Hold the draw', 'opposition', 'A pawn down is often only a draw if you know how. Stand face to face with their king, one square between, and make them move first: the opposition.'),
      tactic('promotion', 'Promotion', 'promotion', 'A pawn that reaches the end becomes a queen. Clear its path, push it, and watch out for the pieces that can stop it.'),
      finishing('rook-endings', 'Rook endings', 'rook-ending', 'The most common endings of all. Rooks belong behind passed pawns, and the king comes forward. Cut the enemy king off with your rook.', themeDrills('Rook endgames', 'rookEndgame', 8)),
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
      finishing('lucena', 'The Lucena position', 'lucena', 'The most important winning rook ending. Build a bridge: bring your rook to the fourth rank, so it can block the checks when your king steps out.'),
      finishing('philidor', 'The Philidor defence', 'philidor', 'The most important drawing rook ending. Keep your rook on the sixth rank so their king can’t come forward; when the pawn advances, go to the back and check from behind.'),
      tactic('queen-endings', 'Queen endings', 'queenEndgame', 'With queens on, checks come from everywhere. Look for forks and for ways to trade queens into a won pawn ending.'),
    ],
  },
]

/** Every lesson in order, for unlocking one after another. */
export const ALL_LESSONS: Lesson[] = LEARN_PATH.flatMap((u) => u.lessons)
