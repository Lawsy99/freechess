// The illustrated faces (FreeChess, Sep 2026; Joseph chose the "Illustrated"
// style, by Micah Lanier, CC BY 4.0, drawn with the DiceBear library). Each
// character's face is put together from parts chosen to suit them: skin,
// hair, clothes, glasses, a beard, earrings. Expressions change the eyes,
// eyebrows and mouth (components/Portrait.tsx). Colours are hex, without "#".
import type { Expression } from '../logic/dialogue'

export type FaceHair = 'fonze' | 'mrT' | 'dougFunny' | 'mrClean' | 'dannyPhantom' | 'full' | 'turban' | 'pixie'

export type Face = {
  /** The circle behind them. */
  bg: string
  skin: string
  hair: FaceHair
  hairColour?: string
  /** Eyelashes on the eyebrows (the style's way of drawing women and girls). */
  lashes?: boolean
  shirt: 'open' | 'crew' | 'collared'
  shirtColour: string
  glasses?: 'round' | 'square'
  beard?: 'beard' | 'scruff'
  earrings?: 'hoop' | 'stud'
  /** Annoyed as a tight, nervous smile (Toby, who never shows it). */
  tightSmile?: boolean
  /** How they look when clearly winning or losing (pleased and annoyed unless set). */
  moods?: { winning: Expression; losing: Expression }
}

/** Most people look pleased when winning and put out when losing. */
export const DEFAULT_MOODS: { winning: Expression; losing: Expression } = { winning: 'pleased', losing: 'annoyed' }

// Skin tones, lightest to deepest.
const S = { l1: 'f6d7c3', l2: 'f0c8a8', m1: 'e0a97e', m2: 'c68a5e', d1: 'a36b45', d2: '7d4f31', d3: '5a3622' }

export const FACES: Record<string, Face> = {
  coach: { bg: '8fb3ff', skin: S.m2, hair: 'dannyPhantom', hairColour: '2a1d17', shirt: 'collared', shirtColour: '3d6fe0' },

  // Beginner
  bo: { bg: 'ffd56b', skin: S.l2, hair: 'dougFunny', hairColour: 'e0b25a', shirt: 'crew', shirtColour: 'e05d6f', moods: { winning: 'pleased', losing: 'surprised' } },
  grace: { bg: 'f7c59f', skin: S.d2, hair: 'pixie', hairColour: 'd9d6cf', lashes: true, glasses: 'round', shirt: 'open', shirtColour: '2f8f6b', earrings: 'stud' },
  finn: { bg: 'a8e0a0', skin: S.l1, hair: 'fonze', hairColour: 'c8612a', shirt: 'collared', shirtColour: '2f7a3d' },
  ada: { bg: 'f2b6a0', skin: S.l1, hair: 'full', hairColour: 'c8612a', lashes: true, shirt: 'crew', shirtColour: 'e05d6f' },
  kofi: { bg: 'f4c26b', skin: S.d2, hair: 'fonze', hairColour: '1d1714', shirt: 'crew', shirtColour: '2f8f6b' },
  mei: { bg: 'b8d4e8', skin: S.l1, hair: 'pixie', hairColour: '1c1918', lashes: true, glasses: 'round', shirt: 'crew', shirtColour: '7fa6c9' },
  sheila: { bg: 'f0b9b9', skin: S.l1, hair: 'pixie', hairColour: 'b0603a', lashes: true, shirt: 'open', shirtColour: '5f7a6a', earrings: 'stud' },
  mateo: { bg: '9ec6f0', skin: S.m1, hair: 'fonze', hairColour: '2b1d16', shirt: 'crew', shirtColour: '6fb3e8' },
  hanna: { bg: 'e3d9b8', skin: S.l1, hair: 'full', hairColour: 'e8d08a', lashes: true, shirt: 'crew', shirtColour: '8fae8a' },
  bill: { bg: 'c9c3b3', skin: S.l2, hair: 'dougFunny', hairColour: 'e6e3dc', glasses: 'round', shirt: 'collared', shirtColour: '8fa1b5' },
  ravi: { bg: 'f0c9a0', skin: S.d1, hair: 'fonze', hairColour: '1b1512', glasses: 'square', shirt: 'collared', shirtColour: 'e8e2d6' },
  yuki: { bg: 'cfc3e6', skin: S.l1, hair: 'pixie', hairColour: '161414', lashes: true, shirt: 'crew', shirtColour: '4a4f6a' },
  oscar: { bg: 'b9d49a', skin: S.l1, hair: 'fonze', hairColour: '8a5a33', shirt: 'crew', shirtColour: '34466a' },
  lena: { bg: 'f5b8c8', skin: S.l1, hair: 'full', hairColour: 'a0623a', lashes: true, shirt: 'open', shirtColour: 'd95b7c', earrings: 'hoop' },
  amara: { bg: 'f7a86a', skin: S.d3, hair: 'pixie', hairColour: '141010', lashes: true, shirt: 'crew', shirtColour: 'f2c14e', earrings: 'hoop' },
  terry: { bg: 'e0b98a', skin: S.l2, hair: 'mrT', hairColour: 'bdb6aa', glasses: 'square', shirt: 'collared', shirtColour: 'd0703a' },
  lukas: { bg: 'bcc7d1', skin: S.l1, hair: 'fonze', hairColour: 'c9a15e', shirt: 'collared', shirtColour: '3f5a73' },
  omar: { bg: 'e8cf9a', skin: S.d1, hair: 'dougFunny', hairColour: '1e1712', beard: 'beard', shirt: 'open', shirtColour: 'd9d2c2' },
  sofia: { bg: 'a8e0c5', skin: S.m2, hair: 'full', hairColour: '2a1a12', lashes: true, shirt: 'crew', shirtColour: '2f9c6c' },

  // Intermediate
  mina: { bg: 'f5c2d6', skin: S.l1, hair: 'full', hairColour: '1c1918', lashes: true, shirt: 'crew', shirtColour: '9b6bd8', earrings: 'stud' },
  luca: { bg: 'bfe3c0', skin: S.m1, hair: 'fonze', hairColour: '2b1d16', beard: 'scruff', shirt: 'open', shirtColour: 'c0463a' },
  zeynep: { bg: 'c7d7f2', skin: S.m1, hair: 'full', hairColour: '4a2a1c', lashes: true, glasses: 'round', shirt: 'crew', shirtColour: '3b7dd8' },
  thandi: { bg: 'f3d27a', skin: S.d3, hair: 'pixie', hairColour: '141010', lashes: true, shirt: 'collared', shirtColour: '1f6f5c', earrings: 'hoop' },
  minh: { bg: 'd3e6b8', skin: S.l2, hair: 'dannyPhantom', hairColour: '141212', shirt: 'crew', shirtColour: '4a4f6a', moods: { winning: 'neutral', losing: 'neutral' } },
  marjorie: { bg: 'd9b9a6', skin: S.l1, hair: 'pixie', hairColour: 'd9d6cf', lashes: true, glasses: 'round', shirt: 'open', shirtColour: 'a86a6f', earrings: 'stud' },
  jonas: { bg: 'aac4dc', skin: S.l1, hair: 'dannyPhantom', hairColour: 'd9c07a', glasses: 'round', shirt: 'crew', shirtColour: 'b24a3d' },
  dex: { bg: '9fd0c8', skin: S.d1, hair: 'mrT', hairColour: '4f86f7', shirt: 'open', shirtColour: '4f6f78', earrings: 'stud' },
  fatima: { bg: 'e0b2a2', skin: S.d1, hair: 'full', hairColour: '1a1412', lashes: true, shirt: 'open', shirtColour: '7a3e5c', earrings: 'hoop' },
  clive: { bg: 'cfc8ae', skin: S.l2, hair: 'dougFunny', hairColour: 'b7b2a6', beard: 'scruff', shirt: 'collared', shirtColour: 'c2ad84' },
  tomas: { bg: 'f0d08a', skin: S.m1, hair: 'fonze', hairColour: '2c1e17', beard: 'scruff', shirt: 'collared', shirtColour: 'c0463a' },
  graham: { bg: 'b8c2cf', skin: S.l1, hair: 'dannyPhantom', hairColour: '5a4a3c', glasses: 'square', shirt: 'collared', shirtColour: '7a2f38' },
  olga: { bg: 'c8d2e6', skin: S.l1, hair: 'pixie', hairColour: 'b58a5e', lashes: true, shirt: 'open', shirtColour: '5a6f8f' },
  kenji: { bg: 'd8d0c2', skin: S.l2, hair: 'fonze', hairColour: '141212', glasses: 'square', shirt: 'collared', shirtColour: 'f0ede6' },
  priya: { bg: 'e2c58b', skin: S.d1, hair: 'full', hairColour: '1f1a1a', lashes: true, glasses: 'round', shirt: 'crew', shirtColour: 'c79a3b', earrings: 'stud' },
  diego: { bg: 'f5b36a', skin: S.m2, hair: 'fonze', hairColour: '1e1511', beard: 'beard', shirt: 'open', shirtColour: '3b7dd8' },
  chloe: { bg: 'd7c6e8', skin: S.l1, hair: 'pixie', hairColour: '6b4127', lashes: true, shirt: 'crew', shirtColour: '2f3a5c', earrings: 'stud' },

  // Advanced
  isabel: { bg: 'f5b36a', skin: S.m2, hair: 'full', hairColour: '2a1a12', lashes: true, shirt: 'open', shirtColour: 'f2c14e', earrings: 'hoop' },
  pieter: { bg: 'ffc38a', skin: S.l1, hair: 'fonze', hairColour: 'e8d08a', glasses: 'square', shirt: 'crew', shirtColour: 'ff8a2b' },
  toby: { bg: 'a9c4d6', skin: S.l1, hair: 'fonze', hairColour: 'c9a266', shirt: 'collared', shirtColour: '2f3d5c', tightSmile: true },
  aarav: { bg: 'b5d8e8', skin: S.d1, hair: 'dannyPhantom', hairColour: '16110f', glasses: 'round', shirt: 'crew', shirtColour: '2c6e8f' },
  ray: { bg: 'c2cba9', skin: S.m1, hair: 'dougFunny', hairColour: '4a3b30', beard: 'scruff', shirt: 'collared', shirtColour: '8a3f3a' },
  ingrid: { bg: 'cfe0e8', skin: S.l1, hair: 'full', hairColour: 'e9dcb0', lashes: true, shirt: 'crew', shirtColour: '8a3b3b' },
  malcolm: { bg: 'b3b1c4', skin: S.l2, hair: 'dannyPhantom', hairColour: '9c9790', glasses: 'square', shirt: 'collared', shirtColour: '2f3440' },

  // Master
  tariq: { bg: 'b9d6b0', skin: S.d1, hair: 'fonze', hairColour: '141010', beard: 'beard', shirt: 'collared', shirtColour: '1f6f3d', moods: { winning: 'smug', losing: 'annoyed' } },
  leila: { bg: 'd9c2e8', skin: S.m1, hair: 'turban', hairColour: '3a2f5c', lashes: true, glasses: 'round', shirt: 'collared', shirtColour: '3a2f5c', moods: { winning: 'neutral', losing: 'surprised' } },
  nino: { bg: 'e8b8b8', skin: S.l1, hair: 'full', hairColour: '241a16', lashes: true, shirt: 'open', shirtColour: '1f2a44', earrings: 'hoop' },
  samuel: { bg: 'b9d6b0', skin: S.d3, hair: 'mrClean', beard: 'scruff', glasses: 'square', shirt: 'collared', shirtColour: '2d3b2f' },
  elena: { bg: 'cdbfdc', skin: S.l1, hair: 'pixie', hairColour: '3a2419', lashes: true, glasses: 'round', shirt: 'collared', shirtColour: '4a2d3f', earrings: 'stud' },
}
