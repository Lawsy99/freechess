// Board preferences that every board reads (FreeChess, Sep 2026, Settings):
// set once from the settings, like the sound, so no screen has to pass them on.
let showLegalMoves = true

/** Dots on the squares a picked-up piece can go to. */
export function setShowLegalMoves(on: boolean): void {
  showLegalMoves = on
}

export function legalMovesShown(): boolean {
  return showLegalMoves
}
