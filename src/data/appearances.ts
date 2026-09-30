// How each character looks in their placeholder portrait (design document,
// "Characters and art": head and shoulders, one or two strong cues each,
// muted colours). Drawn in code by components/Portrait.tsx until the
// commissioned art arrives; only this file and that one change then.
import type { Expression } from '../logic/dialogue'

export type HairStyle = 'bun' | 'messy' | 'neat' | 'sides' | 'ponytail' | 'side-part' | 'quiff' | 'swept' | 'receding' | 'bob'
export type Clothes = 'cardigan' | 'hoodie' | 'jumper' | 'shirt' | 'tie' | 'quarter-zip' | 'blazer' | 'polo-neck' | 'polo'
export type Extra = 'glasses-chain' | 'glasses-round' | 'glasses-square' | 'moustache' | 'headphones' | 'bushy-brows'

export type Appearance = {
  /** Circle behind the portrait. */
  background: string
  skin: string
  hair: string
  hairStyle: HairStyle
  clothes: Clothes
  clothesColour: string
  extras: Extra[]
  /** Oscar is eleven: a smaller head, lower down. */
  child?: boolean
  /** Toby's "annoyed" is a tight smile (design document, "Expression sets"). */
  tightSmile?: boolean
  /** How they look while clearly winning, and clearly losing (neutral in between). */
  moods?: { winning: Expression; losing: Expression }
}

export const APPEARANCES: Record<string, Appearance> = {
  marjorie: {
    background: '#b9a38f',
    skin: '#f0d3bd',
    hair: '#d9d6cf',
    hairStyle: 'bun',
    clothes: 'cardigan',
    clothesColour: '#a86a6f',
    extras: ['glasses-chain'],
    moods: { winning: 'pleased', losing: 'annoyed' },
  },
  dex: {
    background: '#7f9c96',
    skin: '#b98563',
    hair: '#2b2320',
    hairStyle: 'messy',
    clothes: 'hoodie',
    clothesColour: '#4f6f78',
    extras: ['headphones'],
    moods: { winning: 'smug', losing: 'annoyed' },
  },
  oscar: {
    background: '#a9b98f',
    skin: '#f3d6c2',
    hair: '#8a5a33',
    hairStyle: 'neat',
    clothes: 'jumper',
    clothesColour: '#34466a',
    extras: [],
    child: true,
    moods: { winning: 'pleased', losing: 'annoyed' },
  },
  neil: {
    background: '#9fa7b3',
    skin: '#eccab2',
    hair: '#6e5a48',
    hairStyle: 'receding',
    clothes: 'polo',
    clothesColour: '#6b8a5c',
    extras: [],
  },
  clive: {
    background: '#a6a28d',
    skin: '#eac8ae',
    hair: '#b7b2a6',
    hairStyle: 'sides',
    clothes: 'shirt',
    clothesColour: '#c2ad84',
    extras: ['moustache'],
    // Never excited, never rattled.
    moods: { winning: 'pleased', losing: 'neutral' },
  },
  priya: {
    background: '#c2a66b',
    skin: '#a8714f',
    hair: '#1f1a1a',
    hairStyle: 'ponytail',
    clothes: 'jumper',
    clothesColour: '#c79a3b',
    extras: ['glasses-round'],
    moods: { winning: 'pleased', losing: 'surprised' },
  },
  graham: {
    background: '#8f9aa8',
    skin: '#efcfb6',
    hair: '#5a4a3c',
    hairStyle: 'side-part',
    clothes: 'tie',
    clothesColour: '#7a2f38',
    extras: ['glasses-square'],
    moods: { winning: 'smug', losing: 'annoyed' },
  },
  toby: {
    background: '#8fa7b8',
    skin: '#f2d2b8',
    hair: '#c9a266',
    hairStyle: 'quiff',
    clothes: 'quarter-zip',
    clothesColour: '#2f3d5c',
    extras: [],
    tightSmile: true,
    moods: { winning: 'smug', losing: 'annoyed' },
  },
  pemberton: {
    background: '#9a8f7c',
    skin: '#e6b79e',
    hair: '#eeebe4',
    hairStyle: 'swept',
    clothes: 'blazer',
    clothesColour: '#3f4a3c',
    extras: ['bushy-brows'],
  },
  // Background members (data/members.ts)
  malcolm: {
    background: '#8c8a9c',
    skin: '#e9c7ad',
    hair: '#9c9790',
    hairStyle: 'side-part',
    clothes: 'blazer',
    clothesColour: '#2f3440',
    extras: ['glasses-square'],
  },
  ray: {
    background: '#9ba58c',
    skin: '#d9a987',
    hair: '#4a3b30',
    hairStyle: 'receding',
    clothes: 'polo',
    clothesColour: '#8a3f3a',
    extras: ['moustache'],
  },
  sheila: {
    background: '#b39a9a',
    skin: '#f2d4c2',
    hair: '#b0603a',
    hairStyle: 'bob',
    clothes: 'cardigan',
    clothesColour: '#5f7a6a',
    extras: [],
  },
  bill: {
    background: '#a39e8e',
    skin: '#ecc9b0',
    hair: '#e6e3dc',
    hairStyle: 'sides',
    clothes: 'shirt',
    clothesColour: '#8fa1b5',
    extras: ['glasses-round'],
  },
  // A loud shirt and hair that has given up. Pleased whichever way it goes.
  terry: {
    background: '#c29a6b',
    skin: '#e8bfa0',
    hair: '#bdb6aa',
    hairStyle: 'messy',
    clothes: 'shirt',
    clothesColour: '#d0703a',
    extras: ['glasses-square'],
    moods: { winning: 'pleased', losing: 'surprised' },
  },
  vera: {
    background: '#7c8290',
    skin: '#efd2c0',
    hair: '#c7c9cc',
    hairStyle: 'bob',
    clothes: 'polo-neck',
    clothesColour: '#2a2a2e',
    extras: [],
    // Her range is deliberately small.
    moods: { winning: 'neutral', losing: 'neutral' },
  },
  // FreeChess's Coach: warm, encouraging, useful (Joseph, Sep 2026).
  coach: { background: '#8fb3ff', skin: '#d6a07a', hair: '#2a1d17', hairStyle: 'swept', clothes: 'quarter-zip', clothesColour: '#3d6fe0', extras: [], moods: { winning: 'pleased', losing: 'pleased' } },
  // FreeChess's bots from around the world (data/bots.ts).
  ada: { background: '#f2b6a0', skin: '#f3d6c2', hair: '#c8733c', hairStyle: 'ponytail', clothes: 'jumper', clothesColour: '#e05d6f', extras: [], child: true, moods: { winning: 'pleased', losing: 'annoyed' } },
  kofi: { background: '#f4c26b', skin: '#6b4630', hair: '#1d1714', hairStyle: 'neat', clothes: 'polo', clothesColour: '#2f8f6b', extras: [], child: true, moods: { winning: 'pleased', losing: 'surprised' } },
  mei: { background: '#b8d4e8', skin: '#f1d4bb', hair: '#1c1918', hairStyle: 'bob', clothes: 'cardigan', clothesColour: '#7fa6c9', extras: ['glasses-round'], child: true },
  mateo: { background: '#9ec6f0', skin: '#d9a57f', hair: '#2b1d16', hairStyle: 'messy', clothes: 'polo', clothesColour: '#6fb3e8', extras: [], moods: { winning: 'smug', losing: 'annoyed' } },
  hanna: { background: '#e3d9b8', skin: '#f5dccb', hair: '#e8d08a', hairStyle: 'ponytail', clothes: 'jumper', clothesColour: '#8fae8a', extras: [] },
  ravi: { background: '#f0c9a0', skin: '#a86f4c', hair: '#1b1512', hairStyle: 'side-part', clothes: 'shirt', clothesColour: '#e8e2d6', extras: ['glasses-square'] },
  yuki: { background: '#cfc3e6', skin: '#f2d9c4', hair: '#161414', hairStyle: 'bob', clothes: 'polo-neck', clothesColour: '#4a4f6a', extras: [], moods: { winning: 'neutral', losing: 'neutral' } },
  lena: { background: '#f5b8c8', skin: '#f4dccd', hair: '#a0623a', hairStyle: 'ponytail', clothes: 'hoodie', clothesColour: '#d95b7c', extras: ['headphones'], child: true },
  amara: { background: '#f7a86a', skin: '#5a3a28', hair: '#141010', hairStyle: 'bun', clothes: 'jumper', clothesColour: '#f2c14e', extras: [], moods: { winning: 'pleased', losing: 'annoyed' } },
  lukas: { background: '#bcc7d1', skin: '#f0d2bc', hair: '#c9a15e', hairStyle: 'neat', clothes: 'quarter-zip', clothesColour: '#3f5a73', extras: [] },
  sofia: { background: '#a8e0c5', skin: '#c98f6a', hair: '#2a1a12', hairStyle: 'ponytail', clothes: 'polo', clothesColour: '#2f9c6c', extras: [] },
  omar: { background: '#e8cf9a', skin: '#b07c58', hair: '#1e1712', hairStyle: 'receding', clothes: 'shirt', clothesColour: '#d9d2c2', extras: ['moustache'], moods: { winning: 'pleased', losing: 'surprised' } },
  jonas: { background: '#aac4dc', skin: '#f3dccd', hair: '#d9c07a', hairStyle: 'swept', clothes: 'jumper', clothesColour: '#b24a3d', extras: ['glasses-round'] },
  fatima: { background: '#e0b2a2', skin: '#b98563', hair: '#1a1412', hairStyle: 'bun', clothes: 'blazer', clothesColour: '#7a3e5c', extras: [], moods: { winning: 'smug', losing: 'annoyed' } },
  tomas: { background: '#f0d08a', skin: '#d8a47c', hair: '#2c1e17', hairStyle: 'quiff', clothes: 'polo', clothesColour: '#c0463a', extras: ['bushy-brows'] },
  olga: { background: '#c8d2e6', skin: '#f1d6c4', hair: '#b58a5e', hairStyle: 'bun', clothes: 'cardigan', clothesColour: '#5a6f8f', extras: [], moods: { winning: 'neutral', losing: 'annoyed' } },
  kenji: { background: '#d8d0c2', skin: '#ecc9ae', hair: '#141212', hairStyle: 'neat', clothes: 'shirt', clothesColour: '#f0ede6', extras: ['glasses-square'], moods: { winning: 'neutral', losing: 'neutral' } },
  diego: { background: '#f5b36a', skin: '#c48b62', hair: '#1e1511', hairStyle: 'messy', clothes: 'shirt', clothesColour: '#3b7dd8', extras: ['moustache'], moods: { winning: 'smug', losing: 'surprised' } },
  chloe: { background: '#d7c6e8', skin: '#f5dfd2', hair: '#6b4127', hairStyle: 'bob', clothes: 'polo-neck', clothesColour: '#2f3a5c', extras: [] },
  aarav: { background: '#b5d8e8', skin: '#b07a55', hair: '#16110f', hairStyle: 'side-part', clothes: 'quarter-zip', clothesColour: '#2c6e8f', extras: ['glasses-round'] },
  ingrid: { background: '#cfe0e8', skin: '#f6e0d4', hair: '#e9dcb0', hairStyle: 'bun', clothes: 'polo-neck', clothesColour: '#8a3b3b', extras: [], moods: { winning: 'neutral', losing: 'annoyed' } },
  nino: { background: '#e8b8b8', skin: '#f0d0bb', hair: '#241a16', hairStyle: 'swept', clothes: 'blazer', clothesColour: '#1f2a44', extras: [], moods: { winning: 'smug', losing: 'annoyed' } },
  samuel: { background: '#b9d6b0', skin: '#4e3223', hair: '#141010', hairStyle: 'neat', clothes: 'blazer', clothesColour: '#2d3b2f', extras: ['glasses-square'], moods: { winning: 'neutral', losing: 'neutral' } },
  elena: { background: '#cdbfdc', skin: '#f1d7c6', hair: '#3a2419', hairStyle: 'bun', clothes: 'blazer', clothesColour: '#4a2d3f', extras: ['glasses-chain'], moods: { winning: 'neutral', losing: 'annoyed' } },
}
